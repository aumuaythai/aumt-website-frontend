import DownOutlined from '@ant-design/icons/DownOutlined'
import { Button, Dropdown } from 'antd'
import { ItemType } from 'antd/lib/menu/interface'
import { Link } from 'react-router'
import { signOut } from '../../services/auth'
import { AumtMember } from '../../types'
import { ResetPasswordLink } from './ResetLink'

interface UserInfoProps {
  authedUser: AumtMember
}

export default function UserInfo(props: UserInfoProps) {
  const onSignOutClick = () => {
    signOut()
  }

  const items: ItemType[] = [
    {
      key: 'account',
      label: (
        <Button type="link">
          <Link to="/account">Account</Link>
        </Button>
      ),
    },
    {
      key: 'sign-out',
      label: (
        <Button type="link" onClick={onSignOutClick}>
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
      <div className="flex items-center h-full cursor-pointer gap-x-2.5">
        <div className="max-w-24 overflow-hidden text-ellipsis whitespace-nowrap">
          {nameText}
        </div>
        <DownOutlined />
      </div>
    </Dropdown>
  )
}
