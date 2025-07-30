import FacebookFilled from '@ant-design/icons/FacebookFilled'
import InstagramFilled from '@ant-design/icons/InstagramFilled'
import { Link, useLocation } from 'react-router-dom'
import { Links } from '../../services/links'
import { AumtMember } from '../../types'
import './Header.css'
import TopMenu from './TopMenu'
import { UserInfo } from './UserInfo'

export interface HeaderProps {
  authedUser: AumtMember | null
  isAdmin: boolean
}

export interface HeaderState {}

export default function Header(props: HeaderProps) {
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
      <div className="imageContainer">
        <Link to="/">
          <img className="logoImg" src={'logos/AUMTLogo.png'} alt="" />
        </Link>
      </div>
      <TopMenu isAdmin={props.isAdmin} authedUser={props.authedUser} />
      <div className="socialsContainer">
        {props.authedUser ? (
          <span className="headerNameSpan">
            <UserInfo authedUser={props.authedUser}></UserInfo>
          </span>
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
