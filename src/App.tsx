import React from 'react';
import { BrowserRouter, Switch, Route, Redirect } from 'react-router-dom';
import './App.css';
import * as firebase from "firebase/app";
import 'firebase/auth';
import 'antd/dist/antd.css';
import { Header } from './components/Header'
import LoginForm from './components/LoginForm'

function App() {
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
  return (
    <div className="App">
      <BrowserRouter>
        <Switch>
          <Route path="/login">
            <LoginForm></LoginForm>
          </Route>
          <Route path="/*">
            <Header></Header>
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

export default App;
