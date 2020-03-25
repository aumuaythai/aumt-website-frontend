import React, {Component} from 'react'
import './Signups.css'
import {SyncOutlined} from '@ant-design/icons'
import { SignupForm } from './SignupForm'
import { AumtWeeklyTraining, AumtMember } from '../../../types'
import db from '../../../services/db'
import { notification } from 'antd'


interface SignupProps {
    authedUser: AumtMember
    authedUserId: string
}

interface SignupState {
    forms: AumtWeeklyTraining[]
    noFormText: string,
    loadingForms: boolean
}

export class Signups extends Component<SignupProps, SignupState> {
    constructor(props: SignupProps) {
        super(props)
        this.state = {
            forms: [],
            noFormText: '',
            loadingForms: false
        }
    }
    componentDidMount() {
        this.setState({
            ...this.state,
            loadingForms: true
        })
        db.getOpenForms()
            .then((forms) => {
                this.setState({
                    forms: forms,
                    loadingForms: false,
                    noFormText: forms.length ? '' : 'There are no active signup forms at this time. If there is a training next week, signups open Sunday.'
                })
            })
            .catch((err) => {
                notification.error({
                    message: 'Error getting weekly trainings from db: ' + JSON.stringify(err)
                })
                this.setState({
                    ...this.state,
                    loadingForms: false
                })
            })
    }
    render() {
        if (this.state.loadingForms) {
            return (<p>Retrieving Sessions <SyncOutlined spin/></p>)
        }
        if (!this.state.forms.length) {
            return (<p>{this.state.noFormText}</p>)
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