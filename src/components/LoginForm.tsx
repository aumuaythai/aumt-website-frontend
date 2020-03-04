import React, { Component } from 'react'
import * as firebase from 'firebase/app'
import { Button, Input } from 'antd'
import {UserOutlined} from '@ant-design/icons'
import ResetPasswordLink from './ResetLink'
import './LoginForm.css'
import { Redirect } from 'react-router-dom'
import { LoginErrorMessage } from './LoginErrorMessage'

export interface LoginProps {

}
export interface LoginState {
    username: string
    password: string
    isAuthed: boolean
    authing: boolean
    errorCode: string
}

export default class LoginForm extends Component<LoginProps, LoginState> {
    constructor(props: LoginProps) {
        super(props)
        this.state = {
            username: '',
            password: '',
            errorCode: '',
            authing: false,
            isAuthed: !!firebase.auth().currentUser
        }
    }
    onUnChange = (e: any) => {
        this.setState({
            ...this.state,
            username: e.target.value
        })
    }
    onPwChange = (e: any) => {
        this.setState({
            ...this.state,
            password: e.target.value
        })
    }
    onLoginClick = () => {
        console.log('clicked login and trying login un, pw as ', this.state.username, this.state.password)
        this.setState({
            ...this.state,
            authing: true,
            errorCode: ''
            
        })
        firebase.auth().signInWithEmailAndPassword(this.state.username, this.state.password)
            .then((userInfo) => {
                this.setState({
                    ...this.state,
                    isAuthed: true,
                    authing: false
                })
            })
            .catch((error) => {
                // Handle Errors here.
                const errorCode = error.code;
                console.log(error.message, error.code)
                this.setState({
                    ...this.state,
                    errorCode: errorCode,
                    authing: false
                })
                // ...
            });
    }
    render() {
        if (this.state.isAuthed) {
            return <Redirect to='/'></Redirect>
        }
        return (
            <div className="loginContainer">
                <img src={'./logorectangle.png'} className='logo' alt=""/>
                <h3>Sign In</h3>
                {
                    this.state.errorCode ?
                        <LoginErrorMessage errorCode={this.state.errorCode}></LoginErrorMessage> :
                        ''
                }
                <Input placeholder="email" onChange={this.onUnChange} onPressEnter={this.onLoginClick} prefix={<UserOutlined />} />
                <br/>
                <Input.Password onChange={this.onPwChange} onPressEnter={this.onLoginClick} placeholder="password" />
                <ResetPasswordLink></ResetPasswordLink>
                <Button className="loginButton" onClick={this.onLoginClick} loading={this.state.authing}>Log in</Button>
                {/* <Button className="loginButton"><Link to='/'>Cancel</Link></Button> */}
            </div>
        )
    }
}