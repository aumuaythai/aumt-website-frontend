import React, { lazy, Component, Suspense } from 'react'
import { BrowserRouter, Switch, Route, Redirect } from 'react-router-dom';
import {notification, Spin} from 'antd'
import firebase from 'firebase/app'
import Header from './Header/Header'
import {LoginForm} from './Header/LoginForm'
import {About} from './Content/info/About'
import EventsWrapper from './Content/events/EventsWrapper'
import {Faq} from './Content/info/Faq'
import {Merch} from './Content/info/Merch'
import { MainJoin } from './Content/join/MainJoin'
import { Account } from './Content/account/Account'
import { ErrorBoundary } from './Content/error/ErrorBoundary'
import './Aumt.css'
import DB from '../services/db'
import Analytics from '../services/analytics'
import FirebaseUtil from '../services/firebase.util'
import Functions from '../services/functions'
import { AumtMember, ClubConfig } from '../types';

const MainAdminLazyWrapper = (
  lazy(() => (
    import('./Admin/MainAdmin' /* webpackChunkName: "main-admin" */)
  ))
)

const TeamLazyWrapper = (
  lazy(() => (
    import ('./Content/info/Team' /* webpackChunkName: "team" */)
  ))
)

const SignupsLazyWrapper = (
  lazy(() => (
    import('./Content/signups/Signups' /* webpackChunkName: "signups" */)
  ))
)

export interface AumtProps {

}

export interface AumtState {
    loadingAuthedUser: boolean
    authedUser: AumtMember | null
    userIsAdmin: boolean
    authedUserId: string
    clubSignupStatus: 'open' | 'closed' | 'loading'
    clubSignupSem: 'S1' | 'S2' | 'loading' | 'SS'
    clubConfig: ClubConfig | null
}

export class Aumt extends Component<AumtProps, AumtState> {
    constructor(props: AumtProps) {
        super(props)
        const authedUser = null
        this.state = {
          authedUser,
          loadingAuthedUser: true,
          userIsAdmin: false,
          authedUserId: '',
          clubSignupStatus: 'loading',
          clubSignupSem: 'loading',
          clubConfig: null
        }
        
        // Initilize firebase products.
        FirebaseUtil.initialize(this.authStateChange)
        Analytics.initialize();
        Functions.initialize();
        DB.initialize()

        DB.getClubConfig()
          .then((config) => {
            this.setState({
              ...this.state,
              clubSignupStatus: config.clubSignupStatus,
              clubSignupSem: config.clubSignupSem,
              clubConfig: {...config}
            })
          })
          .catch((err) => {
            notification.error({message: 'Failed to get website config: ' + err.toString()})
          })
    }

    private authStateChange = (fbUser: firebase.User | null) => {
      if (fbUser) {
        DB.getUserInfo(fbUser)
          .then((userInfo: AumtMember) => {
            this.setState({
              ...this.state,
              authedUser: userInfo,
              loadingAuthedUser: false,
              authedUserId: fbUser.uid
            })
            return DB.getIsAdmin(fbUser.uid)
        })
        .then((isAdmin: boolean) => {
          this.setState({
            ...this.state,
            userIsAdmin: isAdmin
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
            loadingAuthedUser: false,
            userIsAdmin: false
          })
          return FirebaseUtil.signOut()
        })
        .catch((err) => {
          notification.error({message: `error with email verified ${err}`})
        })
      } else {
        this.setState({
          ...this.state,
          authedUser: null,
          authedUserId: '',
          loadingAuthedUser: false,
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
                    <ErrorBoundary>
                      <Suspense fallback={<div><Spin/></div>}>
                        <Switch>
                          <Route path="/about">
                            <Redirect to='/'/>
                          </Route>
                          <Route path="/team">
                            <TeamLazyWrapper></TeamLazyWrapper>
                          </Route>
                          <Route path="/faq">
                            <Faq></Faq>
                          </Route>
                          <Route path = "/merch">
                            <Merch></Merch>
                          </Route>
                          <Route path="/signup">
                            <Redirect to="/signups"/>
                          </Route>
                          <Route path="/signups">
                            <SignupsLazyWrapper
                              paid={this.state.authedUser?.paid === 'Yes'}
                              authedUserId={this.state.authedUserId}
                              clubSignupSem={this.state.clubSignupSem}
                              authedUser={this.state.authedUser}
                              clubConfig={this.state.clubConfig}></SignupsLazyWrapper>
                          </Route>
                          <Route path="/events">
                            {/* {this.state.authedUser ?  */}
                            <EventsWrapper authedUser={this.state.authedUser}></EventsWrapper>
                            {/* : 
                            <div>
                              You must <Link to='/login?from=/events'> log in </Link> to view events.
                            </div>
                            } */}
                          </Route>
                          <Route path="/join">
                            <MainJoin
                              loadingAuthedUser={this.state.loadingAuthedUser}
                              authedUser={this.state.authedUser}
                              authedUserId={this.state.authedUserId}
                              clubConfig={this.state.clubConfig}></MainJoin>
                          </Route>
                          <Route path="/admin">
                            {
                              this.state.userIsAdmin ?
                                <MainAdminLazyWrapper></MainAdminLazyWrapper> :
                                <div>
                                  You are not authorised to access this page.
                                </div>
                            }
                          </Route>
                          <Route path="/account">
                            {
                              this.state.authedUser ?
                                <Account
                                 clubSignupSem={this.state.clubSignupSem}
                              loadingAuthedUser={this.state.loadingAuthedUser}
                              clubSignupStatus={this.state.clubSignupStatus}
                              authedUser={this.state.authedUser}
                              authedUserId={this.state.authedUserId}
                              clubConfig={this.state.clubConfig}></Account> :
                                <div>
                                  You do not have an account yet. Please join.
                                </div>
                            }
                          </Route>
                          <Route path="/penis">
                            <img className='headshotheadshot' src="./photos/tom.jpg" alt="Tom Haliday"/>
                          </Route>
                          <Route path="/">
                            <About></About>
                          </Route>
                        </Switch>
                      </Suspense>
                    </ErrorBoundary>
                  </Route>
                </Switch>
              </BrowserRouter>
            </div>
          );
    }
}