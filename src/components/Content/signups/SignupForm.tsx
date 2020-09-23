import React, {Component} from 'react'
import {Spin, Radio, Button, Alert, Tooltip, Input, Tag } from 'antd'
import { RadioChangeEvent } from 'antd/lib/radio';
import { CheckSquareTwoTone } from '@ant-design/icons'
import './SignupForm.css'
import { AumtTrainingSession } from '../../../types'
import db from '../../../services/db';
import { RenderMarkdown } from '../../Admin/utility/RenderMarkdown';

export interface SignupFormProps {
    title: string
    id: string
    closes: Date
    sessions: Record<string, AumtTrainingSession>
    displayName: string | null
    submittingAsName?: string
    authedUserId: string | null
    notes: string
    openToPublic: boolean
    showNotes: boolean
    onSignupChanged?: () => void
}

interface SignupFormState {
    currentSessionId: string
    currentFeedback: string
    signedUpOption: string
    submittingState: boolean
    currentDisplayName: string
    currentMockUid: string
    errorMessage: string
    removingState: boolean
}

const SPOTS_TAG_LIMIT = 5

export class SignupForm extends Component<SignupFormProps, SignupFormState> {
    constructor(props: SignupFormProps) {
        super(props)
        this.state = {
            currentSessionId: '',
            currentFeedback: '',
            currentDisplayName: '',
            currentMockUid: '',
            errorMessage: '',
            signedUpOption: '',
            submittingState: false,
            removingState: false
        }
    }
    componentDidMount() {
        this.checkSignedUp()
    }
    componentDidUpdate(prevProps: SignupFormProps, prevState: SignupFormState) {
        if (prevProps.authedUserId === '' && this.props.authedUserId) {
            this.checkSignedUp()
        }
    }
    checkSignedUp = () => {
        if (this.props.authedUserId) {
            Object.values(this.props.sessions).forEach((session) => {
                if (this.props.authedUserId && session.members[this.props.authedUserId]) {
                    this.setState({
                        ...this.state,
                        signedUpOption: session.sessionId,
                        currentSessionId: session.sessionId
                    })
                }
            })
        }
    }
    onOptionChange = (e: RadioChangeEvent) => {
        this.setState({
            ...this.state,
            currentSessionId: e.target.value,
            errorMessage: ''
        });
    }
    onFeedbackChange = (feedback: string) => {
        this.setState({
            ...this.state,
            currentFeedback: feedback
        })
    }
    onDisplayNameChange = (name: string) => {
        this.setState({
            ...this.state,
            currentDisplayName: name
        })
    }
    generateMockUid = () => {
        let alphabet = '1234567890qwertyuiopasdfghjklzxcvbnm'
        let uid = 'NONMEMBER'
        for (let i = 0; i < 10; i++) {
            uid += alphabet[Math.floor(Math.random() * alphabet.length)]
        }
        return uid
    }
    onRemoveClick = () => {
        if (this.state.signedUpOption && this.props.authedUserId) {
            this.setState({
                ...this.state,
                removingState: true
            })
            db.removeMemberFromForm(this.props.authedUserId, this.props.id, this.state.signedUpOption)
                .then(() => {
                    this.setState({
                        ...this.state,
                        signedUpOption: '',
                        currentSessionId: '',
                        removingState: false
                    })
                    if (this.props.onSignupChanged) {
                        this.props.onSignupChanged()
                    }
                })
                .catch((err) => {
                    this.setState({
                        ...this.state,
                        removingState: false,
                        errorMessage: 'Error removing signup:' + err.toString()
                    })
                })
        }
    }
    onSubmitClick = () => {
        const optionSelected = this.state.currentSessionId
        if (!optionSelected) {
            this.setState({
                ...this.state,
                errorMessage: 'You must select a session'
            })
            return
        } else if (!this.props.authedUserId && !this.state.currentDisplayName) {
            this.setState({
                ...this.state,
                errorMessage: 'You must provide your name'
            })
            return
        }
        this.setState({
            ...this.state,
            errorMessage: '',
            submittingState: true
        })
        const uid = this.props.authedUserId || this.state.currentMockUid || this.generateMockUid()

        db.signUserUp(
                uid,
                this.props.displayName || this.state.currentDisplayName,
                new Date(),
                this.props.id,
                optionSelected,
                this.state.currentFeedback,
                this.state.signedUpOption)
            .then(() => {
                this.setState({
                    ...this.state,
                    signedUpOption: optionSelected,
                    currentMockUid: uid,
                    submittingState: false,
                })
                if (this.props.onSignupChanged) {
                    this.props.onSignupChanged()
                }
            })
            .catch((err) => {
                this.setState({
                    ...this.state,
                    submittingState: false,
                    errorMessage: 'Error signing up: ' + err.toString()
                })
            })
    }
    render() {
        return (
            <div>
                <h2 className="formTitle">{this.props.title}</h2>
                {this.props.notes && this.props.showNotes ?
                    (<div className="trainingNotesContainer">
                        <RenderMarkdown source={this.props.notes}></RenderMarkdown>
                    </div>) :
                    ''
                }
                <div className="optionsContainer">
                    <Radio.Group className="trainingSignupRadioGroup" onChange={this.onOptionChange} value={this.state.currentSessionId}>
                        {Object.values(this.props.sessions)
                        .sort((a, b) => a.position - b.position)
                        .map((session) => {
                            const isFull = session.limit <= Object.keys(session.members).length
                            const spotsLeft = Math.max(0, session.limit - Object.keys(session.members).length)
                            return (
                                <div key={session.title} className="optionLine">
                                    <Tooltip title={isFull ? 'Class full' : ''} placement='left'>
                                        <Radio
                                            className='sessionOption'
                                            disabled={isFull}
                                            value={session.sessionId}>
                                                {session.title}
                                            {spotsLeft <= SPOTS_TAG_LIMIT ? 
                                            <Tag className='spotsLeftTag' color={spotsLeft === 0 ? 'error' : spotsLeft < 10 ? 'warning': 'blue'}>{spotsLeft} spots left</Tag>
                                            : ''}
                                            {this.state.signedUpOption === session.sessionId ? <CheckSquareTwoTone className='signedUpOptionCheck' twoToneColor="#52c41a" /> : ''}
                                        </Radio> 
                                    </Tooltip>
                                </div>
                            )
                        })}
                    </Radio.Group>
                </div>
                {this.props.authedUserId ? 
                    <div className="feedbackInputContainer">
                        <p>Thoughts on last training/feedback?</p>
                        <Input.TextArea autoSize={{ maxRows: 6 }} placeholder='Feedback will be sent anonymously' onChange={e => this.onFeedbackChange(e.target.value)}/>
                    </div>
                :  this.props.openToPublic ?
                    <div className="feedbackInputContainer">
                        <p>Enter your Full Name</p>
                        <Input placeholder={'Enter your Full Name'} onChange={e => this.onDisplayNameChange(e.target.value)}/>
                    </div>
                : '' }
                <div className="messageContainer">
                    {(() => {return this.state.errorMessage ? <Alert type='error' message={this.state.errorMessage}></Alert> : ''})()}
                </div>
                {this.props.submittingAsName ? 
                    <div className="aboveSubmitSignupFormText">Submitting as {`${this.props.submittingAsName}`}</div>
                : ''}
                <Button
                    block
                    className='signupFormButton'
                    type='primary'
                    size='large'
                    loading={this.state.submittingState}
                    onClick={this.onSubmitClick}>Submit</Button>
                {this.props.authedUserId ?
                <Button disabled={!this.state.signedUpOption} type='link' className='signupFormRemove' onClick={this.onRemoveClick} block>
                    {this.state.removingState ? <span><Spin className='signupFormRemoveLoadingIcon'/> </span>: ''} Remove Signup
                </Button> : ''
                }
            </div>
        )
    }
}