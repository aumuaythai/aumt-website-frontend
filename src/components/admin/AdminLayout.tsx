import { Menu } from 'antd'
import { ItemType } from 'antd/lib/menu/interface'
import { Link, Outlet, useLocation } from 'react-router'
import { useAuth } from '../../context/AuthProvider'

export default function AdminLayout() {
  const user = useAuth()
  const isAdmin = user?.isAdmin

  if (!isAdmin) {
    return <div>You are not authorised to access this page.</div>
  }

  return (
    <div className="text-left flex min-h-[calc(100vh-50px)]">
      <AdminMenu />
      <Outlet />
    </div>
  )
}

function AdminMenu() {
  const location = useLocation()
  const selectedKey = location.pathname.split('/')[2] || 'trainings'

  const items: ItemType[] = [
    {
      label: <Link to="/admin">Trainings</Link>,
      key: 'trainings',
    },
    {
      label: <Link to="/admin/events">Events</Link>,
      key: 'events',
    },
    {
      label: <Link to="/admin/members">Members</Link>,
      key: 'members',
    },
    {
      label: <Link to="/admin/feedback">Feedback</Link>,
      key: 'feedback',
    },
    {
      label: <Link to="/admin/settings">Settings</Link>,
      key: 'settings',
    },
  ]

  return (
    <Menu
      items={items}
      selectedKeys={[selectedKey]}
      className="!max-w-44 !border-r !border-gray-100"
    />
  )
}
