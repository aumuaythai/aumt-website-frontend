import { notification, Spin } from 'antd'
import firebase from 'firebase/app'
import React, { lazy, Suspense, useEffect, useState } from 'react'
import { BrowserRouter, Redirect, Route, Switch } from 'react-router-dom'
import Analytics from '../services/analytics'
import DB from '../services/db'
import FirebaseUtil from '../services/firebase.util'
import Functions from '../services/functions'
import { AumtMember, ClubConfig } from '../types'
import './Aumt.css'
import Account from './Content/account/Account'
import { ErrorBoundary } from './Content/error/ErrorBoundary'
import EventsWrapper from './Content/events/EventsWrapper'
import { About } from './Content/info/About'
import { Faq } from './Content/info/Faq'
import { Gallery } from './Content/info/Gallery'
import { MainJoin } from './Content/join/MainJoin'
import Header from './Header/Header'
import { LoginForm } from './Header/LoginForm'

const MainAdminLazyWrapper = lazy(
  () => import('./Admin/MainAdmin' /* webpackChunkName: "main-admin" */)
)

// const TeamLazyWrapper = lazy(
//   () => import('./Content/info/Team' /* webpackChunkName: "team" */)
// )

const SignupsLazyWrapper = lazy(
  () => import('./Content/signups/Signups' /* webpackChunkName: "signups" */)
)

export default function Aumt() {
  const [authedUser, setAuthedUser] = useState<AumtMember | null>(null)
  const [userIsAdmin, setUserIsAdmin] = useState(false)
  const [authedUserId, setAuthedUserId] = useState('')
  const [clubSignupStatus, setClubSignupStatus] = useState<
    'open' | 'closed' | 'loading'
  >('loading')
  const [clubSignupSem, setClubSignupSem] = useState<
    'S1' | 'S2' | 'loading' | 'SS'
  >('loading')
  const [clubConfig, setClubConfig] = useState<ClubConfig | null>(null)

  const loadingAuthedUser = !!authedUser

  useEffect(() => {
    FirebaseUtil.initialize(authStateChange)
    Analytics.initialize()
    Functions.initialize()
    DB.initialize()

    DB.getClubConfig()
      .then((config) => {
        setClubSignupStatus(config.clubSignupStatus)
        setClubSignupSem(config.clubSignupSem)
        setClubConfig(config)
      })
      .catch((err) => {
        notification.error({
          message: 'Failed to get website config: ' + err.toString(),
        })
      })
  }, [])

  function authStateChange(fbUser: firebase.User | null) {
    if (fbUser) {
      DB.getUserInfo(fbUser)
        .then((userInfo: AumtMember) => {
          setAuthedUser(userInfo)
          setAuthedUserId(fbUser.uid)
          return DB.getIsAdmin(fbUser.uid)
        })
        .then((isAdmin: boolean) => {
          setUserIsAdmin(isAdmin)
        })
        .catch((err) => {
          if (err === 'No User for uid') {
            notification.error({
              message: 'Error logging in',
              description:
                'User is registered but not in database! Message the AUMT team on facebook as this should not happen :)',
            })
          } else {
            notification.error({
              message: `Error logging in: ${err}`,
            })
          }
          setAuthedUser(null)
          setAuthedUserId('')
          setUserIsAdmin(false)
          return FirebaseUtil.signOut()
        })
        .catch((err) => {
          notification.error({ message: `error with email verified ${err}` })
        })
    } else {
      setAuthedUser(null)
      setAuthedUserId('')
      setUserIsAdmin(false)
    }
  }

  return (
    <div className="App">
      <BrowserRouter>
        <Switch>
          <Route path="/login">
            <LoginForm></LoginForm>
          </Route>
          <Route path="/*">
            <Header authedUser={authedUser} isAdmin={userIsAdmin}></Header>
            <ErrorBoundary>
              <Suspense
                fallback={
                  <div>
                    <Spin />
                  </div>
                }
              >
                <Switch>
                  <Route path="/about">
                    <Redirect to="/" />
                  </Route>
                  {/* <Route path="/team">
                      <TeamLazyWrapper></TeamLazyWrapper>
                    </Route> */}
                  <Route path="/faq">
                    <Faq></Faq>
                  </Route>
                  <Route path="/gallery">
                    <Gallery></Gallery>
                  </Route>
                  <Route path="/signup">
                    <Redirect to="/signups" />
                  </Route>
                  <Route path="/signups">
                    <SignupsLazyWrapper
                      paid={authedUser?.paid === 'Yes'}
                      authedUserId={authedUserId}
                      clubSignupSem={clubSignupSem}
                      authedUser={authedUser}
                      clubConfig={clubConfig}
                    ></SignupsLazyWrapper>
                  </Route>
                  <Route path="/events">
                    <EventsWrapper authedUser={authedUser}></EventsWrapper>
                  </Route>
                  <Route path="/join">
                    <MainJoin
                      loadingAuthedUser={loadingAuthedUser}
                      authedUser={authedUser}
                      authedUserId={authedUserId}
                      clubConfig={clubConfig}
                    ></MainJoin>
                  </Route>
                  <Route path="/admin">
                    {userIsAdmin ? (
                      <MainAdminLazyWrapper></MainAdminLazyWrapper>
                    ) : (
                      <div>You are not authorised to access this page.</div>
                    )}
                  </Route>
                  <Route path="/account">
                    {authedUser ? (
                      <Account
                        clubSignupSem={clubSignupSem}
                        loadingAuthedUser={loadingAuthedUser}
                        clubSignupStatus={clubSignupStatus}
                        authedUser={authedUser}
                        authedUserId={authedUserId}
                        clubConfig={clubConfig}
                      ></Account>
                    ) : (
                      <div>You do not have an account yet. Please join.</div>
                    )}
                  </Route>
                  <Route path="/penis">
                    <img
                      className="headshotheadshot"
                      src="./photos/tom.jpg"
                      alt="Tom Haliday"
                    />
                  </Route>
                  <Route path="/">
                    <About
                      semesterFee={clubConfig?.semesterOneFee}
                      fullYearFee={clubConfig?.fullYearFee}
                    />
                  </Route>
                </Switch>
              </Suspense>
            </ErrorBoundary>
          </Route>
        </Switch>
      </BrowserRouter>
    </div>
  )
}
