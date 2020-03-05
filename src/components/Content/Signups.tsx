import React, {Component, ChangeEvent} from 'react'
import { User } from 'firebase/app'
import './Signups.css'
import { SignupForm, SignupFormProps } from './SignupForm'


interface SignupProps {
    authedUser: User
}

interface SignupState {
    forms: SignupFormProps[],
    messageText: string,
}

export default class Signups extends Component<SignupProps, SignupState> {
    constructor(props: SignupProps) {
        super(props)
        this.state = {
            forms: [],
            messageText: ''
        }
    }
    componentDidMount() {
        fetch('http://localhost:8000/activeforms').then(res => res.json()).then((response) => {
            if (response.forms) {
                this.setState({
                    forms: response.forms,
                    messageText: ''
                })
            } else {
                this.setState({
                    ...this.state,
                    messageText: 'There are no active signup forms at this time'
                })
            }
        })
    }
    render() {
        if (this.state.messageText) {
            return (<p>{this.state.messageText}</p>)
        }
        return (
            <div className='signupsContainer'>
                {this.state.forms.map((form: SignupFormProps) => {
                    return (
                        <div key={form.id} className="formContainer">
                            <SignupForm 
                                title={form.title} 
                                id={form.id} 
                                closes={form.closes} 
                                options={form.options} 
                                authedUser={this.props.authedUser
                            }></SignupForm>
                        </div>
                    )
                })}
            </div>
        )
    }
}