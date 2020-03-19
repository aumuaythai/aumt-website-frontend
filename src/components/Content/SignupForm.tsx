import React, {Component} from 'react'
import {Radio, Button, Alert, Tooltip } from 'antd'
import { RadioChangeEvent } from 'antd/lib/radio';
import './SignupForm.css'
import { AumtTrainingSession, AumtMember } from '../../types'

export interface SignupFormProps {
    title: string
    id: string
    closes: Date
    sessions: AumtTrainingSession[]
    authedUser: AumtMember
    notes: string
}

interface SignupFormState {
    currentOption: string
    signedUpOption: string
    submittingState: boolean
    errorMessage: string
}

export class SignupForm extends Component<SignupFormProps, SignupFormState> {
    constructor(props: SignupFormProps) {
        super(props)
        this.state = {
            currentOption: '',
            errorMessage: '',
            signedUpOption: '',
            submittingState: false
        }
    }
    componentDidMount() {
        // TODO
        // check if has signed up
        // sign up
    }
    onOptionChange = (e: RadioChangeEvent) => {
        this.setState({
            currentOption: e.target.value,
        });
    }
    onSubmitClick = () => {
        // const optionSelected = this.state.currentOption
        this.setState({
            ...this.state,
            errorMessage: '',
            // submittingState: true
        })
        // submit form
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
                    <Radio.Group className="Group" onChange={this.onOptionChange} value={this.state.currentOption}>
                        {this.props.sessions.map((session) => {
                            const isFull = session.limit <= session.members.length
                            const spotsLeft = session.limit - session.members.length
                            return (
                                <div key={session.title} className="optionLine">
                                    <Tooltip title={isFull ? 'Class full' : ''} placement='left'>
                                        <Radio className='sessionOption' disabled={isFull} value={session.title}>{session.title}</Radio> {spotsLeft < 10 ? (<span className='spotsLeftText'>({spotsLeft} spots left)</span>) : ''}
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