import { cn } from '@/lib/utils'
import { signOut } from '@/services/auth'
import { Member } from '@/types'
import DownOutlined from '@ant-design/icons/DownOutlined'
import { Dropdown } from 'antd'
import { ItemType } from 'antd/lib/menu/interface'
import { LogOutIcon } from 'lucide-react'
import { Link } from 'react-router'
import ResetPasswordLink from './ResetLink'

interface UserInfoProps {
  user: Member
  isDarkened: boolean
}

export default function UserInfo({ user, isDarkened }: UserInfoProps) {
  const items: ItemType[] = [
    {
      key: 'account',
      label: <Link to="/account">Account</Link>,
    },
    {
      key: 'reset-password',
      label: <ResetPasswordLink>Reset password</ResetPasswordLink>,
    },
    {
      type: 'divider',
    },
    {
      key: 'sign-out',
      label: (
        <button
          className="text-red-500 flex items-center gap-x-2"
          onClick={handleSignOut}
        >
          <LogOutIcon className="size-4" />
          Sign Out
        </button>
      ),
    },
  ]

  const nameText = user.preferredName || user.firstName

  function handleSignOut() {
    signOut()
  }

  return (
    <Dropdown
      menu={{ items }}
      placement="bottomRight"
      trigger={['click', 'hover']}
    >
      <div
        className={cn(
          'flex items-center h-full text-white cursor-pointer gap-x-2.5',
          isDarkened && 'text-black'
        )}
      >
        <div className="text-sm overflow-hidden text-ellipsis whitespace-nowrap">
          {nameText}
        </div>
        <DownOutlined className="text-xs" />
      </div>
    </Dropdown>
  )
}
