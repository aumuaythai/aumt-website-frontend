import React, { Component } from 'react'
import * as firebase from 'firebase/app'
import { Button, Input } from 'antd'
import {UserOutlined} from '@ant-design/icons'
import ResetPasswordLink from './ResetLink'
import './LoginForm.css'
import { Redirect, Link } from 'react-router-dom'
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

const logoPath = process.env.REACT_APP_LOGO_PATH 

const logoUrl = './logorectangle.png'

export default class LoginFormNoRouter extends Component<LoginProps, LoginState> {
    private emailInput: Input | null = null;
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
    componentDidMount() {
        if (this.emailInput) {
            this.emailInput.focus()
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
                <Link to='/'><img src={logoUrl} className='logo' alt="aumt logo"/></Link>
                <h3>Sign In</h3>
                {
                    this.state.errorCode ?
                        <LoginErrorMessage errorCode={this.state.errorCode}></LoginErrorMessage> :
                        ''
                }
                <Input className='loginInput' ref={(input) => { this.emailInput = input; }} placeholder="email" onChange={this.onUnChange} onPressEnter={this.onLoginClick} prefix={<UserOutlined />} />
                <br/>
                <Input.Password className='loginInput' onChange={this.onPwChange} onPressEnter={this.onLoginClick} placeholder="password" />
                <ResetPasswordLink></ResetPasswordLink>
                <Button className="loginButton" onClick={this.onLoginClick} loading={this.state.authing}>Log in</Button>
                {/* <Button className="loginButton"><Link to='/'>Cancel</Link></Button> */}
            </div>
        )
    }
}