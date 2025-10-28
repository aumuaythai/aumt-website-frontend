import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { Spin } from 'antd'
import 'antd/dist/antd.css'
import { Suspense } from 'react'
import { BrowserRouter, Route, Routes } from 'react-router'
import AdminLoader from './components/admin/AdminLoader'
import Account from './components/content/account/Account'
import { ErrorBoundary } from './components/content/error/ErrorBoundary'
import Event from './components/content/events/Event'
import Events from './components/content/events/Events'
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

const queryClient = new QueryClient()

export default function App() {
  return (
    <BrowserRouter>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <ConfigProvider>
            <Header />
            <ErrorBoundary>
              <Suspense fallback={<Spin />}>
                <Routes>
                  <Route path="/login" element={<LoginForm />} />
                  <Route path="/" element={<About />} />
                  <Route path="/faq" element={<Faq />} />
                  <Route path="/gallery" element={<Gallery />} />
                  <Route path="/signups" element={<Signups />} />
                  <Route path="/events" element={<Events />} />
                  <Route path="/events/:eventId" element={<Event />} />
                  <Route path="/join" element={<MainJoin />} />
                  <Route path="/admin" element={<AdminLoader />} />
                  <Route path="/account" element={<Account />} />
                  <Route
                    path="/penis"
                    element={
                      <img
                        className="headshotheadshot"
                        src="./photos/tom.jpg"
                        alt="Tom Haliday"
                      />
                    }
                  />
                </Routes>
              </Suspense>
            </ErrorBoundary>
          </ConfigProvider>
        </AuthProvider>
      </QueryClientProvider>
    </BrowserRouter>
  )
}
