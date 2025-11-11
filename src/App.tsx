import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ConfigProvider, Spin } from 'antd'
import { Suspense, useEffect } from 'react'
import { BrowserRouter, Route, Routes, useLocation } from 'react-router'
import About from './components/about/About'
import Faq from './components/about/Faq'
import Gallery from './components/about/Gallery'
import Account from './components/account/Account'
import AdminLayout from './components/admin/AdminLayout'
import CreateEvent from './components/admin/events/CreateEvent'
import EventSignups from './components/admin/events/EventSignups'
import ManageEvents from './components/admin/events/ManageEvents'
import Feedback from './components/admin/feedback/Feedback'
import MemberDashboard from './components/admin/members/MemberDashboard'
import ClubSettings from './components/admin/settings/ClubSettings'
import CreateTraining from './components/admin/trainings/CreateTraining'
import TrainingAttendance from './components/admin/trainings/TrainingAttendance'
import TrainingDashboard from './components/admin/trainings/TrainingDashboard'
import { ErrorBoundary } from './components/error/ErrorBoundary'
import Event from './components/events/Event'
import Events from './components/events/Events'
import Header from './components/header/Header'
import Join from './components/join/Join'
import LoginForm from './components/login/LoginForm'
import Trainings from './components/trainings/Trainings'
import AuthProvider from './context/AuthProvider'

const queryClient = new QueryClient()

export default function App() {
  const location = useLocation()

  useEffect(() => {
    const route = location.pathname.split('/')[1]
    let title = 'Auckland University Muay Thai'
    if (route) {
      title = `AUMT - ${route.charAt(0).toUpperCase() + route.slice(1)}`
    }

    document.title = title
  }, [location.pathname])

  return (
    <QueryClientProvider client={queryClient}>
      <ConfigProvider
        theme={{
          token: {
            borderRadius: 0,
            fontFamily: 'var(--font-inter)',
          },
        }}
      >
        <AuthProvider>
          <Header />
          <ErrorBoundary>
            <Suspense fallback={<Spin />}>
              <Routes>
                <Route path="/login" element={<LoginForm />} />
                <Route path="/" element={<About />} />
                <Route path="/faq" element={<Faq />} />
                <Route path="/gallery" element={<Gallery />} />
                <Route path="/trainings" element={<Trainings />} />
                <Route path="/events" element={<Events />} />
                <Route path="/events/:eventId" element={<Event />} />
                <Route path="/join" element={<Join />} />
                <Route element={<AdminLayout />}>
                  <Route path="/admin" element={<TrainingDashboard />} />
                  <Route
                    path="/admin/trainings/create"
                    element={<CreateTraining />}
                  />
                  <Route
                    path="/admin/trainings/:trainingId"
                    element={<CreateTraining />}
                  />
                  <Route
                    path="/admin/trainings/:trainingId/attendance"
                    element={<TrainingAttendance />}
                  />
                  <Route path="/admin/events" element={<ManageEvents />} />
                  <Route
                    path="/admin/events/create"
                    element={<CreateEvent />}
                  />
                  <Route
                    path="/admin/events/:eventId"
                    element={<CreateEvent />}
                  />
                  <Route
                    path="/admin/events/:eventId/signups"
                    element={<EventSignups />}
                  />
                  <Route path="/admin/members" element={<MemberDashboard />} />
                  <Route path="/admin/feedback" element={<Feedback />} />
                  <Route path="/admin/settings" element={<ClubSettings />} />
                </Route>
                <Route path="/account" element={<Account />} />
                <Route
                  path="/penis"
                  element={<img src="./photos/tom.jpg" alt="Tom Haliday" />}
                />
              </Routes>
            </Suspense>
          </ErrorBoundary>
        </AuthProvider>
      </ConfigProvider>
    </QueryClientProvider>
  )
}
