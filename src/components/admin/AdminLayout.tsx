import { useAuth } from '@/context/use-auth'
import { cn } from '@/lib/utils'
import { CalendarOutlined } from '@ant-design/icons'
import {
  BicepsFlexed,
  Calendar,
  CalendarDays,
  Cog,
  Dumbbell,
  HandFist,
  MessageCircle,
  MessageSquare,
  Settings,
  User,
  Users,
} from 'lucide-react'
import { ReactNode } from 'react'
import { NavLink, Outlet } from 'react-router'

export default function AdminLayout() {
  const auth = useAuth()

  if (!auth?.user?.isAdmin) {
    return <div>You are not authorised to access this page.</div>
  }

  return (
    <div className="text-left flex min-h-[calc(100vh-50px)]">
      <NavMenu />
      <Outlet />
    </div>
  )
}

const navItems: { label: string; icon: ReactNode; to: string }[] = [
  {
    label: 'Trainings',
    icon: <Dumbbell className="size-4.5" />,
    to: '/admin',
  },
  {
    label: 'Events',
    icon: <Calendar className="size-4.5" />,
    to: '/admin/events',
  },
  {
    label: 'Members',
    icon: <Users className="size-4.5" />,
    to: '/admin/members',
  },
  {
    label: 'Feedback',
    icon: <MessageSquare className="size-4.5" />,
    to: '/admin/feedback',
  },
  {
    label: 'Settings',
    icon: <Settings className="size-4.5" />,
    to: '/admin/settings',
  },
]

function NavMenu() {
  return (
    <nav className="md:flex hidden flex-col w-44 border-r border-r-gray-100">
      {navItems.map((item) => (
        <NavLink
          key={item.to}
          to={item.to}
          end
          className={({ isActive }) =>
            cn(
              'transition-colors flex items-center gap-x-3 font-medium px-4 py-3 text-sm',
              isActive
                ? 'text-blue-700 bg-blue-50'
                : 'hover:text-blue-700 text-gray-800 hover:bg-blue-50'
            )
          }
        >
          {item.icon}
          {item.label}
        </NavLink>
      ))}
    </nav>
  )
}
