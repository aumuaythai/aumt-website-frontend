import React, {Component} from 'react'
import { Link } from 'react-router-dom'
import { Result, Button, notification, Spin } from 'antd'
import { JoinForm } from './JoinForm'
import './MainJoin.css'
import { AumtMember } from '../../../types'
import FirebaseUtil from '../../../services/firebase.util'
import dataUtil from '../../../services/data.util'

interface MainJoinProps {
    authedUser: AumtMember | null
    authedUserId: string
    loadingAuthedUser: boolean
    clubSignupStatus: 'open' | 'closed' | 'loading'
    clubSignupSem: 'S1' | 'S2' | 'loading'
}

interface MainJoinState {}

export class MainJoin extends Component<MainJoinProps, MainJoinState> {
    onSignOutClick = () => {
        FirebaseUtil.signOut()
            .catch((err) => {
                notification.error({message: 'Error signing out: ' + err.toString()})
            })
    }
    copyText = (text: string) => {
        dataUtil.copyText(text)
    }
    getExtraResultContent = () => {
        const lines: JSX.Element[] = []
        if (this.props.authedUser?.paid === 'No') {
            lines.push(
                <p className='joinAccountLine'>The membership fee is $50 and should be paid with your full name as the reference to: 06-0158-0932609-00
                    <Button type='link' onClick={e => this.copyText('06-0158-0932609-00')}>Copy Account Number</Button></p>
            )
        }
        if (this.props.clubSignupStatus === 'open') {
            lines.push(
                <p key='1'>
                    <Button type='link' className='joinResultSignOut' onClick={this.onSignOutClick}>
                        Log out 
                    </Button>
                    and return to the signup page, or 
                    <Link to='/'>
                        <Button className='joinResultSignOut' type='link'>visit home page</Button>
                    </Link>
                </p>
            )
        } 
        return lines
    }
    render() {
        if (this.props.clubSignupStatus === 'loading' || this.props.clubSignupSem === 'loading' || this.props.loadingAuthedUser) {
            return <Spin/>
        } else if (this.props.authedUser) {
            return (
                <Result
                    className='joinResult'
                    status='success'
                    title='You are a member of AUMT!'
                    subTitle={(this.props.authedUser.paid === 'Yes' ? 'Our records show you have paid, you are all set to sign up for trainings.'
                    : 'Please pay the membership fee to finalise your membership.') + 
                    ' Keep an eye out for announcements and next steps by email, Instagram and Facebook!'}
                    extra={this.getExtraResultContent()}
                ></Result>
            )
        } else if (this.props.clubSignupStatus === 'closed') {
            return (
                <div>
                    Signups are closed until the next semester starts. Follow us on
                        <a href="https://www.instagram.com/aumuaythai/" target='_blank' rel="noopener noreferrer"> Instagram </a>
                        or 
                        <a href="https://www.facebook.com/aumuaythai/"> Facebook </a>
                        for announcements.
                </div>
            )
        }
        return (
            <div>
                <JoinForm clubSignupSem={this.props.clubSignupSem} isAdmin={false}></JoinForm>
            </div>
        )
    }
}