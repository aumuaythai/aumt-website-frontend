import React, {Component} from 'react'
import {Menu, Dropdown, Button} from 'antd'
import DownOutlined from '@ant-design/icons/DownOutlined'
import {ResetPasswordLink} from './ResetLink'
import './UserInfo.css'
import { AumtMember } from '../../types'
import FirebaseUtil from '../../services/firebase.util'
interface UserInfoProps {
    authedUser: AumtMember
}

export class UserInfo extends Component<UserInfoProps, object> {
    onSignOutClick = () => {
        FirebaseUtil.signOut().then(() => {
            console.log('Signing out success')
        }).catch((signOutError) => {
            console.log('Sign out error')
        })
    }

    private menu = (
        <Menu>
            <Menu.Item onClick={this.onSignOutClick}>
                <Button type='link' className='signOutLink'>Sign Out</Button>
            </Menu.Item>
            <Menu.Item>
                <ResetPasswordLink>Reset Password</ResetPasswordLink>
            </Menu.Item>
        </Menu>
      );

    render() {
        return (
            <Dropdown overlay={this.menu} placement="bottomRight">
                <Button type='link' className="ant-dropdown-link userInfoLink" onClick={e => e.preventDefault()}>
                    <DownOutlined />{this.props.authedUser.preferredName || this.props.authedUser.firstName}
                </Button>
            </Dropdown>
        )
    }
}