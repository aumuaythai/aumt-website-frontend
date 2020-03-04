import React, { Component } from 'react'
import { Link, withRouter } from 'react-router-dom'
import { Menu } from 'antd';


export interface TopMenuState {
    current: string
}

class TopMenuWithoutRouter extends Component<any, TopMenuState> {
    private unlisten: null | Function = null;
    constructor(props: any) {
        super(props)
        this.state = {
            current: 'Home'
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
        const pathname = windowPath.slice(1)
        const formattedPath = pathname.charAt(0).toUpperCase() + pathname.slice(1)
        if (['Signups', 'Events', 'Home'].indexOf(formattedPath) > -1) {
            this.setState({current: formattedPath})
        } else {
            this.setState({current: 'Home'})
        }
    }

  handleClick = (e: {key: string}) => {
    this.setState({
      current: e.key,
    });
  };

  render() {
    return (
      <Menu onClick={this.handleClick} selectedKeys={[this.state.current]} mode="horizontal">
        <Menu.Item key="Home">
          <Link to='/'>Home</Link>
        </Menu.Item>
        <Menu.Item key="Signups">
          <Link to='/signups'>Sign-ups</Link>
        </Menu.Item>
        <Menu.Item key="Events">
          <Link to='/events'>Events</Link>
        </Menu.Item>
      </Menu>
    );
  }
}

const TopMenu = withRouter(TopMenuWithoutRouter)

export default TopMenu