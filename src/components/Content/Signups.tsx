import React, {Component} from 'react'
import './Signups.css'
import { SignupForm } from './SignupForm'
import { AumtWeeklyTraining, AumtMember } from '../../types'
import db from '../../services/db'
import { notification } from 'antd'


interface SignupProps {
    authedUser: AumtMember
    authedUserId: string
}

interface SignupState {
    forms: AumtWeeklyTraining[]
    messageText: string
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
        this.setState({
            ...this.state,
            messageText: 'Retrieving sessions...'
        })
        db.getOpenForms()
            .then((forms) => {
                this.setState({
                    forms: forms,
                    messageText: forms.length ? '' : 'There are no active signup forms at this time. If there is a training next week, signups open Sunday.'
                })
            })
            .catch((err) => {
                notification.error({
                    message: 'Error getting weekly trainings from db: ' + JSON.stringify(err)
                })
            })
    }
    render() {
        if (!this.state.forms.length) {
            return (<p>{this.state.messageText}</p>)
        }
        return (
            <div className='signupsContainer'>
                {this.state.forms.map((form) => {
                    return (
                        <div key={form.trainingId} className="formContainer">
                            <SignupForm
                                title={form.title} 
                                id={form.trainingId} 
                                closes={form.closes} 
                                sessions={form.sessions} 
                                authedUser={this.props.authedUser}
                                authedUserId={this.props.authedUserId}
                                notes={form.notes}
                                ></SignupForm>
                            </div>
                        )
                    })}
            </div>
        )
    }
}