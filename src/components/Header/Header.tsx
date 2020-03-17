import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import FacebookFilled from '@ant-design/icons/FacebookFilled'
import InstagramFilled from '@ant-design/icons/InstagramFilled'
import {Button} from 'antd'
import TopMenu from './TopMenu'
import UserInfo from './UserInfo'
import { Links } from '../../services/links'
import './Header.css'
import { AumtMember } from '../../types'

export interface HeaderProps {
    authedUser: AumtMember | null
    isAdmin: boolean
}

export interface HeaderState {
}

export class Header extends Component<HeaderProps, HeaderState> {
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
                    <TopMenu isAdmin={this.props.isAdmin}></TopMenu>
                </div>
                <div className="socialsContainer">
                    {
                        this.props.authedUser ?
                            <UserInfo authedUser={this.props.authedUser}></UserInfo> :
                            <Button><Link to='/login'>Sign In</Link></Button>
                    }
                    <span className="socialIcon" onClick={this.fbClick}><FacebookFilled/></span>
                    <span className="socialIcon" onClick={this.igClick}><InstagramFilled/></span>
                </div>
                <div className="clearBoth"></div>
            </div>
          );
    }
}