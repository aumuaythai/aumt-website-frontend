// import { useAuth } from '@/context/use-auth'
// import { LINKS } from '@/lib/links'
// import { cn } from '@/lib/utils'
// import InstagramFilled from '@ant-design/icons/InstagramFilled'
// import * as Dialog from '@radix-ui/react-dialog'
// import { Button, Spin } from 'antd'
// import { Menu, X } from 'lucide-react'
// import { useEffect, useState } from 'react'
// import { Link, NavLink, useLocation } from 'react-router'
// import Logo from '../svg/Logo'
// import UserInfo from './UserInfo'

// export default function Header() {
//   const [open, setOpen] = useState(false)
//   const [isScrolled, setIsScrolled] = useState(false)
//   const [isPastHeader, setIsPastHeader] = useState(false)
//   const auth = useAuth()

//   const location = useLocation()
//   const pathname = location.pathname
//   const isHomePage = pathname === '/'
//   const isDarkened = isPastHeader || !isHomePage

//   useEffect(() => {
//     const handleScroll = () => {
//       setIsScrolled(window.scrollY > 0)
//       setIsPastHeader(window.scrollY > 600)
//     }
//     window.addEventListener('scroll', handleScroll)
//     return () => window.removeEventListener('scroll', handleScroll)
//   }, [])

//   const navItems: { label: string; to: string }[] = [
//     { label: 'About', to: '/' },
//     { label: 'Weekly Trainings', to: '/trainings' },
//     { label: 'Events', to: '/events' },
//   ]

//   if (auth.user?.isAdmin) {
//     navItems.push({ label: 'Admin', to: '/admin' })
//   }

//   return (
//     <header
//       className={cn(
//         'w-full flex items-center fixed top-0 z-50 transition justify-between px-5 border-b border-b-transparent h-[50px]',
//         isHomePage ? 'fixed' : 'sticky',
//         isScrolled && 'backdrop-blur-md border-b-white/5',
//         isDarkened && 'bg-white/80 border-b-gray-100',
//       )}
//     >
//       <Link to="/">
//         <Logo
//           className={cn(
//             'w-[100px]  text-white transition hover:opacity-80',
//             isDarkened && 'text-black',
//           )}
//         />
//       </Link>

//       <DesktopMenu items={navItems} isDarkened={isDarkened} />
//       <MobileMenu
//         open={open}
//         setOpen={setOpen}
//         navItems={navItems}
//         isDarkened={isDarkened}
//       />

//       <div className="hidden md:flex items-center gap-x-3">
//         {auth.isLoading ? (
//           <Spin />
//         ) : auth.user ? (
//           <UserInfo user={auth.user} isDarkened={isDarkened} />
//         ) : (
//           <div className="flex items-center gap-x-2">
//             <Link
//               to={`/login?from=${pathname === '/login' ? '/' : pathname}`}
//               className={cn(
//                 'font-medium text-white px-2.5 py-1.5 transition text-sm',
//                 isDarkened
//                   ? 'text-black hover:text-blue-700'
//                   : 'hover:opacity-80',
//               )}
//             >
//               Sign in
//             </Link>
//             <Link
//               to={`/join`}
//               className={cn(
//                 'font-medium px-2.5 py-1.5 text-white border text-sm transition',
//                 isDarkened
//                   ? 'text-black hover:text-blue-700 border-gray-300 hover:border-blue-700'
//                   : 'hover:opacity-80 border-gray-400',
//               )}
//             >
//               Create account
//             </Link>
//           </div>
//         )}

//         <div className="flex text-lg text-black gap-x-2.5">
//           <a
//             href={LINKS.instagram}
//             target="_blank"
//             className={cn(
//               'cursor-pointer transition-opacity text-white hover:opacity-80',
//               isDarkened && 'text-black',
//             )}
//           >
//             <InstagramFilled />
//           </a>
//         </div>
//       </div>
//     </header>
//   )
// }

