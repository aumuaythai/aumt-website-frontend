import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { Spin } from 'antd'
import 'antd/dist/antd.css'
import { Suspense } from 'react'
import { BrowserRouter, Route, Routes } from 'react-router'
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
import Account from './components/content/account/Account'
import { ErrorBoundary } from './components/content/error/ErrorBoundary'
import Event from './components/content/events/Event'
import Events from './components/content/events/Events'
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
                  <Route element={<AdminLayout />}>
                    <Route
                      path="/admin"
                      element={<TrainingDashboard forms={[]} />}
                    />
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
                      path="/admin/events/:eventId"
                      element={<EventSignups />}
                    />
                    <Route
                      path="/admin/members"
                      element={<MemberDashboard />}
                    />
                    <Route
                      path="/admin/feedback"
                      element={<Feedback forms={[]} />}
                    />
                    <Route path="/admin/settings" element={<ClubSettings />} />
                    <Route
                      path="/admin/createtraining"
                      element={<CreateTraining />}
                    />
                  </Route>
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
