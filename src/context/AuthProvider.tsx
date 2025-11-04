import { notification } from 'antd'
import firebase from 'firebase/app'
import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from 'react'
import { signOut } from '../services/auth'
import { getIsAdmin, getUserInfo } from '../services/db'
import { auth } from '../services/firebase'
import { Member } from '../types'

const AuthContext = createContext<{
  user: Member | null
  userIsAdmin: boolean
  userId: string
}>({
  user: null,
  userIsAdmin: false,
  userId: '',
})

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }

  return context
}

export default function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<Member | null>(null)
  const [userIsAdmin, setUserIsAdmin] = useState(false)
  const [userId, setUserId] = useState('')

  useEffect(() => {
    auth.onAuthStateChanged(handleAuthStateChange)
  }, [])

  async function handleAuthStateChange(fbUser: firebase.User | null) {
    if (!fbUser) {
      setUser(null)
      setUserId('')
      setUserIsAdmin(false)
      return
    }

    try {
      const userInfo: Member = await getUserInfo(fbUser)
      setUser(userInfo)
      setUserId(fbUser.uid)

      const isAdmin: boolean = await getIsAdmin(fbUser.uid)
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
      setUser(null)
      setUserId('')
      setUserIsAdmin(false)
      try {
        await signOut()
      } catch (signOutErr) {
        notification.error({
          message: `Error signing out: ${signOutErr}`,
        })
      }
    }
  }

  return (
    <AuthContext.Provider value={{ user, userIsAdmin, userId }}>
      {children}
    </AuthContext.Provider>
  )
}
