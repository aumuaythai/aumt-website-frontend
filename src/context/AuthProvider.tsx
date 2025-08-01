import { notification } from 'antd'
import 'antd/dist/antd.css'
import firebase from 'firebase/app'
import { createContext, ReactNode, useEffect, useState } from 'react'
import Analytics from '../services/analytics'
import DB from '../services/db'
import FirebaseUtil from '../services/firebase.util'
import Functions from '../services/functions'
import { AumtMember } from '../types'
import './App.css'

const AuthContext = createContext<{
  authedUser: AumtMember | null
  userIsAdmin: boolean
  authedUserId: string
}>({
  authedUser: null,
  userIsAdmin: false,
  authedUserId: '',
})

export default function AuthProvider({ children }: { children: ReactNode }) {
  const [authedUser, setAuthedUser] = useState<AumtMember | null>(null)
  const [userIsAdmin, setUserIsAdmin] = useState(false)
  const [authedUserId, setAuthedUserId] = useState('')

  useEffect(() => {
    FirebaseUtil.initialize(authStateChange)
    Analytics.initialize()
    Functions.initialize()
    DB.initialize()
  }, [])

  async function authStateChange(fbUser: firebase.User | null) {
    if (!fbUser) {
      setAuthedUser(null)
      setAuthedUserId('')
      setUserIsAdmin(false)
      return
    }

    try {
      const userInfo: AumtMember = await DB.getUserInfo(fbUser)
      setAuthedUser(userInfo)
      setAuthedUserId(fbUser.uid)

      const isAdmin: boolean = await DB.getIsAdmin(fbUser.uid)
      setUserIsAdmin(isAdmin)
    } catch (err) {
      if (err === 'No User for uid') {
        notification.error({
          message: 'Error logging in',
          description:
            'User is registered but not in database! Message the AUMT team on Facebook as this should not happen :)',
        })
      } else {
        notification.error({
          message: `Error logging in: ${err}`,
        })
      }
      setAuthedUser(null)
      setAuthedUserId('')
      setUserIsAdmin(false)
      try {
        await FirebaseUtil.signOut()
      } catch (signOutErr) {
        notification.error({
          message: `Error signing out: ${signOutErr}`,
        })
      }
    }
  }

  return (
    <AuthContext.Provider value={{ authedUser, userIsAdmin, authedUserId }}>
      {children}
    </AuthContext.Provider>
  )
}
