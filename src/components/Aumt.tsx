import React, { Component } from 'react'
import * as firebase from "firebase/app";
import { User } from 'firebase/app'
import 'firebase/auth';
import 'firebase/database'
import {notification} from 'antd'
import { BrowserRouter, Switch, Route, Redirect } from 'react-router-dom';
import { Header } from './Header/Header'
import LoginForm from './Header/LoginForm'
import About from './Content/About'
import Signups from './Content/Signups'
import Faq from './Content/Faq'
import './Aumt.css'
import Team from './Content/Team';
import DB from '../services/db'
import { AumtMember } from '../types';
import {MainAdmin} from './Admin/MainAdmin';

export interface AumtProps {

}

export interface AumtState {
    authedUser: AumtMember | null
    userIsAdmin: boolean
}

export class Aumt extends Component<AumtProps, AumtState> {
    constructor(props: AumtProps) {
        super(props)
        let authedUser = null
        const firebaseConfig = {

            apiKey: process.env.REACT_APP_FB_API_KEY,
            authDomain: process.env.REACT_APP_FB_AUTH_DOMAIN,
            databaseURL: process.env.REACT_APP_FB_DATABASE_URL,
            projectId: process.env.REACT_APP_FB_PROJECT_ID,
            storageBucket: process.env.REACT_APP_FB_STORAGE_BUCKET,
            messagingSenderId: process.env.REACT_APP_FB_MESSAGING_SENDER_ID,
            appId: process.env.REACT_APP_FB_APP_ID
        }
        this.state = { authedUser, userIsAdmin: false }
        if (!firebase.apps.length) {
          firebase.initializeApp(firebaseConfig);
          DB.initialize()
          firebase.auth().onAuthStateChanged((fbUser: User | null) => {
            if (fbUser) {
              DB.getUserInfo(fbUser).then((userInfo: AumtMember) => {
                this.setState({
                  ...this.state,
                  authedUser: userInfo
                })
                DB.getIsAdmin(fbUser.uid).then((isAdmin: boolean) => {
                  console.log('setting isadmin', isAdmin)
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
                    message: 'Error logging in - Please contact AUMT team on facebook'
                  })
                }
                this.setState({
                  ...this.state,
                  authedUser: null,
                  userIsAdmin: false
                })
              })
            } else {
              this.setState({
                ...this.state,
                authedUser: null,
                userIsAdmin: false
              })
            }
          });
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
                      <Route path="/signups">
                        {this.state.authedUser ? <Signups authedUser={this.state.authedUser}></Signups> : <p>You must sign in to be able to sign up for trainings!</p>}
                      </Route>
                      <Route path="/events">
                        <p>Events page coming soon! </p>
                      </Route>
                      <Route path="/faq">
                        <Faq></Faq>
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