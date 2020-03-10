import React, { Component } from 'react'
import * as firebase from "firebase/app";
import { User } from 'firebase/app'
import 'firebase/auth';
import { BrowserRouter, Switch, Route, Redirect } from 'react-router-dom';
import { Header } from './Header/Header'
import LoginForm from './Header/LoginForm'
import About from './Content/About'
import Signups from './Content/Signups'
import Faq from './Content/Faq'
import './Aumt.css'
import Team from './Content/Team';

export interface AumtProps {

}

export interface AumtState {
    authedUser: User | null
}

export class Aumt extends Component<AumtProps, AumtState> {
    private iframeStr =  {
      __html: `<iframe src="https://docs.google.com/forms/d/e/1FAIpQLSdwanlZn5RuHVePL5fWpgR2RnQKmCyaiu0xNo3enbxdDU6yHQ/viewform?embedded=true" width="600" height="1350" frameborder="0" marginheight="0" marginwidth="0">Loading…</iframe>`
    }
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
                      <Route path="/about">
                        <Redirect to='/'/>
                      </Route>
                      <Route path="/team">
                        <Team></Team>
                      </Route>
                      <Route path="/signups">
                        {/* {this.state.authedUser ? <Signups authedUser={this.state.authedUser}></Signups> : <p>You must sign in to be able to sign up for trainings!</p>} */}
                        <div dangerouslySetInnerHTML={this.iframeStr}></div>
                      </Route>
                      <Route path="/events">
                        <p>Events page coming soon! </p>
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