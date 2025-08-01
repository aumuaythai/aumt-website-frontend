import { Spin } from 'antd'
import 'antd/dist/antd.css'
import { Suspense } from 'react'
import { BrowserRouter, Redirect, Route } from 'react-router-dom'
import './App.css'
import AdminLoader from './components/Admin/AdminLoader'
import Account from './components/Content/account/Account'
import { ErrorBoundary } from './components/Content/error/ErrorBoundary'
import EventsWrapper from './components/Content/events/EventsWrapper'
import About from './components/Content/info/About'
import Faq from './components/Content/info/Faq'
import Gallery from './components/Content/info/Gallery'
import MainJoin from './components/Content/join/MainJoin'
import Signups from './components/Content/signups/Signups'
import Header from './components/Header/Header'
import { LoginForm } from './components/Header/LoginForm'
import AuthProvider from './context/AuthProvider'
import ConfigProvider from './context/ConfigProvider'

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <ConfigProvider>
          <Route path="/login">
            <LoginForm />
          </Route>
          <Header />
          <ErrorBoundary>
            <Suspense fallback={<Spin />}>
              <Route path="/" exact>
                <About />
              </Route>
              {/* <Route path="/team">
                        <Team />
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
                <Signups />
              </Route>
              <Route path="/events">
                <EventsWrapper />
              </Route>
              <Route path="/join">
                <MainJoin />
              </Route>
              <Route path="/admin">
                <AdminLoader />
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
            </Suspense>
          </ErrorBoundary>
        </ConfigProvider>
      </AuthProvider>
    </BrowserRouter>
  )
}