// function DesktopMenu({
//   items,
//   isDarkened,
// }: {
//   items: { label: string; to: string }[]
//   isDarkened: boolean
// }) {
//   return (
//     <nav className="md:flex hidden gap-x-6 text-sm text-center">
//       {items.map((item) => (
//         <NavLink
//           key={item.to}
//           to={item.to}
//           className={({ isActive }) =>
//             cn(
//               'transition-colors flex items-center font-medium px-2.5 py-1.5',
//               isDarkened
//                 ? isActive
//                   ? 'text-blue-700'
//                   : 'hover:text-blue-700 text-gray-800'
//                 : isActive
//                   ? 'text-white'
//                   : 'hover:text-white text-gray-200',
//             )
//           }
//         >
//           {item.label}
//         </NavLink>
//       ))}
//     </nav>
//   )
// }

// function MobileMenu({
//   open,
//   setOpen,
//   navItems,
//   isDarkened,
// }: {
//   open: boolean
//   setOpen: (open: boolean) => void
//   navItems: { label: string; to: string }[]
//   isDarkened: boolean
// }) {
//   const auth = useAuth()

//   const navItemsExceptAdmin = navItems.filter((item) => item.label !== 'Admin')
//   const mobileNavItems = [...navItemsExceptAdmin]
//   const adminNavItems = [
//     { label: 'Trainings', to: '/admin' },
//     { label: 'Events', to: '/admin/events' },
//     { label: 'Members', to: '/admin/members' },
//     { label: 'Feedback', to: '/admin/feedback' },
//     { label: 'Settings', to: '/admin/settings' },
//   ]

//   if (auth.user) {
//     mobileNavItems.push({ label: 'Account', to: '/account' })
//   } else {
//     mobileNavItems.push({ label: 'Sign in', to: '/login' })
//     mobileNavItems.push({ label: 'Create account', to: '/join' })
//   }

//   return (
//     <Dialog.Root modal={false} open={open} onOpenChange={setOpen}>
//       <Dialog.Trigger
//         className={cn(
//           'cursor-pointer transition md:hidden',
//           isDarkened
//             ? 'text-black hover:text-black/80'
//             : 'text-white hover:text-white/80',
//         )}
//       >
//         {open ? <X /> : <Menu />}
//       </Dialog.Trigger>
//       <Dialog.Portal>
//         <Dialog.Content
//           className="fixed inset-0 top-[50px] bg-white z-50 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 md:hidden"
//           onInteractOutside={(e) => e.preventDefault()}
//         >
//           <Dialog.Title className="sr-only">Menu</Dialog.Title>
//           <Dialog.Description className="sr-only">
//             Mobile navigation menu
//           </Dialog.Description>
//           <nav className="flex flex-col">
//             {mobileNavItems.map((item) => (
//               <NavLink
//                 key={item.to}
//                 to={item.to}
//                 end
//                 className={({ isActive }) =>
//                   cn(
//                     'font-medium py-4 px-6 transition-colors',
//                     isActive
//                       ? 'text-blue-700 bg-blue-50'
//                       : 'hover:text-blue-700 hover:bg-blue-50',
//                   )
//                 }
//                 onClick={() => setOpen(false)}
//               >
//                 {item.label}
//               </NavLink>
//             ))}

//             {auth.user?.isAdmin && (
//               <>
//                 <div className="mx-6 h-px mt-8 mb-4 bg-gray-300 flex items-center justify-center">
//                   <span className="bg-white px-2 font-joyride text-sm">
//                     Admin
//                   </span>
//                 </div>
//                 {adminNavItems.map((item) => (
//                   <NavLink
//                     key={item.to}
//                     to={item.to}
//                     end
//                     className={({ isActive }) =>
//                       cn(
//                         'font-joyride py-2.5 px-6 transition-colors',
//                         isActive
//                           ? 'text-blue-900 bg-blue-50'
//                           : 'hover:text-blue-900 hover:bg-blue-50',
//                       )
//                     }
//                     onClick={() => setOpen(false)}
//                   >
//                     {item.label}
//                   </NavLink>
//                 ))}
//               </>
//             )}
//           </nav>
//         </Dialog.Content>
//       </Dialog.Portal>
//     </Dialog.Root>
//   )
// }

import { useAuth } from '@/context/use-auth'
import { LINKS } from '@/lib/links'
import { cn } from '@/lib/utils'
import InstagramFilled from '@ant-design/icons/InstagramFilled'
import * as Dialog from '@radix-ui/react-dialog'
import { Spin } from 'antd'
import { ChevronDown, Menu, X } from 'lucide-react'
import { NavigationMenu } from 'radix-ui'
import { useEffect, useState } from 'react'
import { Link, NavLink, useLocation } from 'react-router'
import Logo from '../svg/Logo'
import UserInfo from './UserInfo'

