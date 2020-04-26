import React, { Component } from 'react'
import {notification} from 'antd'
import { BrowserRouter, Switch, Route, Redirect } from 'react-router-dom';
import { User } from 'firebase/app'
import { Header } from './Header/Header'
import {LoginForm} from './Header/LoginForm'
import {About} from './Content/info/About'
import {Signups} from './Content/signups/Signups'
import EventsWrapper from './Content/events/EventsWrapper'
import {Faq} from './Content/info/Faq'
import { MainJoin } from './Content/join/MainJoin'
import './Aumt.css'
import {Team} from './Content/info/Team';
import DB from '../services/db'
import FirebaseUtil from '../services/firebase.util'
import { AumtMember } from '../types';
import MainAdmin from './Admin/MainAdmin';

export interface AumtProps {

}

export interface AumtState {
    authedUser: AumtMember | null
    userIsAdmin: boolean
    authedUserId: string
}

export class Aumt extends Component<AumtProps, AumtState> {
    constructor(props: AumtProps) {
        super(props)
        let authedUser = null
        this.state = { authedUser, userIsAdmin: false, authedUserId: '' }
        FirebaseUtil.initialize(this.authStateChange)
        DB.initialize()
    }

    private authStateChange = (fbUser: User | null) => {
      if (fbUser) {
        DB.getUserInfo(fbUser).then((userInfo: AumtMember) => {
          this.setState({
            ...this.state,
            authedUser: userInfo,
            authedUserId: fbUser.uid
          })
          DB.getIsAdmin(fbUser.uid).then((isAdmin: boolean) => {
            this.setState({
              ...this.state,
              userIsAdmin: isAdmin
            })
          })
        })
        .catch((err) => {
          if (err === 'No User for uid') {
            notification.error({
              message: 'Error logging in',
              description: 'User is registered but not in database! Message the AUMT team on facebook as this should not happen :)'
            })
          } else {
            notification.error({
              message: `Error logging in: ${err}`
            })
          }
          this.setState({
            ...this.state,
            authedUser: null,
            authedUserId: '',
            userIsAdmin: false
          })
          return FirebaseUtil.signOut()
        })
      } else {
        this.setState({
          ...this.state,
          authedUser: null,
          authedUserId: '',
          userIsAdmin: false
        })
      }
    }

    render() {
        return (
            <div className="App">
              <BrowserRouter>
                <Switch>
                  <Route path="/login">
                    <LoginForm></LoginForm>
                  </Route>
                  <Route path="/*">
                    <Header authedUser={this.state.authedUser} isAdmin={this.state.userIsAdmin}></Header>
                    <Switch>
                      <Route path="/about">
                        <Redirect to='/'/>
                      </Route>
                      <Route path="/team">
                        <Team></Team>
                      </Route>
                      <Route path="/faq">
                        <Faq></Faq>
                      </Route>
                      <Route path="/signups">
                        {/* {this.state.authedUser ? */}
                          <Signups authedUserId={this.state.authedUserId} authedUser={this.state.authedUser}></Signups>
                          {/* : <p>You must sign in to be able to sign up for trainings!</p>} */}
                      </Route>
                      <Route path="/events">
                      {this.state.authedUser ?
                        <EventsWrapper></EventsWrapper>
                        : <p>You must sign in to be able to view events!</p>}
                      </Route>
                      <Route path="/join">
                        <MainJoin authedUser={this.state.authedUser} authedUserId={this.state.authedUserId}></MainJoin>
                      </Route>
                      <Route path="/admin">
                        {
                          this.state.userIsAdmin ?
                            <MainAdmin></MainAdmin> :
                            <Redirect to='/'/>
                        }
                      </Route>
                      <Route path="/">
                        <About></About>
                      </Route>
                    </Switch>
                  </Route>
                </Switch>
              </BrowserRouter>
            </div>
          );
    }
}