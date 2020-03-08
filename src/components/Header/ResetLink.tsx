import React, {Component, ChangeEvent} from 'react'
import Modal from 'antd/es/modal'
import Input from 'antd/es/input'
import Alert from 'antd/es/alert';
import * as firebase from 'firebase/app'
import UserOutlined from '@ant-design/icons/UserOutlined'
import './ResetLink.css'



export default class ResetPasswordLink extends Component {
  state = {
    visible: false,
    confirmLoading: false,
    currentEmail: '',
    buttonText: 'Send Reset Email',
    errorText: ''
  };

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
    // firebase auth request
    firebase.auth().sendPasswordResetEmail(this.state.currentEmail)
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
      <div className="resetContainer">
        <span className="mockLink" onClick={this.showModal}>Reset Password</span>
        <Modal
          title="Reset Password"
          visible={visible}
          onOk={this.handleResetClick}
          confirmLoading={confirmLoading}
          onCancel={this.handleCancel}
          okText={this.state.buttonText}
        >
        {this.state.errorText ? <Alert type='error' message={this.state.errorText}></Alert>: ''}
        <Input placeholder="email" onPressEnter={this.handleResetClick} onChange={this.onEmailChange} prefix={<UserOutlined />} />
        </Modal>
      </div>
    );
  }
}