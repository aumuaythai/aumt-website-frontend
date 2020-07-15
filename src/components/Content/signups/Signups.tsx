import React, {Component} from 'react'
import { Link } from 'react-router-dom'
import {Spin, notification, Button } from 'antd'
import './Signups.css'
import { SignupForm } from './SignupForm'
import { AumtWeeklyTraining, AumtMember } from '../../../types'
import db from '../../../services/db'
import DataFormatterUtil from '../../../services/data.util'


interface SignupProps {
    authedUser: AumtMember | null
    authedUserId: string | null
    paid: boolean
    clubSignupSem: 'S1' | 'S2' | 'loading'
}

interface SignupState {
    forms: AumtWeeklyTraining[]
    noFormText: string,
    loadingForms: boolean
    dbListenerId: string
}

class Signups extends Component<SignupProps, SignupState> {
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
    copyText = (text: string) => {
        DataFormatterUtil.copyText(text)
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
    canViewForm = (form: AumtWeeklyTraining) => {
        if (form.openToPublic || form.useInterSemMembers) {
            return true
        }
        if (this.props.authedUserId) {
            const membership = this.props.authedUser?.membership
            return this.props.paid && (membership === 'FY' || membership === this.props.clubSignupSem)
        }
        return false
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
        const areOpenForms = this.state.forms.find(f => f.openToPublic || f.useInterSemMembers)
        if (this.state.loadingForms || this.props.clubSignupSem === 'loading') {
            return (<div><Spin/></div>)
        }
        if (!this.props.authedUserId && !areOpenForms) {
            return (
                <div>
                    <h2>AUMT Training Signups happen here.</h2>
                    <p>You must <Link to='/login'>sign in</Link> to view trainings.</p>
                    <p>Not a member?</p>
                    <p><Link to='/join'>Join the club!</Link> Club signups are open at the beginning of each semester.</p>
                </div>
            )
        }
        if (!areOpenForms && this.props.authedUserId && !this.props.paid) {
            return (
                <div className='signupsNotPaidContainer'>
                    <h4>Our records show you have not paid the membership fee - once you do you can sign up to trainings!</h4>
                    <p>Membership is $50 for the semester or $90 for the year and can be paid by cash to a committee member or transfer to the bank account below (with your NAME in the reference).</p>
                    <p>06-0158-0932609-00 <Button type='link' onClick={e => this.copyText('06-0158-0932609-00')}>Copy Account Number</Button></p>
                </div>
            )
        }
        if (!this.state.forms.length) {
            return (<p>{this.state.noFormText}</p>)
        }
        return (
            <div className='signupsContainer'>
                {this.state.forms
                    .filter(this.canViewForm)
                    .map((form) => {
                        return (
                            <div key={form.trainingId} className="formContainer">
                                <SignupForm
                                    title={form.title} 
                                    id={form.trainingId} 
                                    closes={form.closes} 
                                    sessions={form.sessions} 
                                    displayName={this.getDisplayName()}
                                    submittingAsName={this.props.authedUser ?
                                        `${this.props.authedUser.preferredName || this.props.authedUser.firstName} ${this.props.authedUser.lastName}`
                                        : ''}
                                    authedUserId={this.props.authedUserId}
                                    notes={form.notes}
                                    openToPublic={form.openToPublic}
                                    useInterSem={form.useInterSemMembers}
                                    ></SignupForm>
                                </div>
                            )

                    })}
            </div>
        )
    }
}

export default Signups