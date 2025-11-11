import '@ant-design/v5-patch-for-react-19'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ConfigProvider, Spin } from 'antd'
import { lazy, Suspense, useEffect } from 'react'
import { Route, Routes, useLocation } from 'react-router'
import About from './components/about/About'
import Faq from './components/about/Faq'
import Gallery from './components/about/Gallery'
import Account from './components/account/Account'
import { ErrorBoundary } from './components/error/ErrorBoundary'
import Event from './components/events/Event'
import Events from './components/events/Events'
import Header from './components/header/Header'
import Join from './components/join/Join'
import LoginForm from './components/login/LoginForm'
import Trainings from './components/trainings/Trainings'
import AuthProvider from './context/AuthProvider'

const AdminRoutes = lazy(() => import('./components/admin/AdminRoutes'))

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

                <Route
                  path="/admin/*"
                  element={
                    <Suspense
                      fallback={
                        <div>
                          Loading admin
                          <Spin />
                        </div>
                      }
                    >
                      <AdminRoutes />
                    </Suspense>
                  }
                />

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
