import React, { Component } from 'react'
import { Link, withRouter, RouteComponentProps } from 'react-router-dom'
import {Menu} from 'antd';
import {DownOutlined} from '@ant-design/icons'
import './TopMenu.css'

export interface TopMenuProps extends RouteComponentProps {
  isAdmin: boolean
}

export interface TopMenuState {
    current: string
}

class TopMenu extends Component<TopMenuProps, TopMenuState> {
    private unlisten: null | Function = null;
    constructor(props: TopMenuProps) {
        super(props)
        this.state = {
            current: 'About'
        }
        this.unlisten = null
    }

    componentDidMount = () => {
        this.setStateFromPathChange(window.location.pathname)
        this.unlisten = this.props.history.listen(this.onRouteChange);
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
        const menuPages = ['About', 'Signups', 'Events', 'Join', 'FAQ', 'Team', 'Admin']
        for (const page of menuPages) {
          if (page.toLowerCase() === pathname.toLowerCase()) {
            this.setState({
              current: page
            })
            return
          }
        }
        this.setState({current: 'About'})
    }

  handleClick = (e: {key: string}) => {
    this.setState({
      current: e.key,
    });
  };

  mobileMenu = () => {
    return (
      <Menu onClick={this.handleClick} selectedKeys={[this.state.current]} mode='horizontal'>
        <Menu.SubMenu title={
            <>
            Menu <DownOutlined className='menuDownIcon' />
            </>
          }>
            <Menu.SubMenu title='About'>
              <Menu.Item key="About">
                <Link to='/'>Club Info</Link>
              </Menu.Item>
              <Menu.Item key="Team">
                <Link to='/team'>Our Team</Link>
              </Menu.Item>
              <Menu.Item key="FAQ">
                <Link to='/faq'>FAQ</Link>
              </Menu.Item>
            </Menu.SubMenu>
            {this.props.isAdmin ?
          (
            <Menu.Item key="Admin">
              <Link to='/admin'>Admin</Link>
            </Menu.Item>
          ) : ''}
          <Menu.Item key="Signups">
            <Link to='/signups'>Sign-ups</Link>
          </Menu.Item>
          <Menu.Item key="Events">
            <Link to='/events'>Events</Link>
          </Menu.Item>
          <Menu.Item key="Join">
            <Link to='/join'>Join</Link>
          </Menu.Item>
        </Menu.SubMenu>
      </Menu>
    )
  }

  desktopMenu = () => {
    return (
      <Menu onClick={this.handleClick} selectedKeys={[this.state.current]} mode="horizontal">
        <Menu.SubMenu title={
            <>
            About <DownOutlined className='menuDownIcon' />
            </>
          }>
          <Menu.Item key="About">
            <Link to='/'>Club Info</Link>
          </Menu.Item>
          <Menu.Item key="Team">
            <Link to='/team'>Our Team</Link>
          </Menu.Item>
          <Menu.Item key="FAQ">
            <Link to='/faq'>FAQ</Link>
          </Menu.Item>
        </Menu.SubMenu>
        <Menu.Item key="Signups">
          <Link to='/signups'>Sign-ups</Link>
        </Menu.Item>
        <Menu.Item key="Events">
          <Link to='/events'>Events</Link>
        </Menu.Item>
        <Menu.Item key="Join">
          <Link to='/join'>Join</Link>
        </Menu.Item>
        {this.props.isAdmin ?
          (
            <Menu.Item key="Admin">
              <Link to='/admin'>Admin</Link>
            </Menu.Item>
          ) : ''}
      </Menu>
    );
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