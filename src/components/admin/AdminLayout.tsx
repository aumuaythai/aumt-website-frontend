import { cn } from '@/lib/utils'
import { NavLink, Outlet } from 'react-router'
import { useAuth } from '../../context/AuthProvider'

export default function AdminLayout() {
  const user = useAuth()
  const isAdmin = user?.isAdmin

  if (!isAdmin) {
    return <div>You are not authorised to access this page.</div>
  }

  return (
    <div className="text-left flex min-h-[calc(100vh-50px)]">
      <NavMenu />
      <Outlet />
    </div>
  )
}

const navItems: { label: string; to: string }[] = [
  { label: 'Trainings', to: '/admin' },
  { label: 'Events', to: '/admin/events' },
  { label: 'Members', to: '/admin/members' },
  { label: 'Feedback', to: '/admin/feedback' },
  { label: 'Settings', to: '/admin/settings' },
]

function NavMenu() {
  return (
    <nav className="flex flex-col w-44 border-r border-r-gray-100">
      {navItems.map((item) => (
        <NavLink
          key={item.to}
          to={item.to}
          end
          className={({ isActive }) =>
            cn(
              'transition-colors flex items-center font-joyride px-4 py-3 text-sm',
              isActive
                ? 'text-blue-900 bg-blue-50'
                : 'hover:text-blue-900 hover:bg-blue-50'
            )
          }
        >
          {item.label}
        </NavLink>
      ))}
    </nav>
  )
}
