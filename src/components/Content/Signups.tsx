import React, {Component} from 'react'
import './Signups.css'
import { SignupForm } from './SignupForm'
import { AumtWeeklyTraining, AumtMember } from '../../types'


interface SignupProps {
    authedUser: AumtMember
}

interface SignupState {
    form: AumtWeeklyTraining | null
    messageText: string
}

export default class Signups extends Component<SignupProps, SignupState> {
    constructor(props: SignupProps) {
        super(props)
        this.state = {
            form: null,
            messageText: ''
        }
    }
    componentDidMount() {
        // TODO
        // get active form from db, show it
        // add {id} to form
    }
    render() {
        if (!this.state.form) {
            return (<p>{this.state.messageText}</p>)
        }
        const {form} = this.state
        return (
            <div className='signupsContainer'>
                <div className="formContainer">
                    <SignupForm 
                        title={form.title} 
                        id={form.trainingId} 
                        closes={form.closes} 
                        sessions={form.sessions} 
                        authedUser={this.props.authedUser
                    }></SignupForm>
                </div>
            </div>
        )
    }
}