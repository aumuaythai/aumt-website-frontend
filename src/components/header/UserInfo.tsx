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
  function handleSignOut() {
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
      key: 'reset-password',
      label: <ResetPasswordLink>Reset Password</ResetPasswordLink>,
    },
    {
      type: 'divider',
    },
    {
      key: 'sign-out',
      label: (
        <Button type="link" onClick={handleSignOut}>
          Sign Out
        </Button>
      ),
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
        <div className="text-sm overflow-hidden text-ellipsis whitespace-nowrap">
          {nameText}
        </div>
        <DownOutlined className="text-xs" />
      </div>
    </Dropdown>
  )
}
