import React, {Component} from 'react'
import { User } from 'firebase/app'
import {Radio, Button, Tooltip, Alert} from 'antd'
import CheckCircleOutlined from '@ant-design/icons/CheckCircleOutlined'
import './Signups.css'
import { RadioChangeEvent } from 'antd/lib/radio';
import './SignupForm.css'

export interface SignupOption {
    id: string
    text: string
    occupied?: number
    limit?: number
}
export interface SignupFormProps {
    title: string
    id: string
    closes: number // UTC time
    options: SignupOption[]
    authedUser: User
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
        fetch(`${process.env.REACT_APP_SERVER_API}/hassignedup`, {
            method: 'POST',
            headers: {
                'content-type': 'application/json'
            },
            body: JSON.stringify({
                formId: this.props.id,
                email: this.props.authedUser.email
            })
        })
        .then((res) => {
            if (res.ok) {
                return res.json()
            }
            throw new Error()
        })
        .then((res) => {
            const {signedUpOption} = res
            if (signedUpOption && this.props.options.find((option) => option.id === signedUpOption)) {
                this.setState({
                    ...this.state,
                    signedUpOption: signedUpOption
                })
            }
        })
        .catch((err) => {
            console.log('error checking if has signed up')
        })
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
        // const optionText = this.props.options.find((option) => {
        //     return option.id === optionSelected
        // })?.text
        fetch(`${process.env.REACT_APP_SERVER_API}/submitsignup`, {
            method: 'POST',
            headers: {
                'content-type': 'application/json'
            },
            body: JSON.stringify({
                email: this.props.authedUser.email,
                formId: this.props.id,
                optionId: this.state.currentOption,
                previousOptionId: this.state.signedUpOption || null
            })
        })
        .then((res) => {
            if (res.ok) {
                return res.json()
            }
            return res.json().then(err => Promise.reject(err))
        })
        .then((res) => {
            this.setState({
                ...this.state,
                submittingState: false,
                signedUpOption: optionSelected
            })
        })
        .catch((err) => {
            console.log('error caught', err)
            this.setState({
                ...this.state,
                errorMessage: err.message,
                submittingState: false
            })
        })
    }
    render() {
        return (
            <div>
                <h2 className="formTitle">{this.props.title}</h2>
                <div className="optionsContainer">
                    <Radio.Group className="Group" onChange={this.onOptionChange} value={this.state.currentOption}>
                        {this.props.options.map((option: SignupOption) => {
                            const areOptions = !!(option.occupied && option.limit)
                            const spotsLeft = areOptions && ((option && option.limit || 0) - (option && option.occupied || -1))
                            const isFull = !!option.occupied && !!option.limit && option.occupied >= option.limit
                            return (
                                <div key={option.id} className="optionLine">
                                    <Tooltip title={isFull ? 'Class full' : ''} placement='left'>
                                        <Radio disabled={isFull} value={option.id}>
                                            {option.text} {(() => {
                                                return spotsLeft > -1 && spotsLeft < 10 ? 
                                                    <span className='spotsLeft'>
                                                        {(`(${spotsLeft} spots left)`)}
                                                    </span> : 
                                                    '' 
                                            })()} {(() => {
                                                return this.state.signedUpOption === option.id ? 
                                                    <span className='check'><CheckCircleOutlined/> Signed Up</span> : ''
                                            })()}
                                        </Radio>
                                    </Tooltip>
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