type NavItem = {
  label: string
  to: string
  content?: { label: string; to: string }[]
}

export default function Header() {
  const [open, setOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const [isPastHeader, setIsPastHeader] = useState(false)
  const auth = useAuth()

  const location = useLocation()
  const pathname = location.pathname
  const isHomePage = pathname === '/'
  const isDarkened = isPastHeader || !isHomePage

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0)
      setIsPastHeader(window.scrollY > 600)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const navItems: NavItem[] = [
    {
      label: 'About',
      to: '/',
      content: [
        { label: 'FAQ', to: '/faq' },
        { label: 'Gallery', to: '/gallery' },
      ],
    },
    { label: 'Weekly Trainings', to: '/trainings' },
    { label: 'Events', to: '/events' },
  ]

  if (auth.user?.isAdmin) {
    navItems.push({ label: 'Admin', to: '/admin' })
  }

  return (
    <header
      className={cn(
        'w-full flex items-center fixed top-0 z-50 transition justify-between px-5 border-b border-b-transparent h-[50px]',
        isHomePage ? 'fixed' : 'sticky',
        isScrolled && 'backdrop-blur-md border-b-white/5',
        isDarkened && 'bg-white/80 border-b-gray-100',
      )}
    >
      <Link to="/">
        <Logo
          className={cn(
            'w-[100px] text-white transition hover:opacity-80',
            isDarkened && 'text-black',
          )}
        />
      </Link>

      <DesktopMenu items={navItems} isDarkened={isDarkened} />
      <MobileMenu
        open={open}
        setOpen={setOpen}
        navItems={navItems}
        isDarkened={isDarkened}
      />

      <div className="hidden md:flex items-center gap-x-3">
        {auth.isLoading ? (
          <Spin />
        ) : auth.user ? (
          <UserInfo user={auth.user} isDarkened={isDarkened} />
        ) : (
          <div className="flex items-center gap-x-2">
            <Link
              to={`/login?from=${pathname === '/login' ? '/' : pathname}`}
              className={cn(
                'font-medium text-white px-2.5 py-1.5 transition text-sm',
                isDarkened
                  ? 'text-black hover:text-blue-700'
                  : 'hover:opacity-80',
              )}
            >
              Sign in
            </Link>
            <Link
              to={`/join`}
              className={cn(
                'font-medium px-2.5 py-1.5 text-white border text-sm transition',
                isDarkened
                  ? 'text-black hover:text-blue-700 border-gray-300 hover:border-blue-700'
                  : 'hover:opacity-80 border-gray-400',
              )}
            >
              Create account
            </Link>
          </div>
        )}

        <div className="flex text-lg text-black gap-x-2.5">
          <a
            href={LINKS.instagram}
            target="_blank"
            className={cn(
              'cursor-pointer transition-opacity text-white hover:opacity-80',
              isDarkened && 'text-black',
            )}
          >
            <InstagramFilled />
          </a>
        </div>
      </div>
    </header>
  )
}

function DesktopMenu({
  items,
  isDarkened,
}: {
  items: NavItem[]
  isDarkened: boolean
}) {
  return (
    <NavigationMenu.Root className="relative">
      <NavigationMenu.List className="md:flex hidden gap-x-6 text-sm text-center">
        {items.map((item) => (
          <MenuItem
            key={item.to}
            label={item.label}
            to={item.to}
            content={item.content}
            isDarkened={isDarkened}
          />
        ))}
      </NavigationMenu.List>

      <div className="absolute top-full left-0">
        <NavigationMenu.Viewport className="mt-2 data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:slide-in-from-top-10 data-[state=closed]:animate-out data-[state=closed]:zoom-out-90 data-[state=closed]:fade-out" />
      </div>
    </NavigationMenu.Root>
  )
}

