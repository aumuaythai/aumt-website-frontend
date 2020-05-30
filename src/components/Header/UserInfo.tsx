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
        const nameText = this.props.authedUser.preferredName || this.props.authedUser.firstName
        return (
            <Dropdown overlay={this.menu} placement="bottomRight" trigger={['click', 'hover']}>
                <div className="nameAndCaretContainer">
                    <div className="marqueeContainer">
                        <span className="marqueeWrapper">
                            <span className={`marqueeText ${nameText.length < 7 ? 'noMarqueeScroll': ''}`}>{nameText}</span>
                        </span>
                    </div>
                    <DownOutlined className='topMenuDownOutlined'/>
                </div>
            </Dropdown>
        )
    }
}