import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import { User } from 'firebase/app'
import { FacebookFilled, InstagramFilled } from '@ant-design/icons'
import { Button } from 'antd'
import TopMenu from './TopMenu'
import UserInfo from './UserInfo'
import './Header.css'

export interface HeaderProps {
    authedUser: User | null
}

export interface HeaderState {
}

export class Header extends Component<HeaderProps, HeaderState> {
    fbClick = () => {
        window.open('https://www.facebook.com/aumuaythai/', '_blank')
    }
    igClick = () => {
        window.open('https://www.instagram.com/aumuaythai', '_blank')
    }
    render() {
        return (
            <div className="headerContainer">
                <div className="imageContainer">
                    <Link to='/'><img src={"./logorectangle.png"} alt=""/></Link>
                </div>
                <div className="topMenuContainer">
                    <TopMenu></TopMenu>
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