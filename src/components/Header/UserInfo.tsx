import DownOutlined from '@ant-design/icons/DownOutlined'
import { Button, Dropdown } from 'antd'
import { ItemType } from 'antd/lib/menu/hooks/useItems'
import { signOut } from '../../services/auth'
import { AumtMember } from '../../types'
import { ResetPasswordLink } from './ResetLink'
import './UserInfo.css'

interface UserInfoProps {
  authedUser: AumtMember
}

export default function UserInfo(props: UserInfoProps) {
  const onSignOutClick = () => {
    signOut()
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

  const nameText = props.authedUser.preferredName || props.authedUser.firstName

  return (
    <Dropdown
      menu={{ items }}
      placement="bottomRight"
      trigger={['click', 'hover']}
    >
      <div className="userInfoContainer">
        <div className="nameContainer">{nameText}</div>
        <DownOutlined className="topMenuDownOutlined" />
      </div>
    </Dropdown>
  )
}
