import React, {Component} from 'react'
import { Result, Button, notification, Spin } from 'antd'
import { JoinForm } from './JoinForm'
import './MainJoin.css'
import { AumtMember } from '../../../types'
import FirebaseUtil from '../../../services/firebase.util'

interface MainJoinProps {
    authedUser: AumtMember | null
    authedUserId: string
    loadingAuthedUser: boolean
    clubSignupStatus: 'open' | 'closed' | 'loading'
    clubSignupSem: 'S1' | 'S2'
}

interface MainJoinState {}

export class MainJoin extends Component<MainJoinProps, MainJoinState> {
    onSignOutClick = () => {
        FirebaseUtil.signOut()
            .catch((err) => {
                notification.error({message: 'Error signing out: ' + err.toString()})
            })
    }
    render() {
        if (this.props.clubSignupStatus === 'loading' || this.props.loadingAuthedUser) {
            return <Spin/>
        } else if (this.props.authedUser) {
            return (
                <Result
                    status='success'
                    title='You are a member of AUMT!'
                    subTitle={this.props.authedUser.paid === 'Yes' ? 'Our records show you have paid, you are all set to sign up for trainings'
                    : 'Please pay the membership fee to finalise your membership.'}
                    extra={
                        this.props.clubSignupStatus === 'open' ?
                        [
                        <p key='1'><Button type='link' className='joinResultSignOut' onClick={this.onSignOutClick}>
                            Sign Out</Button> to go back to the Join form
                            </p>
                        ] : []}
                ></Result>
            )
        } else if (this.props.clubSignupStatus === 'closed') {
            return (
                <div>
                    Signups are closed until the next Semester starts.
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