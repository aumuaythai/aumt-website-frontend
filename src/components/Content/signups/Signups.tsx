import React, {Component} from 'react'
import { Link } from 'react-router-dom'
import {Spin, notification, Divider } from 'antd'
import './Signups.css'
import { SignupForm } from './SignupForm'
import { AumtWeeklyTraining, AumtMember, ClubConfig } from '../../../types'
import db from '../../../services/db'
import DataFormatterUtil from '../../../services/data.util'

interface SignupProps {
    authedUser: AumtMember | null
    authedUserId: string | null
    paid: boolean
    clubSignupSem: 'S1' | 'S2' | 'loading' | 'SS'
    clubConfig: ClubConfig | null
}

interface SignupState {
    forms: AumtWeeklyTraining[]
    noFormText: string,
    loadingForms: boolean
    dbListenerIds: string[]
}

class Signups extends Component<SignupProps, SignupState> {
    constructor(props: SignupProps) {
        super(props)
        this.state = {
            forms: [],
            noFormText: '',
            loadingForms: false,
            dbListenerIds: []
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
                    dbListenerIds: forms.map(f => db.listenToOneTraining(f.trainingId, this.onDbChanges))
                })
                this.handleNewForms(forms)
            })
            .catch((err) => {
                notification.error({
                    message: 'Error getting weekly trainings from db: ' + JSON.stringify(err)
                })
                this.setState({
                    ...this.state,
                    loadingForms: false,
                    noFormText: 'Error getting weekly trainings from db: ' + JSON.stringify(err)
                })
            })
    }
    onDbChanges = (formId: string, newFormData: AumtWeeklyTraining) => {
        const newForms = this.state.forms.slice()
        for (const idx in this.state.forms) {
            if (this.state.forms[idx].trainingId === formId) {
                newForms[idx] = newFormData
                break
            }
        }
        this.handleNewForms(newForms)
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
            noFormText: forms.length ? '' : 'Weekly training slots will open on Sundays, if there are trainings next week.'
        })
    }
    componentWillUnmount = () => {
        this.state.dbListenerIds.forEach(db.unlisten)
    }
    render() {
        if (this.state.loadingForms || this.props.clubSignupSem === 'loading') {
            return (<div><Spin/></div>)
        }
        if (!this.state.forms.length) {
            return (<p>{this.state.noFormText}</p>)
        }
        return (
            <div className='signupsContainer'>
                {this.state.forms
                    .map((form) => {
                        if (!form.openToPublic) {
                            if (!this.props.authedUserId) {
                                return (
                                    <div key={form.trainingId}>
                                        <h2>{form.title}</h2>
                                        <p>You must <Link to='/login?from=/signups'> log in </Link> to view and sign up!</p>
                                        <h4>Not a member?</h4>
                                        <p><Link to='/join'>Join the club!</Link> Club signups are open at the beginning of each semester.</p>
                                        <Divider/>
                                    </div>
                                )
                            } else if (this.props.authedUser && 
                                (this.props.authedUser.paid === 'Yes' || !form.paymentLock) && 
                                (this.props.authedUser.membership === form.semester || 
                                    (this.props.authedUser.membership === 'FY' && form.semester !== 'SS'))) {
                                return (
                                    <div key={form.trainingId} className="formContainer">
                                        <SignupForm
                                            title={form.title} 
                                            id={form.trainingId} 
                                            closes={form.closes} 
                                            sessions={form.sessions} 
                                            displayName={this.getDisplayName()}
                                            showNotes={true}
                                            submittingAsName={this.props.authedUser ?
                                                `${this.props.authedUser.preferredName || this.props.authedUser.firstName} ${this.props.authedUser.lastName}`
                                                : ''}
                                            authedUserId={this.props.authedUserId}
                                            notes={form.notes}
                                            signupMaxSessions={form.signupMaxSessions}
                                            openToPublic={form.openToPublic}/>
                                    </div>
                                );
                            } else if (this.props.authedUser 
                                && ((this.props.authedUser.membership === 'FY' && form.semester === 'SS') || (this.props.authedUser.membership !== 'FY' && this.props.authedUser.membership !== form.semester))) {
                                return (
                                    <div key={form.trainingId} className='signupsNotPaidContainer'>
                                        <h2>{form.title}</h2>
                                        <p>Your membership is out of date, please update it by going to the <Link to="/account">My Account</Link> tab.</p>
                                    </div>
                                );
                            } else {
                                return (
                                    <div key={form.trainingId} className='signupsNotPaidContainer'>
                                        <h2>{form.title}</h2>
                                        <p>Our records show you have not paid the membership fee for this semester - once you do, you can sign up to trainings!</p>
                                        
                                        <Divider/>

                                        <h3>This Week Only</h3>
                                        <p>
                                            If you would like to pay at the training, message the AUMT Facebook page - we will sign you up for the session of your choice.
                                        </p>
                                        <br/>
                                        
                                    </div>
                                );
                            }
                        } else {
                            return (
                                <div key={form.trainingId} className="formContainer">
                                    <SignupForm
                                        title={form.title} 
                                        id={form.trainingId} 
                                        closes={form.closes} 
                                        sessions={form.sessions} 
                                        displayName={this.getDisplayName()}
                                        showNotes={true}
                                        submittingAsName={this.props.authedUser ?
                                            `${this.props.authedUser.preferredName || this.props.authedUser.firstName} ${this.props.authedUser.lastName}`
                                            : ''}
                                        authedUserId={this.props.authedUserId}
                                        notes={form.notes}
                                        signupMaxSessions={form.signupMaxSessions}
                                        openToPublic={form.openToPublic} />
                                </div>
                            )       
                        }
                    })
                }
            </div>
        )
    }
}

export default Signups