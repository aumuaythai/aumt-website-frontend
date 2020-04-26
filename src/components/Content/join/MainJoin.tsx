import React, {Component} from 'react'
import { Result, Button, notification } from 'antd'
import { JoinForm } from './JoinForm'
import './MainJoin.css'
import { AumtMember } from '../../../types'
import FirebaseUtil from '../../../services/firebase.util'

interface MainJoinProps {
    authedUser: AumtMember | null
    authedUserId: string
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
        return (
            <div>
                {this.props.authedUser ?
                <Result
                    status='success'
                    title='You are a member of AUMT!'
                    subTitle={this.props.authedUser.paid === 'Yes' ? 'Our records show you have paid, you are all set to sign up for trainings'
                    : 'Please pay the membership fee to finalise your membership.'}
                    extra={[
                        <p><Button type='link' className='joinResultSignOut' onClick={this.onSignOutClick}>Sign Out</Button> to go back to the Join form</p>
                    ]}
                ></Result>
                 : <JoinForm isAdmin={false}></JoinForm>}
            </div>
        )
    }
}