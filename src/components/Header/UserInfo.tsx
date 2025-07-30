import DownOutlined from '@ant-design/icons/DownOutlined'
import { Button, Dropdown, Menu } from 'antd'
import { ItemType } from 'antd/lib/menu/hooks/useItems'
import React, { Component } from 'react'
import FirebaseUtil from '../../services/firebase.util'
import { AumtMember } from '../../types'
import { Marquee } from '../utility/Marquee'
import { ResetPasswordLink } from './ResetLink'
import './UserInfo.css'

interface UserInfoProps {
  authedUser: AumtMember
}

export default function UserInfo(props: UserInfoProps) {
  const onSignOutClick = () => {
    FirebaseUtil.signOut()
      .then(() => {
        console.log('Signing out success')
      })
      .catch((signOutError) => {
        console.log('Sign out error')
      })
  }

  const items: ItemType[] = [
    {
      key: 'sign-out',
      label: (
        <Button type="link" className="signOutLink" onClick={onSignOutClick}>
          Sign Out
        </Button>
      ),
    },
    {
      key: 'reset-password',
      label: <ResetPasswordLink>Reset Password</ResetPasswordLink>,
    },
  ]

  const nameText = truncateName(
    props.authedUser.preferredName || props.authedUser.firstName
  )

  return (
    <Dropdown
      menu={{ items }}
      placement="bottomRight"
      trigger={['click', 'hover']}
    >
      <div className="userInfoContainer">
        {nameText}
        <DownOutlined className="topMenuDownOutlined" />
      </div>
    </Dropdown>
  )
}

function truncateName(name: string): string {
  const MAX_LENGTH = 7

  if (name.length > MAX_LENGTH) {
    return name.substring(0, MAX_LENGTH) + '...'
  }
  return name
}
