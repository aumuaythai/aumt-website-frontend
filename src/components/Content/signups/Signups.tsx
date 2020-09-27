import React, {Component} from 'react'
import { Link } from 'react-router-dom'
import {Spin, notification, Button, Divider } from 'antd'
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
    dbListenerIds: string[]
}

class Signups extends Component<SignupProps, SignupState> {
    private isFirstUpdate = true
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
            noFormText: forms.length ? '' : 'There are no active signup forms at this time. If there is a training next week, signups open Sunday.'
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
                                return <div key={form.trainingId}>
                                    <h2>{form.title}</h2>
                                    <p>You must <Link to='/login?from=/signups'> log in </Link> to view and sign up!</p>
                                    <h4>Not a member?</h4>
                                    <p><Link to='/join'>Join the club!</Link> Club signups are open at the beginning of each semester.</p>
                                    <Divider/>
                                </div>
                            } else if (this.props.authedUser && this.props.authedUser.paid === 'No') {
                                return <div key={form.trainingId} className='signupsNotPaidContainer'>
                                    <h2>{form.title}</h2>
                                    <p>Our records show you have not paid the membership fee - once you do, you can sign up to trainings!</p>

                                    <h3>This Week Only</h3>
                                    If you would like to pay at the training, message the AUMT Facebook page - we will sign you up for the session of your choice.
                                    <Divider/>

                                    
                                    <p>Membership is $50 for the semester and can be paid by cash to a committee member or transfer to the bank account below (with your NAME in the reference).</p>
                                    <p>06-0158-0932609-00 <Button type='link' onClick={e => this.copyText('06-0158-0932609-00')}>Copy Account Number</Button></p>
                                    <Divider/>
                                </div>
                            }
                        }
                        // Can view form
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
                                    signupMaxSessions={Object.keys(form.sessions).length}
                                    openToPublic={form.openToPublic}
                                    ></SignupForm>
                                </div>
                            )
                    })}
            </div>
        )
    }
}

export default Signups