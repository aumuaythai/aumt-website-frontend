import UserOutlined from '@ant-design/icons/UserOutlined'
import { Button, Input, InputRef } from 'antd'
import React, { Component, createRef, Ref, RefObject } from 'react'
import { Link, Redirect } from 'react-router-dom'
import FirebaseUtil from '../../services/firebase.util'
import { LoginErrorMessage } from './LoginErrorMessage'
import './LoginForm.css'
import { ResetPasswordLink } from './ResetLink'

export interface LoginProps {}

export interface LoginState {
  username: string
  password: string
  isAuthed: boolean
  authing: boolean
  errorCode: string
}

const logoUrl = './logos/AUMTLogo.png'

export class LoginForm extends Component<LoginProps, LoginState> {
  private emailInputRef: RefObject<InputRef>

  constructor(props: LoginProps) {
    super(props)
    this.emailInputRef = createRef()
    this.state = {
      username: '',
      password: '',
      errorCode: '',
      authing: false,
      isAuthed: !!FirebaseUtil.getCurrentUser(),
    }
  }
  componentDidMount() {
    this.emailInputRef.current?.focus()
  }
  getRedirectPath = () => {
    const urlParams = new URLSearchParams(window.location.search)
    return urlParams.get('from') || '/'
  }
  onUnChange = (username: string) => {
    this.setState({
      ...this.state,
      username,
    })
  }
  onPwChange = (password: string) => {
    this.setState({
      ...this.state,
      password,
    })
  }
  onLoginClick = () => {
    this.setState({
      ...this.state,
      authing: true,
      errorCode: '',
    })
    FirebaseUtil.signIn(this.state.username, this.state.password)
      .then((userInfo) => {
        this.setState({
          ...this.state,
          isAuthed: true,
          authing: false,
        })
      })
      .catch((error) => {
        // Handle Errors here.
        const errorCode = error.code
        console.log(error.message, error.code)
        this.setState({
          ...this.state,
          errorCode: errorCode,
          authing: false,
        })
        // ...
      })
  }
  render() {
    if (this.state.isAuthed) {
      return <Redirect to={this.getRedirectPath()}></Redirect>
    }
    return (
      <div className="loginPageContainer">
        <div className="loginContainer">
          <Link to="/">
            <img src={logoUrl} className="logo" alt="aumt logo" />
          </Link>
          <h3>Sign In</h3>
          {this.state.errorCode ? (
            <LoginErrorMessage
              errorCode={this.state.errorCode}
            ></LoginErrorMessage>
          ) : (
            ''
          )}
          <Input
            type="email"
            className="loginInput"
            ref={this.emailInputRef}
            placeholder="email"
            onChange={(e) => this.onUnChange(e.target.value)}
            onPressEnter={this.onLoginClick}
            prefix={<UserOutlined />}
          />
          <br />
          <Input.Password
            className="loginInput"
            onChange={(e) => this.onPwChange(e.target.value)}
            onPressEnter={this.onLoginClick}
            placeholder="password"
          />
          <div>
            <ResetPasswordLink></ResetPasswordLink>
          </div>
          <Button
            className="loginButton"
            onClick={this.onLoginClick}
            loading={this.state.authing}
          >
            Log in
          </Button>
          <div className="clearBoth"></div>
        </div>
      </div>
    )
  }
}
