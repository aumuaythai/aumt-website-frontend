import React, {Component, ChangeEvent} from 'react'
import { User } from 'firebase/app'
import { Radio, Button, Tooltip } from 'antd';
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
    submittingState: boolean
}

export class SignupForm extends Component<SignupFormProps, SignupFormState> {
    constructor(props: SignupFormProps) {
        super(props)
        this.state = {
            currentOption: '',
            submittingState: false
        }
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
            submittingState: true
        })
        console.log(optionSelected)
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
                                            })()}
                                        </Radio>
                                    </Tooltip>
                                </div>
                            )
                        })}
                    </Radio.Group>
                </div>
                <Button onClick={this.onSubmitClick}>Submit</Button>
            </div>
        )
    }
}