import React, {Component} from 'react'
import { User } from 'firebase/app'
import * as firebase from 'firebase/app'
import {Menu, Dropdown} from 'antd'
import DownOutlined from '@ant-design/icons/DownOutlined'
import {ResetPasswordLink} from './ResetLink'
import './UserInfo.css'
interface UserInfoProps {
    authedUser: User
}

export class UserInfo extends Component<UserInfoProps, object> {
    onSignOutClick = () => {
        console.log('signing out')
        firebase.auth().signOut().then(() => {
            console.log('Signing out success')
        }).catch((signOutError) => {
            console.log('Sign out error')
        })
    }

    private menu = (
        <Menu>
            <Menu.Item onClick={this.onSignOutClick}>
                <span className='signOutLink'>Sign Out</span>
            </Menu.Item>
            <Menu.Item>
                <ResetPasswordLink>Reset Password</ResetPasswordLink>
            </Menu.Item>
        </Menu>
      );

    render() {
        return (
            <Dropdown overlay={this.menu} placement="bottomRight">
                <a className="ant-dropdown-link" onClick={e => e.preventDefault()}>
                    {this.props.authedUser.email?.split('@')[0]} <DownOutlined />
                </a>
            </Dropdown>
        )
    }
}