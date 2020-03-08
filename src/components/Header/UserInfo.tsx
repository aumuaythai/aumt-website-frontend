import React, {Component} from 'react'
import { User } from 'firebase/app'
import * as firebase from 'firebase/app'
import Menu from 'antd/es/menu'
import Dropdown from 'antd/es/dropdown';
import DownOutlined from '@ant-design/icons/DownOutlined'
import ResetLink from './ResetLink'
import './UserInfo.css'
interface UserInfoProps {
    authedUser: User
}

export default class UserInfo extends Component<UserInfoProps, object> {
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
                <ResetLink>Reset Password</ResetLink>
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