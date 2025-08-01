import { Spin } from 'antd'
import { lazy, Suspense } from 'react'
import { useAuth } from '../../context/AuthProvider'

const MainAdminWrapper = lazy(
  () => import('./MainAdmin' /* webpackChunkName: "main-admin" */)
)

export default function AdminLoader() {
  const { userIsAdmin } = useAuth()

  if (!userIsAdmin) {
    return <div>You are not authorised to access this page.</div>
  }

  return (
    <Suspense fallback={<Spin />}>
      <MainAdminWrapper />
    </Suspense>
  )
}
