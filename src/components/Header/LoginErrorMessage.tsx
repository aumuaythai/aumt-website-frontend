import React, { Component } from 'react'
import Alert from 'antd/es/alert'
import './LoginForm.css'

export interface LoginErrorMessageProps {
    errorCode: string
}
export interface LoginState {
}

export class LoginErrorMessage extends Component<LoginErrorMessageProps, LoginState> {
    getMessage = () => {
        switch(this.props.errorCode) {
            case 'auth/user-not-found':
                return <Alert type='error' message='There is no user with this email address. Contact the club to make sure you are signed up'></Alert>
            case 'auth/invalid-email':
                return <Alert type='error' message='Email is not valid.'></Alert>
            case 'auth/wrong-password':
                return <Alert type='error' message='You have entered an incorrect password'></Alert>
            default:
                return <Alert type='error' message='Error logging in'></Alert>
        }
    }
    render() {
        return (this.getMessage())
    }
}