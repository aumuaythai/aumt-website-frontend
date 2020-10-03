import React, {Component} from 'react'
import {Spin, Checkbox, Button, Alert, Tooltip, Input, Tag } from 'antd'
import { CheckSquareTwoTone } from '@ant-design/icons'
import './SignupForm.css'
import { AumtTrainingSession } from '../../../types'
import db from '../../../services/db';
import { CheckboxOptionType } from 'antd/lib/checkbox';
import { CheckboxValueType } from 'antd/lib/checkbox/Group';
import { RenderMarkdown } from '../../utility/RenderMarkdown';

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
    signupMaxSessions: number
}

interface SignupFormState {
    currentSessionIds: string[]
    currentFeedback: string
    signedUpOptions: string[]
    submittingState: boolean
    currentDisplayName: string
    currentMockUid: string
    errorMessage: string
    removingState: boolean
}

const SPOTS_TAG_LIMIT = 5 // Infinity

export class SignupForm extends Component<SignupFormProps, SignupFormState> {
    private sessionHistory: string[] = []
    private advancedInfoText = 'Please make sure you have asked Victor before joining the advanced session and remember to bring a mouthguard - if one of these conditions isn\'t met we may stop you from training!'
    constructor(props: SignupFormProps) {
        super(props)
        this.state = {
            currentSessionIds: [],
            currentFeedback: '',
            currentDisplayName: '',
            currentMockUid: '',
            errorMessage: '',
            signedUpOptions: [],
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
            const signedUpSessions: string[] = []
            Object.values(this.props.sessions).forEach((session) => {
                if (this.props.authedUserId && session.members[this.props.authedUserId]) {
                    signedUpSessions.push(session.sessionId)
                }
            })
            this.setState({
                ...this.state,
                signedUpOptions: signedUpSessions,
                currentSessionIds: signedUpSessions
            })
        }
    }
    isAdvancedSelected = () => {
        return this.state.currentSessionIds.some((sessionId) => {
            return this.props.sessions[sessionId]?.title?.toLowerCase().indexOf('advanced') !== -1
        })
    }
    onOptionChange = (e: CheckboxValueType[]) => {
        let ids = e.map(i => i.toString())
        const newId = ids.find(i => !this.state.currentSessionIds.includes(i))
        if (newId) {
            this.sessionHistory = this.sessionHistory.filter(s => s !== newId)
            this.sessionHistory.push(newId)
            if (ids.length > this.props.signupMaxSessions) {
                ids = this.sessionHistory.slice(this.sessionHistory.length - this.props.signupMaxSessions)
            }
        }
        this.setState({
            ...this.state,
            currentSessionIds: ids,
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
        if (this.state.signedUpOptions.length && this.props.authedUserId) {
            this.setState({
                ...this.state,
                removingState: true
            })
            db.removeMemberFromForm(this.props.authedUserId, this.props.id, this.state.signedUpOptions)
                .then(() => {
                    this.setState({
                        ...this.state,
                        signedUpOptions: [],
                        currentSessionIds: [],
                        removingState: false,
                        errorMessage: ''
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
        const selectedSessions = this.state.currentSessionIds
        if (selectedSessions.length === 0) {
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
                selectedSessions,
                this.state.currentFeedback,
                this.state.signedUpOptions)
            .then(() => {
                this.setState({
                    ...this.state,
                    signedUpOptions: selectedSessions,
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
    getCheckboxGroup = (sessions: Record<string, AumtTrainingSession>): CheckboxOptionType[] => {
        return Object.values(sessions)
            .sort((a, b) => a.position - b.position)
            .map((session) => {
                const isFull = session.limit <= Object.keys(session.members).length
                const spotsLeft = Math.max(0, session.limit - Object.keys(session.members).length)
                const label = (
                    <span key={session.title} className="optionLine">
                        <Tooltip title={isFull ? 'Class full' : ''} placement='left'>
                            <span className='signupFormSessionTitle'>{session.title}
                                {this.state.signedUpOptions.includes(session.sessionId) ? <CheckSquareTwoTone className='signedUpOptionCheck' twoToneColor="#52c41a" /> : ''}
                            </span>
                            {spotsLeft <= SPOTS_TAG_LIMIT ? 
                            <Tag className='spotsLeftTag' color={spotsLeft === 0 ? 'error' : spotsLeft < 10 ? 'warning': 'blue'}>{spotsLeft} spots left</Tag>
                            : ''}
                        </Tooltip>
                    </span>
                )
                return {
                    label,
                    value: session.sessionId,
                    disabled: isFull,
                    style: {width: '100%','marginRight':0}
                }
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
                    <Checkbox.Group 
                        value={this.state.currentSessionIds}
                        onChange={this.onOptionChange}
                        options={this.getCheckboxGroup(this.props.sessions)}></Checkbox.Group>
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
                    {this.state.errorMessage ? <Alert type='error' message={this.state.errorMessage}></Alert> : ''}
                </div>
                {this.isAdvancedSelected() ? <Alert type='info' className='signupFormInfoTextContainer' showIcon message={this.advancedInfoText}></Alert> :''}
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
                <Button disabled={!this.state.signedUpOptions.length} type='link' className='signupFormRemove' onClick={this.onRemoveClick} block>
                    {this.state.removingState ? <span><Spin className='signupFormRemoveLoadingIcon'/> </span>: ''} Remove Signup{this.state.signedUpOptions.length > 1 ? 's' : ''}
                </Button> : ''
                }
            </div>
        )
    }
}