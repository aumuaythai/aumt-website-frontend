import FacebookFilled from '@ant-design/icons/FacebookFilled'
import InstagramFilled from '@ant-design/icons/InstagramFilled'
import { Link, useLocation } from 'react-router'
import { useAuth } from '../../context/AuthProvider'
import { Links } from '../../services/links'
import TopMenu from './TopMenu'
import UserInfo from './UserInfo'

export default function Header() {
  const { authedUser, userIsAdmin: isAdmin } = useAuth()

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
        <img
          className="w-[120px] transition-opacity hover:opacity-80"
          src="logos/AUMTLogo.png"
          alt="AUMT"
        />
      </Link>

      <TopMenu isAdmin={isAdmin} authedUser={authedUser} />
      <div className="flex items-center h-full gap-x-6">
        {authedUser ? (
          <UserInfo authedUser={authedUser}></UserInfo>
        ) : (
          <Link
            to={`/login?from=${pathname}`}
            className="h-full flex items-center px-8 !text-[#11388d] !transition-colors duration-300 hover:!bg-[#11388d]/10"
          >
            Sign In
          </Link>
        )}
        <div className="flex text-lg cursor-pointer text-black gap-x-2.5">
          <span onClick={fbClick}>
            <FacebookFilled />
          </span>
          <span onClick={igClick}>
            <InstagramFilled />
          </span>
        </div>
      </div>
    </header>
  )
}
