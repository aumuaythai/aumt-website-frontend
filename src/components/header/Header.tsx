import { useAuth } from '@/context/use-auth'
import { LINKS } from '@/lib/links'
import { cn } from '@/lib/utils'
import InstagramFilled from '@ant-design/icons/InstagramFilled'
import * as Collapsible from '@radix-ui/react-collapsible'
import * as Dialog from '@radix-ui/react-dialog'
import { Button, Divider } from 'antd'
import { Menu, X } from 'lucide-react'
import { useState } from 'react'
import { Link, NavLink, useLocation } from 'react-router'
import Logo from '../svg/Logo'
import UserInfo from './UserInfo'

export default function Header() {
  const [open, setOpen] = useState(false)
  const auth = useAuth()

  const location = useLocation()
  const pathname = location.pathname

  const navItems: { label: string; to: string }[] = [
    { label: 'About', to: '/' },
    { label: 'Weekly Trainings', to: '/trainings' },
    { label: 'Events', to: '/events' },
  ]

  if (auth.user?.isAdmin) {
    navItems.push({ label: 'Admin', to: '/admin' })
  }

  return (
    <header className="w-full flex items-center justify-between px-5 font-[Joyride] border-b border-b-[#f0f0f0] h-[50px]">
      <Link to="/">
        <Logo className="w-[100px] transition-opacity hover:opacity-80" />
      </Link>

      <DesktopMenu items={navItems} />
      <MobileMenu open={open} setOpen={setOpen} navItems={navItems} />

      <div className="hidden md:flex items-center gap-x-3">
        {auth.user ? (
          <UserInfo user={auth.user} />
        ) : (
          <div className="flex items-center gap-x-2">
            <Button type="text" className="!py-4 !font-joyride">
              <Link
                to={`/login?from=${pathname === '/login' ? '/' : pathname}`}
              >
                Sign In
              </Link>
            </Button>
            <Button className="!py-4 !font-joyride">
              <Link to={`/join`}>Create account</Link>
            </Button>
          </div>
        )}
        <div className="flex text-lg text-black gap-x-2.5">
          <a
            href={LINKS.instagram}
            target="_blank"
            className="cursor-pointer hover:text-gray-500"
          >
            <InstagramFilled />
          </a>
        </div>
      </div>
    </header>
  )
}

function MobileMenu({
  open,
  setOpen,
  navItems,
}: {
  open: boolean
  setOpen: (open: boolean) => void
  navItems: { label: string; to: string }[]
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

  mobileNavItems.push({ label: 'Account', to: '/account' })

  return (
    <Dialog.Root modal={false} open={open} onOpenChange={setOpen}>
      <Dialog.Trigger className="cursor-pointer transition-colors hover:text-slate-600 md:hidden">
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
                    'font-joyride text-lg py-4 px-6 transition-colors',
                    isActive
                      ? 'text-blue-900 bg-blue-50'
                      : 'hover:text-blue-900 hover:bg-blue-50'
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
                          : 'hover:text-blue-900 hover:bg-blue-50'
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

function DesktopMenu({ items }: { items: { label: string; to: string }[] }) {
  return (
    <nav className="md:flex h-full hidden gap-x-6 text-sm text-center">
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
