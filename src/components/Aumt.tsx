import React, { Component } from 'react'
import * as firebase from "firebase/app";
import { User } from 'firebase/app'
import 'firebase/auth';
import 'firebase/database'
import { BrowserRouter, Switch, Route, Redirect } from 'react-router-dom';
import { Header } from './Header/Header'
import {LoginForm} from './Header/LoginForm'
import {About} from './Content/info/About'
import {Signups} from './Content/signups/Signups'
import EventsWrapper from './Content/events/EventsWrapper'
import {Faq} from './Content/info/Faq'
import './Aumt.css'
import {Team} from './Content/info/Team';
import DB from '../services/db'

export interface AumtProps {

}

export interface AumtState {
    authedUser: User | null
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
        this.state = { authedUser }
        if (!firebase.apps.length) {
          firebase.initializeApp(firebaseConfig);
          DB.initialize()
          firebase.auth().onAuthStateChanged((user: User | null) => {
              this.setState({
                  authedUser: user
              })
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
                    <Header authedUser={this.state.authedUser}></Header>
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
                        <EventsWrapper></EventsWrapper>
                      </Route>
                      <Route path="/faq">
                        <Faq></Faq>
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