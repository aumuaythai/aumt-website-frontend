import React, {Component} from 'react'
import { Link } from 'react-router-dom'
import {Spin, notification } from 'antd'
import './Signups.css'
import { SignupForm } from './SignupForm'
import { AumtWeeklyTraining, AumtMember } from '../../../types'
import db from '../../../services/db'


interface SignupProps {
    authedUser: AumtMember | null
    authedUserId: string | null
}

interface SignupState {
    forms: AumtWeeklyTraining[]
    noFormText: string,
    loadingForms: boolean
    dbListenerId: string
}

export class Signups extends Component<SignupProps, SignupState> {
    private isFirstUpdate = true
    constructor(props: SignupProps) {
        super(props)
        this.state = {
            forms: [],
            noFormText: '',
            loadingForms: false,
            dbListenerId: ''
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
                    ...this.state,
                    loadingForms: false,
                    dbListenerId: db.listenToTrainings(this.onDbChanges)
                })
                this.handleNewForms(forms)
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
    onDbChanges = (newForms: AumtWeeklyTraining[]) => {
        const now = new Date()
        const openForms = newForms.filter(f => f.closes > now && f.opens < now)
        if (openForms !== this.state.forms) {
            this.handleNewForms(openForms)  
        }
    }
    getDisplayName = (): string | null => {
        if (this.props.authedUser) {
            const displayName = this.props.authedUser.firstName + 
                (this.props.authedUser.preferredName ? ` "${this.props.authedUser.preferredName}" ` : ' ') +
                this.props.authedUser.lastName
            return displayName
        } else {
            return null
        }
    }
    handleNewForms = (forms: AumtWeeklyTraining[]) => {
        this.setState({
            forms: forms,
            noFormText: forms.length ? '' : 'There are no active signup forms at this time. If there is a training next week, signups open Sunday.'
        })
    }
    componentWillUnmount = () => {
        db.unlisten(this.state.dbListenerId)
    }
    render() {
        if (this.state.loadingForms) {
            return (<div>Retrieving Sessions <Spin/></div>)
        }
        if (!this.state.forms.length) {
            return (<p>{this.state.noFormText}</p>)
        }
        if (!this.props.authedUserId && !this.state.forms.find(f => f.openToPublic)) {
            return (
                <div>
                    <p>You must be signed in to view trainings.</p>
                    <h4>Not a member?</h4>
                    <p><Link to='/join'>Join the club!</Link> Club signups are open at the beginning of each semester.</p>
                </div>
            )
        }
        return (
            <div className='signupsContainer'>
                {this.state.forms.map((form) => {
                    if (form.openToPublic) {
                        return (
                            <div key={form.trainingId} className='formContainer'>
                                <SignupForm
                                    title={form.title} 
                                    id={form.trainingId} 
                                    closes={form.closes} 
                                    sessions={form.sessions} 
                                    displayName={this.getDisplayName()}
                                    authedUserId={this.props.authedUserId}
                                    notes={form.notes}
                                    ></SignupForm>
                            </div>
                        )
                    } else if (this.props.authedUserId) {
                        return (
                            <div key={form.trainingId} className="formContainer">
                                <SignupForm
                                    title={form.title} 
                                    id={form.trainingId} 
                                    closes={form.closes} 
                                    sessions={form.sessions} 
                                    displayName={this.getDisplayName()}
                                    authedUserId={this.props.authedUserId}
                                    notes={form.notes}
                                    ></SignupForm>
                                </div>
                            )
                    } else {
                        return ''
                    }
                    })}
            </div>
        )
    }
}