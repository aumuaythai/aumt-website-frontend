import { Spin } from 'antd'
import 'antd/dist/antd.css'
import { Suspense } from 'react'
import { BrowserRouter, Redirect, Route } from 'react-router-dom'
import AdminLoader from './components/admin/AdminLoader'
import Account from './components/content/account/Account'
import { ErrorBoundary } from './components/content/error/ErrorBoundary'
import EventsWrapper from './components/content/events/EventsWrapper'
import About from './components/content/info/About'
import Faq from './components/content/info/Faq'
import Gallery from './components/content/info/Gallery'
import MainJoin from './components/content/join/MainJoin'
import Signups from './components/content/signups/Signups'
import Header from './components/header/Header'
import LoginForm from './components/login/LoginForm'
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
