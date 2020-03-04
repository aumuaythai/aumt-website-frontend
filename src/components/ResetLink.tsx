import React, {Component} from 'react'
import { Modal, Input } from 'antd';
import { UserOutlined } from '@ant-design/icons'
import './ResetLink.css'



export default class ResetPasswordLink extends Component {
  state = {
    visible: false,
    confirmLoading: false,
  };

  showModal = () => {
    this.setState({
      visible: true,
    });
  };

  handleLoginClick = () => {
    this.setState({
      confirmLoading: true,
    });
    // firebase auth request
    setTimeout(() => {
      this.setState({
        visible: false,
        confirmLoading: false,
      });
    }, 2000);
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
          onOk={this.handleLoginClick}
          confirmLoading={confirmLoading}
          onCancel={this.handleCancel}
          okText='Send Reset Email'
        >
        <Input placeholder="email" prefix={<UserOutlined />} />
        </Modal>
      </div>
    );
  }
}