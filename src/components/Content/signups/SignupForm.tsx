import React, {Component} from 'react'
import {Spin, Radio, Button, Select, Alert, Tooltip, notification, Input, Tag } from 'antd'
import { RadioChangeEvent } from 'antd/lib/radio';
import { CheckSquareTwoTone } from '@ant-design/icons'
import './SignupForm.css'
import { AumtTrainingSession, AumtMembersObjWithCollated } from '../../../types'
import db from '../../../services/db';
import dataUtil from '../../../services/data.util';

export interface SignupFormProps {
    title: string
    id: string
    closes: Date
    sessions: AumtTrainingSession[]
    displayName: string | null
    authedUserId: string | null
    notes: string
    useInterSem: boolean
    onSignupChanged?: () => void
}

interface SignupFormState {
    currentSessionId: string
    currentFeedback: string
    signedUpOption: string
    submittingState: boolean
    currentDisplayName: string
    errorMessage: string
    removingState: boolean
    interSemMembers: AumtMembersObjWithCollated
}

export class SignupForm extends Component<SignupFormProps, SignupFormState> {
    constructor(props: SignupFormProps) {
        super(props)
        this.state = {
            currentSessionId: '',
            currentFeedback: '',
            currentDisplayName: '',
            errorMessage: '',
            signedUpOption: '',
            submittingState: false,
            removingState: false,
            interSemMembers: {}
        }
    }
    componentDidMount() {
        this.checkSignedUp()
        if (this.props.useInterSem) {
            db.getAllInterSemMembers()
                .then(dataUtil.getCollatedMembersObj)
                .then((members) => {
                    this.setState({
                        ...this.state,
                        interSemMembers: members
                    })
                })
        }
    }
    componentDidUpdate(prevProps: SignupFormProps, prevState: SignupFormState) {
        if (prevProps.authedUserId === '' && this.props.authedUserId) {
            this.checkSignedUp()
        }
    }
    checkSignedUp = () => {
        if (this.props.authedUserId) {
            db.isMemberSignedUpToForm(this.props.authedUserId, this.props.id)
                .then((sessionId: string) => {
                    if (sessionId) {
                        this.setState({
                            ...this.state,
                            signedUpOption: sessionId,
                            currentSessionId: sessionId
                        })
                    }
                })
                .catch((err) => {
                    notification.error({
                        message: 'Error retrieving if already signed up: ' + err
                    })
                })
        }
    }
    memberSort = (uidA: string, uidB: string): number => {
        const nameA = this.state.interSemMembers[uidA].collated
        const nameB = this.state.interSemMembers[uidB].collated
        return nameA > nameB ? 1 : -1
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
                .then((sessionId: string) => {
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
                    notification.error({message: 'Could not remove from training: ' + err.toString()})
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
        } else if (!this.props.displayName && !this.state.currentDisplayName) {
            this.setState({
                ...this.state,
                errorMessage: 'You must enter your name'
            })
            return
        }
        this.setState({
            ...this.state,
            errorMessage: '',
            submittingState: true
        })

        db.signUserUp(
                this.props.authedUserId || this.generateMockUid(),
                this.props.displayName || this.state.currentDisplayName,
                new Date(),
                this.props.id,
                optionSelected,
                this.state.currentFeedback)
            .then((res) => {
                this.setState({
                    ...this.state,
                    signedUpOption: optionSelected,
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
                {this.props.notes ?
                    (<div className="trainingNotesContainer">
                        {this.props.notes}
                    </div>) :
                    ''
                }
                <div className="optionsContainer">
                    <Radio.Group className="trainingSignupRadioGroup" onChange={this.onOptionChange} value={this.state.currentSessionId}>
                        {this.props.sessions.map((session) => {
                            const isFull = session.limit <= Object.keys(session.members).length
                            const spotsLeft = Math.max(0, session.limit - Object.keys(session.members).length)
                            return (
                                <div key={session.title} className="optionLine">
                                    <Tooltip title={isFull ? 'Class full' : ''} placement='left'>
                                        <Radio
                                            className='sessionOption'
                                            disabled={isFull}
                                            value={session.sessionId}>{session.title}
                                        </Radio> 
                                    </Tooltip>
                                        <Tag className='spotsLeftTag' color={spotsLeft === 0 ? 'error' : spotsLeft < 10 ? 'warning': 'blue'}>{spotsLeft} spots left</Tag>
                                        {this.state.signedUpOption === session.sessionId ? <CheckSquareTwoTone twoToneColor="#52c41a" /> : ''}
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
                :
                this.props.useInterSem ?
                <div className='feedbackInputContainer'>
                    <Select className='interSemCollatedSelect' placeholder='Select your Name'>
                        {Object.keys(this.state.interSemMembers).sort((a, b) => this.memberSort(a, b)).map((uid: string) => {
                            const member = this.state.interSemMembers[uid]
                            return <Select.Option key={uid} value={member.collated}>
                                {member.collated}
                            </Select.Option>
                        })}
                    </Select>
                </div>
                :
                <div className="feedbackInputContainer">
                    <p>Enter your Full Name</p>
                    <Input onChange={e => this.onDisplayNameChange(e.target.value)}/>
                </div>
                }
                <div className="messageContainer">
                    {(() => {return this.state.errorMessage ? <Alert type='error' message={this.state.errorMessage}></Alert> : ''})()}
                </div>
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