function MenuItem({
  label,
  to,
  isDarkened,
  content,
}: NavItem & { isDarkened: boolean }) {
  const location = useLocation()
  const isActive = location.pathname === to
  const activeSubItem = content?.find((item) => item.to === location.pathname)

  const linkClassName = cn(
    'transition-colors flex items-center font-medium px-2.5 py-1.5',
    isDarkened
      ? isActive
        ? 'text-blue-700'
        : 'hover:text-blue-700 text-gray-800'
      : isActive
        ? 'text-white'
        : 'hover:text-white text-gray-200',
  )

  if (!content) {
    return (
      <NavigationMenu.Item>
        <NavigationMenu.Link asChild>
          <Link to={to} className={linkClassName}>
            {label}
          </Link>
        </NavigationMenu.Link>
      </NavigationMenu.Item>
    )
  }

  return (
    <NavigationMenu.Item>
      <NavigationMenu.Trigger asChild>
        <Link
          to={to}
          className={cn(linkClassName, 'group flex items-center gap-x-1.5')}
        >
          {label}
          <ChevronDown
            className="size-3.5 transition-transform duration-200 stroke-3 group-data-[state=open]:rotate-180"
            aria-hidden
          />
        </Link>
      </NavigationMenu.Trigger>

      <NavigationMenu.Content className="bg-white shadow-lg text-sm font-medium w-28">
        {content.map((item) => (
          <NavigationMenu.Link asChild>
            <Link
              to={item.to}
              className={cn(
                'px-3.5 py-2.5 block hover:bg-gray-100',
                activeSubItem === item
                  ? 'text-blue-700'
                  : 'hover:text-blue-700',
              )}
            >
              {item.label}
            </Link>
          </NavigationMenu.Link>
        ))}
      </NavigationMenu.Content>
    </NavigationMenu.Item>
  )
}

function MobileMenu({
  open,
  setOpen,
  navItems,
  isDarkened,
}: {
  open: boolean
  setOpen: (open: boolean) => void
  navItems: { label: string; to: string }[]
  isDarkened: boolean
}) {
  const auth = useAuth()

  const navItemsExceptAdmin = navItems.filter((item) => item.label !== 'Admin')
  const mobileNavItems = [...navItemsExceptAdmin]
  const adminNavItems = [
    { label: 'Trainings', to: '/admin' },
    { label: 'Events', to: '/admin/events' },
    { label: 'Members', to: '/admin/members' },
    { label: 'Feedback', to: '/admin/feedback' },
    { label: 'Settings', to: '/admin/settings' },
  ]

  if (auth.user) {
    mobileNavItems.push({ label: 'Account', to: '/account' })
  } else {
    mobileNavItems.push({ label: 'Sign in', to: '/login' })
    mobileNavItems.push({ label: 'Create account', to: '/join' })
  }

  return (
    <Dialog.Root modal={false} open={open} onOpenChange={setOpen}>
      <Dialog.Trigger
        className={cn(
          'cursor-pointer transition md:hidden',
          isDarkened
            ? 'text-black hover:text-black/80'
            : 'text-white hover:text-white/80',
        )}
      >
        {open ? <X /> : <Menu />}
      </Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Content
          className="fixed inset-0 top-[50px] bg-white z-50 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 md:hidden"
          onInteractOutside={(e) => e.preventDefault()}
        >
          <Dialog.Title className="sr-only">Menu</Dialog.Title>
          <Dialog.Description className="sr-only">
            Mobile navigation menu
          </Dialog.Description>
          <nav className="flex flex-col">
            {mobileNavItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end
                className={({ isActive }) =>
                  cn(
                    'font-medium py-4 px-6 transition-colors',
                    isActive
                      ? 'text-blue-700 bg-blue-50'
                      : 'hover:text-blue-700 hover:bg-blue-50',
                  )
                }
                onClick={() => setOpen(false)}
              >
                {item.label}
              </NavLink>
            ))}

            {auth.user?.isAdmin && (
              <>
                <div className="mx-6 h-px mt-8 mb-4 bg-gray-300 flex items-center justify-center">
                  <span className="bg-white px-2 font-joyride text-sm">
                    Admin
                  </span>
                </div>
                {adminNavItems.map((item) => (
                  <NavLink
                    key={item.to}
                    to={item.to}
                    end
                    className={({ isActive }) =>
                      cn(
                        'font-joyride py-2.5 px-6 transition-colors',
                        isActive
                          ? 'text-blue-900 bg-blue-50'
                          : 'hover:text-blue-900 hover:bg-blue-50',
                      )
                    }
                    onClick={() => setOpen(false)}
                  >
                    {item.label}
                  </NavLink>
                ))}
              </>
            )}
          </nav>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
}
