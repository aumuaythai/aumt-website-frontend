import React, {Component} from 'react'
import {Radio, Button, Alert, Tooltip, notification } from 'antd'
import { CheckCircleOutlined } from '@ant-design/icons'
import { RadioChangeEvent } from 'antd/lib/radio';
import './SignupForm.css'
import { AumtTrainingSession, AumtMember } from '../../types'
import db from '../../services/db';

export interface SignupFormProps {
    title: string
    id: string
    closes: Date
    sessions: AumtTrainingSession[]
    authedUser: AumtMember
    authedUserId: string
    notes: string
}

interface SignupFormState {
    currentSessionId: string
    signedUpOption: string
    submittingState: boolean
    errorMessage: string
}

export class SignupForm extends Component<SignupFormProps, SignupFormState> {
    constructor(props: SignupFormProps) {
        super(props)
        this.state = {
            currentSessionId: '',
            errorMessage: '',
            signedUpOption: '',
            submittingState: false
        }
    }
    componentDidMount() {
        this.checkSignedUp()
    }
    checkSignedUp = () => {
        db.isMemberSignedUpToForm(this.props.authedUserId, this.props.id)
            .then((sessionId: string) => {
                if (sessionId) {
                    this.setState({
                        ...this.state,
                        signedUpOption: sessionId
                    })
                }
            })
            .catch((err) => {
                notification.error({
                    message: 'Error retrieving if already signed up: ' + err
                })
            })
    }
    onOptionChange = (e: RadioChangeEvent) => {
        this.setState({
            currentSessionId: e.target.value,
        });
    }
    onSubmitClick = () => {
        const optionSelected = this.state.currentSessionId
        this.setState({
            ...this.state,
            errorMessage: '',
            submittingState: true
        })
        db.signUserUp(this.props.authedUserId, this.props.id, optionSelected)
            .then((res) => {
                console.log(res)
                this.setState({
                    ...this.state,
                    signedUpOption: optionSelected,
                    submittingState: false,
                })
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
                    <Radio.Group className="Group" onChange={this.onOptionChange} value={this.state.currentSessionId}>
                        {this.props.sessions.map((session) => {
                            const isFull = session.limit <= session.members.length
                            const spotsLeft = session.limit - session.members.length
                            return (
                                <div key={session.title} className="optionLine">
                                    <Tooltip title={isFull ? 'Class full' : ''} placement='left'>
                                        <Radio
                                            className='sessionOption'
                                            disabled={isFull}
                                            value={session.sessionId}>{session.title}
                                        </Radio> {spotsLeft < 10 ? (<span className='spotsLeftText'>({spotsLeft} spots left)</span>) : ''}
                                        {this.state.signedUpOption === session.sessionId ? <span className='signedUpOptionText'>Signed up <CheckCircleOutlined /></span> : ''}
                                    </Tooltip>
                                </div>
                            )
                        })}
                    </Radio.Group>
                </div>
                <div className="messageContainer">
                    {(() => {return this.state.errorMessage ? <Alert type='error' message={this.state.errorMessage}></Alert> : ''})()}
                </div>
                <Button type='primary' loading={this.state.submittingState} onClick={this.onSubmitClick}>Submit</Button>
            </div>
        )
    }
}