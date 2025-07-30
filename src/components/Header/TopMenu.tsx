import { DownOutlined } from '@ant-design/icons'
import { Menu } from 'antd'
import { ItemType } from 'antd/lib/menu/hooks/useItems'
import { Link, useLocation } from 'react-router-dom'
import { AumtMember } from '../../types'
import './TopMenu.css'

export interface TopMenuProps {
  authedUser: AumtMember | null
  isAdmin: boolean
}

const PathnameToKey: Record<string, string[]> = {
  '/': ['club-info', 'about'],
  '/gallery': ['gallery'],
  '/faq': ['faq'],
  '/signups': ['signups'],
  '/events': ['events'],
  '/join': ['join'],
  '/account': ['account'],
  '/admin': ['admin'],
}

export default function TopMenu({ authedUser, isAdmin }: TopMenuProps) {
  const location = useLocation()
  const current = PathnameToKey[location.pathname] || ['about']
  const sharedItems: ItemType[] = [
    {
      label: 'About',
      key: 'about',
      className: 'dropdownTopMenuItem',
      children: [
        {
          label: <Link to="/">Club Info</Link>,
          key: 'club-info',
        },
        {
          label: <Link to="/gallery">Gallery</Link>,
          key: 'gallery',
        },
        {
          label: <Link to="/faq">FAQ</Link>,
          key: 'faq',
        },
      ],
    },
    {
      label: <Link to="/signups">Weekly Trainings</Link>,
      key: 'signups',
    },
    {
      label: <Link to="/events">Join Events</Link>,
      key: 'events',
    },
  ]

  if (authedUser) {
    sharedItems.push({
      label: <Link to="/account">My Account</Link>,
      key: 'account',
    })
  } else {
    sharedItems.push({
      label: <Link to="/join">Create Account</Link>,
      key: 'join',
    })
  }

  if (isAdmin) {
    sharedItems.push({
      label: <Link to="/admin">Admin</Link>,
      key: 'admin',
    })
  }

  return (
    <>
      <DesktopMenu sharedItems={sharedItems} current={current} />
      <MobileMenu sharedItems={sharedItems} current={current} />
    </>
  )
}

function DesktopMenu({
  sharedItems,
  current,
}: {
  sharedItems: ItemType[]
  current: string[]
}) {
  const items = [...sharedItems]

  // reassign to avoid mutating the original array
  items[0] = {
    ...items[0],
    label: (
      <>
        About <DownOutlined className="menuDownIcon" />
      </>
    ),
  } as ItemType

  return (
    <Menu
      items={items}
      selectedKeys={current}
      mode="horizontal"
      className="menu--desktop"
    />
  )
}

function MobileMenu({
  sharedItems,
  current,
}: {
  sharedItems: ItemType[]
  current: string[]
}) {
  const items = [
    {
      label: (
        <>
          Menu <DownOutlined className="menuDownIcon" />
        </>
      ),
      key: 'menu',
      className: 'dropdownTopMenuItem',
      children: sharedItems,
    },
  ]

  return (
    <Menu
      items={items}
      selectedKeys={current}
      mode="horizontal"
      className="menu--mobile"
    />
  )
}
