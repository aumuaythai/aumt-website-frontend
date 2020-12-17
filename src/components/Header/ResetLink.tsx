import React, {Component, ChangeEvent} from 'react'
import {Modal, Input, Alert, Button} from 'antd'
import UserOutlined from '@ant-design/icons/UserOutlined'
import './ResetLink.css'
import FirebaseUtil from '../../services/firebase.util'


interface ResetPasswordLinkState {
  visible: boolean
  confirmLoading: boolean
  currentEmail: string
  buttonText: string
  errorText: string
}

interface ResetPasswordLinkProps {
  text?: string
}

export class ResetPasswordLink extends Component<ResetPasswordLinkProps, ResetPasswordLinkState> {
  constructor(props: ResetPasswordLinkProps) {
    super(props)
    this.state = {
      visible: false,
      confirmLoading: false,
      currentEmail: '',
      buttonText: 'Send Reset Email',
      errorText: ''
    };
  }

  onEmailChange = (e: ChangeEvent<HTMLInputElement>) => {
      this.setState({
        ...this.state,
        currentEmail: e.target.value
      })
  }

  showModal = () => {
    this.setState({
      visible: true,
    });
  };

  handleResetClick = () => {
    this.setState({
      confirmLoading: true,
      errorText: ''
    });
    FirebaseUtil.sendPasswordResetEmail(this.state.currentEmail)
      .then((success) => {
        console.log('RESET EMAIL success', success)
        this.setState({
          ...this.state,
          confirmLoading: false,
          buttonText: 'Email Sent'
        })
      })
      .catch((err) => {
        let errDisplay = 'Error sending reset email'
        console.log(err)
        if (err.code === 'auth/user-not-found') {
            errDisplay = 'No user found for email. Contact AUMT to make sure your email is registered.'
        } else if (err.code === 'auth/invalid-email') {
            errDisplay = 'Invalid Email.'
        }
        this.setState({
          ...this.state,
          confirmLoading: false,
          errorText: errDisplay
        })
      })
  };

  handleCancel = () => {
    this.setState({
      visible: false,
    });
  };

  render() {
    const { visible, confirmLoading } = this.state;
    return (
      <span className="resetContainer">
        <Button type='link' className="mockLink" onClick={this.showModal}>{this.props.text || 'Reset Password'}</Button>
        <Modal
          title="Reset Password"
          visible={visible}
          onOk={this.handleResetClick}
          confirmLoading={confirmLoading}
          onCancel={this.handleCancel}
          okText={this.state.buttonText}
        >
        {this.state.errorText ? <Alert type='error' message={this.state.errorText}></Alert>: null}
        <Input type='email' placeholder="email" onPressEnter={this.handleResetClick} onChange={this.onEmailChange} prefix={<UserOutlined />} />
        </Modal>
      </span>
    );
  }
}