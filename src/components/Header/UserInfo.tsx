import React, {Component} from 'react'
import * as firebase from 'firebase/app'
import {Menu, Dropdown} from 'antd'
import DownOutlined from '@ant-design/icons/DownOutlined'
import {ResetPasswordLink} from './ResetLink'
import './UserInfo.css'
import { AumtMember } from '../../types'
interface UserInfoProps {
    authedUser: AumtMember
}

export class UserInfo extends Component<UserInfoProps, object> {
    onSignOutClick = () => {
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
                <span className="ant-dropdown-link userInfoLink" onClick={e => e.preventDefault()}>
                    {this.props.authedUser.preferredName || this.props.authedUser.firstName || this.props.authedUser.displayName} <DownOutlined />
                </span>
            </Dropdown>
        )
    }
}