import React, {Component} from 'react'
import {Radio, Button, Tooltip, Alert} from 'antd'
import CheckCircleOutlined from '@ant-design/icons/CheckCircleOutlined'
import { RadioChangeEvent } from 'antd/lib/radio';
import './SignupForm.css'
import { AumtTrainingSession, AumtMember } from '../../types'

export interface SignupFormProps {
    title: string
    id: string
    closes: number // UTC time
    sessions: {
        [sessionId: string]: AumtTrainingSession
    }
    authedUser: AumtMember
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
        const optionSelected = this.state.currentOption
        this.setState({
            ...this.state,
            errorMessage: '',
            submittingState: true
        })
        // submit form
    }
    render() {
        return (
            <div>
                <h2 className="formTitle">{this.props.title}</h2>
                <div className="optionsContainer">
                    <Radio.Group className="Group" onChange={this.onOptionChange} value={this.state.currentOption}>
                        {Object.keys(this.props.sessions).map((key: string) => {
                            const session = this.props.sessions[key]
                            return (
                                <div key={session.title} className="optionLine">
                                    {/* <Tooltip title={isFull ? 'Class full' : ''} placement='left'> */}
                                        <Radio value={session.title}></Radio>
                                    {/* </Tooltip> */}
                                </div>
                            )
                        })}
                    </Radio.Group>
                </div>
                <div className="messageContainer">
                    {(() => {return this.state.errorMessage ? <Alert type='error' message={this.state.errorMessage}></Alert> : ''})()}
                </div>
                <Button loading={this.state.submittingState} onClick={this.onSubmitClick}>Submit</Button>
            </div>
        )
    }
}