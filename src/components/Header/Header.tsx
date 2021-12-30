import React, { Component } from 'react'
import { Link, withRouter, RouteComponentProps } from 'react-router-dom'
import FacebookFilled from '@ant-design/icons/FacebookFilled'
import InstagramFilled from '@ant-design/icons/InstagramFilled'
import {Button} from 'antd'
import TopMenu from './TopMenu'
import {UserInfo} from './UserInfo'
import { Links } from '../../services/links'
import './Header.css'
import { AumtMember } from '../../types'

export interface HeaderProps extends RouteComponentProps {
    authedUser: AumtMember | null
    isAdmin: boolean
}

export interface HeaderState {
}

class Header extends Component<HeaderProps, HeaderState> {
    private routeChangeListener: null | Function = null
    private currentPathname: string = window.location.pathname
    componentDidMount = () => {
        this.routeChangeListener = this.props.history.listen(this.onRouteChange);
    }
    onRouteChange = (location: any, action: string) => {
        this.currentPathname = location.pathname || '/' 
    }
    fbClick = () => {
        Links.openAumtFb()
    }
    igClick = () => {
        Links.openAumtInsta()
    }
    render() {
        return (
            <div className="headerContainer">
                <div className="imageContainer">
                    <Link to='/'><img className='logoImg' src={"./logorectangle.png"} alt=""/></Link>
                </div>
                <div className="topMenuContainer">
                    <TopMenu isAdmin={this.props.isAdmin} authedUser={this.props.authedUser}></TopMenu>
                </div>
                <div className="socialsContainer">
                    {
                        this.props.authedUser ?
                            <span className='headerNameSpan'>
                                <UserInfo authedUser={this.props.authedUser}>
                                </UserInfo>
                            </span> :
                            <Button><Link to={`/login?from=${this.currentPathname}`}>Sign In</Link></Button>
                    }
                    <div className="socialIconContainer">
                        <span className="socialIcon" onClick={this.fbClick}><FacebookFilled/></span>
                        <span className="socialIcon" onClick={this.igClick}><InstagramFilled/></span>
                    </div>
                </div>
                <div className="clearBoth"></div>
            </div>
          );
    }
}
export default withRouter(Header)