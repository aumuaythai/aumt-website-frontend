import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import { FacebookFilled, InstagramFilled } from '@ant-design/icons'
import { Button } from 'antd'
import TopMenuRouter from './TopMenu'
import './Header.css'

export interface HeaderProps {

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
                    <TopMenuRouter></TopMenuRouter>
                </div>
                <div className="socialsContainer">
                    <Button><Link to='/login'>Sign In</Link></Button>
                    <span className="socialIcon" onClick={this.fbClick}><FacebookFilled/></span>
                    <span className="socialIcon" onClick={this.igClick}><InstagramFilled/></span>
                </div>
                <div className="clearBoth"></div>
            </div>
          );
    }
}