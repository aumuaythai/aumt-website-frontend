import React, { Component } from 'react'
import * as firebase from "firebase/app";
import { User } from 'firebase/app'
import 'firebase/auth';
import { BrowserRouter, Switch, Route, Redirect } from 'react-router-dom';
import { Header } from './Header'
import LoginForm from './LoginForm'

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
        firebase.initializeApp(firebaseConfig);
        this.state = { authedUser }
        firebase.auth().onAuthStateChanged((user: User | null) => {
            console.log('changed auth status, user as ', user)
            this.setState({
                authedUser: user
            })
        });
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
                      <Route path="/home">
                        <Redirect to='/'/>
                      </Route>
                      <Route path="/signups">
                        <h2>signups route</h2>
                      </Route>
                      <Route path="/events">
                        <h2>events route</h2>
                      </Route>
                      <Route path="/">
                        <h2>No route</h2>
                      </Route>
                    </Switch>
                  </Route>
                </Switch>
              </BrowserRouter>
            </div>
          );
    }
}