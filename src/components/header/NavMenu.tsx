import { cn } from '@/lib/utils'
import { NavLink } from 'react-router'

export interface NavMenu {
  isAdmin: boolean | undefined
}

export default function NavMenu({ isAdmin }: NavMenu) {
  const items: { label: string; to: string }[] = [
    {
      label: 'About',
      to: '/',
    },
    {
      label: 'Weekly Trainings',
      to: '/trainings',
    },
    {
      label: 'Events',
      to: '/events',
    },
  ]

  if (isAdmin) {
    items.push({
      label: 'Admin',
      to: '/admin',
    })
  }

  return (
    <nav className="md:flex h-full hidden gap-x-6 text-sm">
      {items.map((item) => (
        <NavLink
          key={item.to}
          to={item.to}
          className={({ isActive }) =>
            cn(
              'transition-colors flex items-center px-3',
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
