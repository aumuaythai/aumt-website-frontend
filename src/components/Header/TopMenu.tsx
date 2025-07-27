import { DownOutlined } from '@ant-design/icons'
import { Menu as BaseMenu } from 'antd'
import { Component, Key } from 'react'
import { Link, RouteComponentProps, withRouter } from 'react-router-dom'
import styled from 'styled-components'
import { AumtMember } from '../../types'
import './TopMenu.css'

export const Menu = styled(BaseMenu)`
  .ant-menu-item{
    border-bottom: none !important;
    padding: 0 10px !important;
  }

  .ant-menu-item::after {
    display: none;
  }    

  .ant-menu-submenu::after {
    display: none;
  }    

  .ant-menu-item-selected a{
    color: rgba(17,56,141,1) !important;
    border-bottom: none !important;
    font-family: 'Joyride', sans-serif !important;
  }
  .ant-menu-item-active {
    background-color: rgba(17,56,141,0.1) !important;
    color:rgba(17,56,141,1) !important;
    border-bottom: none !important;
  }

  .ant-menu-item-active a{
    color:rgba(17,56,141,1) !important;
  }

  .ant-menu-submenu{
    border-bottom: none !important;
  }
  .ant-menu-submenu-title{    
    padding: 0 10px !important;
  }
  }
  .ant-menu-submenu-active> .ant-menu-submenu-title{
    background-color: rgba(17,56,141,0.1) !important;
    color: rgba(17,56,141,1) !important;
  }
  .ant-menu-submenu-selected> .ant-menu-submenu-title{
    color: rgba(17,56,141,1) !important;
  }

  ant-menu-submenu-title:hover {
    background-color: rgba(17,56,141,0.1) !important;
    color:rgba(17,56,141,1) !important;
    border-bottom: none !important;
  }

  &.ant-menu-submenu-active .ant-menu-submenu-title {
    background-color: rgba(17,56,141,0.1) !important;
    .ant-typography {
      color: WHITE;
    }
  }
`

export interface TopMenuProps extends RouteComponentProps {
  authedUser: AumtMember | null
  isAdmin: boolean
}

export interface TopMenuState {
  current: string
}

class TopMenu extends Component<TopMenuProps, TopMenuState> {
  private unlisten: null | Function = null
  constructor(props: TopMenuProps) {
    super(props)
    this.state = {
      current: 'About',
    }
    this.unlisten = null
  }

  componentDidMount = () => {
    this.setStateFromPathChange(window.location.pathname)
    this.unlisten = this.props.history.listen(this.onRouteChange)
  }

  componentWillUnmount = () => {
    if (this.unlisten) {
      this.unlisten()
    }
  }

  onRouteChange = (location: any, action: string) => {
    this.setStateFromPathChange(location.pathname)
  }

  setStateFromPathChange = (windowPath: string) => {
    const pathname = windowPath.split('/')[1]
    const menuPages = [
      'About',
      'Signups',
      'Events',
      'Join',
      'FAQ',
      'Team',
      'Admin',
      'Account',
    ]
    for (const page of menuPages) {
      if (page.toLowerCase() === pathname.toLowerCase()) {
        this.setState({
          current: page,
        })
        return
      }
    }
    this.setState({ current: 'About' })
  }

  handleClick = (e: { key: Key }) => {
    this.setState({
      current: String(e.key),
    })
  }

  mobileMenu = () => {
    return (
      <Menu
        style={{
          textAlign: 'center',
          border: 'none',
        }}
        onClick={this.handleClick}
        selectedKeys={[this.state.current]}
        mode="horizontal"
      >
        <Menu.SubMenu
          title={
            <>
              Menu <DownOutlined className="menuDownIcon" />
            </>
          }
        >
          <Menu.SubMenu title="About">
            <Menu.Item key="About">
              <Link to="/">Club Info</Link>
            </Menu.Item>
            <Menu.Item key="Gallery">
              <Link to="/gallery">Gallery</Link>
            </Menu.Item>
            {/* <Menu.Item key="Team">
                <Link to='/team'>Our Team</Link>
              </Menu.Item> */}
            <Menu.Item key="FAQ">
              <Link to="/faq">FAQ</Link>
            </Menu.Item>
          </Menu.SubMenu>
          {this.props.isAdmin ? (
            <Menu.Item key="Admin">
              <Link to="/admin">Admin</Link>
            </Menu.Item>
          ) : null}
          <Menu.Item key="Signups">
            <Link to="/signups">Weekly Trainings</Link>
          </Menu.Item>
          <Menu.Item key="Events">
            <Link to="/events">Join Events</Link>
          </Menu.Item>
          {this.props.authedUser ? (
            <Menu.Item key="Account">
              <Link to="/account">My Account</Link>
            </Menu.Item>
          ) : (
            <Menu.Item key="Join">
              <Link to="/join">Create Account</Link>
            </Menu.Item>
          )}
        </Menu.SubMenu>
      </Menu>
    )
  }

  desktopMenu = () => {
    return (
      <Menu
        style={{
          textAlign: 'center',
          border: 'none',
          justifyContent: 'center',
        }}
        onClick={this.handleClick}
        selectedKeys={[this.state.current]}
        mode="horizontal"
      >
        <Menu.SubMenu
          title={
            <>
              About <DownOutlined className="menuDownIcon" />
            </>
          }
        >
          <Menu.Item key="About">
            <Link to="/">Club Info</Link>
          </Menu.Item>
          <Menu.Item key="Gallery">
            <Link to="/gallery">Gallery</Link>
          </Menu.Item>
          {/* <Menu.Item key="Team">
            <Link to='/team'>Our Team</Link>
          </Menu.Item> */}
          <Menu.Item key="FAQ">
            <Link to="/faq">FAQ</Link>
          </Menu.Item>
        </Menu.SubMenu>
        <Menu.Item key="Signups">
          <Link to="/signups">Weekly Trainings</Link>
        </Menu.Item>
        <Menu.Item key="Events">
          <Link to="/events">Join Events</Link>
        </Menu.Item>
        {this.props.authedUser ? (
          <Menu.Item key="Account">
            <Link to="/account">My Account</Link>
          </Menu.Item>
        ) : (
          <Menu.Item key="Join">
            <Link to="/join">Create Account</Link>
          </Menu.Item>
        )}
        {this.props.isAdmin ? (
          <Menu.Item key="Admin">
            <Link to="/admin">Admin</Link>
          </Menu.Item>
        ) : null}
      </Menu>
    )
  }
  render() {
    if (window.innerWidth < 600) {
      return this.mobileMenu()
    } else {
      return this.desktopMenu()
    }
  }
}

export default withRouter(TopMenu)
