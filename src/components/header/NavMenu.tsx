// import { DownOutlined } from '@ant-design/icons'
// import { Menu } from 'antd'
// import { ItemType } from 'antd/lib/menu/interface'
// import { Link, useLocation } from 'react-router'
// import { Member } from '../../types'
// import './TopMenu.css'

// export interface NavMenu {
//   isAdmin: boolean | undefined
// }

// const pathnameToKey: Record<string, string[]> = {
//   '/': ['club-info', 'about'],
//   '/gallery': ['gallery'],
//   '/faq': ['faq'],
//   '/trainings': ['trainings'],
//   '/events': ['events'],
//   '/admin': ['admin'],
// }

// export default function NavMenu({ isAdmin }: NavMenu) {
//   const location = useLocation()
//   const current = pathnameToKey[location.pathname]
//   const sharedItems: ItemType[] = [
//     {
//       label: 'About',
//       key: 'about',
//       className: '!p-0',
//       children: [
//         {
//           label: <Link to="/">Club Info</Link>,
//           key: 'club-info',
//         },
//         {
//           label: <Link to="/gallery">Gallery</Link>,
//           key: 'gallery',
//         },
//         {
//           label: <Link to="/faq">FAQ</Link>,
//           key: 'faq',
//         },
//       ],
//     },
//     {
//       label: <Link to="/trainings">Weekly Trainings</Link>,
//       key: 'trainings',
//     },
//     {
//       label: <Link to="/events">Events</Link>,
//       key: 'events',
//     },
//   ]

//   if (isAdmin) {
//     sharedItems.push({
//       label: <Link to="/admin">Admin</Link>,
//       key: 'admin',
//     })
//   }

//   return (
//     <>
//       <DesktopMenu sharedItems={sharedItems} current={current} />
//       <MobileMenu sharedItems={sharedItems} current={current} />
//     </>
//   )
// }

// function DesktopMenu({
//   sharedItems,
//   current,
// }: {
//   sharedItems: ItemType[]
//   current: string[]
// }) {
//   const items = [...sharedItems]

//   // reassign to avoid mutating the original object
//   items[0] = {
//     ...items[0],
//     label: (
//       <>
//         About <DownOutlined className="menuDownIcon" />
//       </>
//     ),
//   } as ItemType

//   return (
//     <Menu
//       items={items}
//       selectedKeys={current}
//       mode="horizontal"
//       className="!hidden lg:!flex"
//     />
//   )
// }

// function MobileMenu({
//   sharedItems,
//   current,
// }: {
//   sharedItems: ItemType[]
//   current: string[]
// }) {
//   const items = [
//     {
//       label: (
//         <>
//           Menu <DownOutlined className="!text-[9px]" />
//         </>
//       ),
//       key: 'menu',
//       className: '!p-0',
//       children: sharedItems,
//     },
//   ]

//   return (
//     <Menu
//       items={items}
//       selectedKeys={current}
//       mode="horizontal"
//       className="lg:!hidden"
//     />
//   )
// }

import { cn } from '@/lib/utils'
import { NavLink } from 'react-router'
import './TopMenu.css'

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
    <nav className="flex h-full gap-x-6 text-sm">
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
