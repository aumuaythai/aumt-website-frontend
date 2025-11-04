import { DownOutlined } from '@ant-design/icons'
import { Menu } from 'antd'
import { ItemType } from 'antd/lib/menu/interface'
import { Link, useLocation } from 'react-router'
import { AumtMember } from '../../types'
import './TopMenu.css'

export interface TopMenuProps {
  user: AumtMember | null
  isAdmin: boolean
}

const pathnameToKey: Record<string, string[]> = {
  '/': ['club-info', 'about'],
  '/gallery': ['gallery'],
  '/faq': ['faq'],
  '/trainings': ['trainings'],
  '/events': ['events'],
  '/admin': ['admin'],
}

export default function NavMenu({ user, isAdmin }: TopMenuProps) {
  const location = useLocation()
  const current = pathnameToKey[location.pathname]
  const sharedItems: ItemType[] = [
    {
      label: 'About',
      key: 'about',
      className: '!p-0',
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
      label: <Link to="/trainings">Weekly Trainings</Link>,
      key: 'trainings',
    },
    {
      label: <Link to="/events">Events</Link>,
      key: 'events',
    },
  ]

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

  // reassign to avoid mutating the original object
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
      className="!hidden lg:!flex"
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
          Menu <DownOutlined className="!text-[9px]" />
        </>
      ),
      key: 'menu',
      className: '!p-0',
      children: sharedItems,
    },
  ]

  return (
    <Menu
      items={items}
      selectedKeys={current}
      mode="horizontal"
      className="lg:!hidden"
    />
  )
}
