import React, { Component } from 'react'
import {Button, Input} from 'antd'
import UserOutlined from '@ant-design/icons/UserOutlined'
import {ResetPasswordLink} from './ResetLink'
import './LoginForm.css'
import { Redirect, Link } from 'react-router-dom'
import { LoginErrorMessage } from './LoginErrorMessage'
import FirebaseUtil from '../../services/firebase.util'

export interface LoginProps {

}
export interface LoginState {
    username: string
    password: string
    isAuthed: boolean
    authing: boolean
    errorCode: string
}

const logoUrl = './logorectangle.png'

export class LoginForm extends Component<LoginProps, LoginState> {
    private emailInput: Input | null = null;
    constructor(props: LoginProps) {
        super(props)
        this.state = {
            username: '',
            password: '',
            errorCode: '',
            authing: false,
            isAuthed: !!FirebaseUtil.getCurrentUser()
        }
    }
    componentDidMount() {
        if (this.emailInput) {
            this.emailInput.focus()
        }
    }
    getRedirectPath = () => {
        const urlParams = new URLSearchParams(window.location.search)
        return urlParams.get('from') || '/'
    }
    onUnChange = (username: string) => {
        this.setState({
            ...this.state,
            username
        })
    }
    onPwChange = (password: string) => {
        this.setState({
            ...this.state,
            password
        })
    }
    onLoginClick = () => {
        this.setState({
            ...this.state,
            authing: true,
            errorCode: ''
            
        })
        FirebaseUtil.signIn(this.state.username, this.state.password)
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
            return <Redirect to={this.getRedirectPath()}></Redirect>
        }
        return (
            <div className="loginPageContainer">
                <div className="loginContainer">
                    <Link to='/'><img src={logoUrl} className='logo' alt="aumt logo"/></Link>
                    <h3>Sign In</h3>
                    {
                        this.state.errorCode ?
                            <LoginErrorMessage errorCode={this.state.errorCode}></LoginErrorMessage> :
                            ''
                    }
                    <Input
                        type='email'
                        className='loginInput'
                        ref={(input) => { this.emailInput = input; }}
                        placeholder="email"
                        onChange={e => this.onUnChange(e.target.value)}
                        onPressEnter={this.onLoginClick}
                        prefix={<UserOutlined />} />
                    <br/>
                    <Input.Password className='loginInput' onChange={e => this.onPwChange(e.target.value)} onPressEnter={this.onLoginClick} placeholder="password" />
                    <div>
                        <ResetPasswordLink></ResetPasswordLink>
                    </div>
                    <Button className="loginButton" onClick={this.onLoginClick} loading={this.state.authing}>Log in</Button>
                    <div className="clearBoth"></div>
                </div>
            </div>
        )
    }
}