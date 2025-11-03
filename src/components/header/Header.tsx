import FacebookFilled from '@ant-design/icons/FacebookFilled'
import InstagramFilled from '@ant-design/icons/InstagramFilled'
import { Button } from 'antd'
import { Link, useLocation } from 'react-router'
import { useAuth } from '../../context/AuthProvider'
import { Links } from '../../services/links'
import Logo from '../svg/Logo'
import NavMenu from './NavMenu'
import UserInfo from './UserInfo'

export default function Header() {
  const { authedUser, userIsAdmin } = useAuth()

  const location = useLocation()
  const pathname = location.pathname

  const fbClick = () => {
    Links.openAumtFb()
  }

  const igClick = () => {
    Links.openAumtInsta()
  }

  return (
    <header className="w-full flex items-center justify-between px-5 font-[Joyride] border-b border-b-[#f0f0f0] font-normal h-[50px]">
      <Link to="/">
        <Logo className="w-[120px] transition-opacity hover:opacity-80" />
      </Link>

      <NavMenu isAdmin={userIsAdmin} authedUser={authedUser} />

      <div className="flex items-center gap-x-3">
        {authedUser ? (
          <UserInfo authedUser={authedUser} />
        ) : (
          // <Link
          //   to={`/login?from=${pathname}`}
          //   className="h-full flex items-center px-8 !text-[#11388d] !transition-colors duration-300 hover:!bg-[#11388d]/10"
          // >
          //   Sign In
          // </Link>
          <div className="flex items-center gap-x-2">
            <Button type="primary" ghost className="!py-4 !font-joyride">
              <Link to={`/login?from=${pathname}`}>Sign In</Link>
            </Button>
            <Button type="primary" className="!py-4 !font-joyride">
              <Link to={`/join`}>Create account</Link>
            </Button>
          </div>
        )}
        <div className="flex text-lg text-black gap-x-2.5">
          <button
            onClick={fbClick}
            className="cursor-pointer hover:text-gray-500"
          >
            <FacebookFilled />
          </button>
          <button
            onClick={igClick}
            className="cursor-pointer hover:text-gray-500"
          >
            <InstagramFilled />
          </button>
        </div>
      </div>
    </header>
  )
}
