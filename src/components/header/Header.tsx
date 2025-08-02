import FacebookFilled from '@ant-design/icons/FacebookFilled'
import InstagramFilled from '@ant-design/icons/InstagramFilled'
import { Link, useLocation } from 'react-router-dom'
import { useAuth } from '../../context/AuthProvider'
import { Links } from '../../services/links'
import './Header.css'
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
    <header className="headerContainer">
      <Link to="/">
        <img className="logoImg" src={'logos/AUMTLogo.png'} alt="" />
      </Link>

      <TopMenu isAdmin={isAdmin} authedUser={authedUser} />
      <div className="socialsContainer">
        {authedUser ? (
          <UserInfo authedUser={authedUser}></UserInfo>
        ) : (
          <Link to={`/login?from=${pathname}`} className="loginButton">
            Sign In
          </Link>
        )}
        <div className="socialIconContainer">
          <span className="socialIcon" onClick={fbClick}>
            <FacebookFilled />
          </span>
          <span className="socialIcon" onClick={igClick}>
            <InstagramFilled />
          </span>
        </div>
      </div>
    </header>
  )
}
