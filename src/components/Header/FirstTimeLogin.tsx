import React, { Component } from 'react'
import {Button, Input, Alert} from 'antd'
import UserOutlined from '@ant-design/icons/UserOutlined'
import './FirstTimeLogin.css'
import FirebaseUtil from '../../services/firebase.util'

export interface FirstTimeLoginProps {

}
export interface FirstTimeLoginState {
    username: string
    authing: boolean
    errorMessage: string
    successMessage: string
}


export class FirstTimeLogin extends Component<FirstTimeLoginProps, FirstTimeLoginState> {
    constructor(props: FirstTimeLoginProps) {
        super(props)
        this.state = {
            username: '',
            authing: false,
            errorMessage: '',
            successMessage: ''
        }
    }
    onJoinedUsernameChange = (username: string) => {
        this.setState({
            ...this.state,
            username
        })
    }
    verifyJoinedEmail = () => {
        this.setState({
            ...this.state,
            authing: true,
            errorMessage: '',
            successMessage: ''
        })
        FirebaseUtil.signIn(this.state.username, 'woeiefnsodfnlswenf')
            .catch((err) => {
                const {code, message} = err
                console.log(code, message)
                if (code === 'auth/wrong-password') {
                    return FirebaseUtil.sendPasswordResetEmail(this.state.username)
                } else {
                    if (code === 'auth/user-not-found') {
                        this.setState({
                            ...this.state,
                            errorMessage: 'That email isn\'t in our records 😔. We have emails of all paid members with either Full Year or Sem One deferred memberships. Please contact the committee.',
                            authing: false
                        })
                    } else if (code === 'auth/invalid-email') {
                        this.setState({
                            ...this.state,
                            errorMessage: 'Invalid Email',
                            authing: false
                        })
                    } else if (code === 'auth/network-request-failed') {
                        this.setState({
                            ...this.state,
                            errorMessage: 'Could not connect to firebase. Try again later or contact the committee.',
                            authing: false
                        })
                    } else {
                        this.setState({
                            ...this.state,
                            errorMessage: `Error code: ${code}. Contact the Committee`,
                            authing: false,
                        })
                    }
                    document.getElementById('errorElementContainer')?.scrollIntoView()
                    return Promise.reject('Unable to send reset email')
                }
            })
            .then(() => {
                this.setState({
                    ...this.state,
                    authing: false,
                    errorMessage: '',
                    successMessage: 'Email sent. Follow the link in the email to confirm your account - then you can sign in!'
                })
                document.getElementById('errorElementContainer')?.scrollIntoView()
            })
            .catch((err) => {
                if (err === 'Unable to send reset email') {
                    // error from above already handled
                } else {
                    // error sending reset email
                    this.setState({
                        ...this.state,
                        errorMessage: `Unable to send reset email. Contact the committee.`
                    })
                }
                document.getElementById('errorElementContainer')?.scrollIntoView()
                console.log(err)
            })
    }
    render() {
        return (
            <div className="firstTimeLoginContainer">
                <h3 className='firstTimeLoginHeader'>Already joined in Sem 1?</h3>
                <p className='joinedMemberText'>We created accounts for everyone who signed up in semester 1 2020.
                    All you need to do is choose a password to confirm your membership for Sem 2!</p>
                <p className="joinedMemberText">Enter your email:</p>
                    <Input
                        type='email'
                        className='loginInput'
                        // ref={(input) => { this.emailInput = input; }}
                        placeholder="email"
                        onChange={e => this.onJoinedUsernameChange(e.target.value)}
                        onPressEnter={this.verifyJoinedEmail}
                        prefix={<UserOutlined />} />
                <Button
                    onClick={this.verifyJoinedEmail}
                    loading={this.state.authing}>Create Password</Button>
                <div className="clearBoth"></div>
                <div id="errorElementContainer">
                {this.state.errorMessage ? 
                    <Alert className='joinedEmailError' type='error' message={this.state.errorMessage}></Alert>
                    :
                this.state.successMessage ? 
                    <Alert className='joinedEmailError' type='success' message={this.state.successMessage}></Alert>
                : ''}
                </div>
            </div>
        )
    }
}

