import { Spin } from 'antd'
import 'antd/dist/antd.css'
import { lazy, Suspense } from 'react'
import { BrowserRouter, Redirect, Route, Switch } from 'react-router-dom'
import './App.css'
import Account from './components/Content/account/Account'
import { ErrorBoundary } from './components/Content/error/ErrorBoundary'
import EventsWrapper from './components/Content/events/EventsWrapper'
import About from './components/Content/info/About'
import Faq from './components/Content/info/Faq'
import Gallery from './components/Content/info/Gallery'
import { MainJoin } from './components/Content/join/MainJoin'
import Header from './components/Header/Header'
import { LoginForm } from './components/Header/LoginForm'
import AuthProvider, { useAuth } from './context/AuthProvider'
import ConfigProvider, { useConfig } from './context/ConfigProvider'

const MainAdminLazyWrapper = lazy(
  () =>
    import('./components/Admin/MainAdmin' /* webpackChunkName: "main-admin" */)
)

// const TeamLazyWrapper = lazy(
//   () => import('./Content/info/Team' /* webpackChunkName: "team" */)
// )

const SignupsLazyWrapper = lazy(
  () =>
    import(
      './components/Content/signups/Signups' /* webpackChunkName: "signups" */
    )
)

export default function App() {
  const { authedUser, authedUserId, userIsAdmin } = useAuth()
  const { clubConfig, clubSignupSem, clubSignupStatus } = useConfig()

  const loadingAuthedUser = !!authedUser

  return (
    <div className="App">
      <BrowserRouter>
        <AuthProvider>
          <ConfigProvider>
            <Switch>
              <Route path="/login">
                <LoginForm />
              </Route>
              <Route path="/*">
                <Header />
                <ErrorBoundary>
                  <Suspense fallback={<Spin />}>
                    <Switch>
                      {/* <Route path="/team">
                      <TeamLazyWrapper></TeamLazyWrapper>
                    </Route> */}
                      <Route path="/faq">
                        <Faq />
                      </Route>
                      <Route path="/gallery">
                        <Gallery />
                      </Route>
                      <Route path="/signup">
                        <Redirect to="/signups" />
                      </Route>
                      <Route path="/signups">
                        <SignupsLazyWrapper />
                      </Route>
                      <Route path="/events">
                        <EventsWrapper authedUser={authedUser} />
                      </Route>
                      <Route path="/join">
                        <MainJoin
                          loadingAuthedUser={loadingAuthedUser}
                          authedUser={authedUser}
                          authedUserId={authedUserId}
                          clubConfig={clubConfig}
                        />
                      </Route>
                      <Route path="/admin">
                        {userIsAdmin ? (
                          <MainAdminLazyWrapper />
                        ) : (
                          <div>You are not authorised to access this page.</div>
                        )}
                      </Route>
                      <Route path="/account">
                        <Account />
                      </Route>
                      <Route path="/penis">
                        <img
                          className="headshotheadshot"
                          src="./photos/tom.jpg"
                          alt="Tom Haliday"
                        />
                      </Route>
                      <Route path="/">
                        <About />
                      </Route>
                    </Switch>
                  </Suspense>
                </ErrorBoundary>
              </Route>
            </Switch>
          </ConfigProvider>
        </AuthProvider>
      </BrowserRouter>
    </div>
  )
}
