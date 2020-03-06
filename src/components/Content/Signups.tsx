import React, {Component} from 'react'
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
        fetch(`${process.env.REACT_APP_SERVER_API}/activeforms`)
        .then((res) => {
            if (res.ok) {
                return res.json()
            }
            return res.json().then(err => Promise.reject(err))
        })
        .then((response) => {
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
        }).catch((err) => {
            let messageText = 'There was an error retrieving the signups - Please use our google form (posted on facebook) instead'
            if (err.message) {
                messageText = err.message
            }
            this.setState({
                forms: [],
                messageText
            })
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