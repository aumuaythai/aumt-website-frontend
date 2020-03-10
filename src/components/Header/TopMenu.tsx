import React, { Component } from 'react'
import { Link, withRouter } from 'react-router-dom'
import {Menu} from 'antd';

export interface TopMenuState {
    current: string
}

class TopMenuWithoutRouter extends Component<any, TopMenuState> {
    private unlisten: null | Function = null;
    constructor(props: any) {
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

    onRouteChange = (location: typeof window.location & { state: string}, action: string) => {
        this.setStateFromPathChange(location.pathname)
    }

    setStateFromPathChange = (windowPath: string) => {
        const pathname = windowPath.split('/')[1]
        const menuPages = ['About', 'Signups', 'Events', 'FAQ', 'Team']
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

  render() {
    return (
      <Menu onClick={this.handleClick} selectedKeys={[this.state.current]} mode="horizontal">
        <Menu.SubMenu title='About'>
          <Menu.Item key="About">
            <Link to='/'>Club Info</Link>
          </Menu.Item>
          <Menu.Item key="Team">
            <Link to='/team'>Our Team</Link>
          </Menu.Item>
        </Menu.SubMenu>
        <Menu.Item key="Signups">
          <Link to='/signups'>Sign-ups</Link>
        </Menu.Item>
        <Menu.Item key="Events">
          <Link to='/events'>Events</Link>
        </Menu.Item>
        <Menu.Item key="FAQ">
          <Link to='/faq'>FAQ</Link>
        </Menu.Item>
      </Menu>
    );
  }
}

const TopMenu = withRouter(TopMenuWithoutRouter)

export default TopMenu