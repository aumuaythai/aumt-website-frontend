import { useMember } from '@/services/members'
import { User as FirebaseUser } from 'firebase/auth'
import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from 'react'
import { useIsAdmin } from '../services/auth'
import { auth } from '../services/firebase'
import { Member } from '../types'

type User = {
  userId: string
  user: Member
  isAdmin: boolean | undefined
} | null

const AuthContext = createContext<User | null>(null)

export function useAuth() {
  return useContext(AuthContext)
}

export default function AuthProvider({ children }: { children: ReactNode }) {
  const [authUser, setAuthUser] = useState<FirebaseUser | null>(null)

  const { data: member } = useMember(authUser?.uid)
  const { data: isAdmin } = useIsAdmin(authUser?.uid)

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(setAuthUser)
    return () => unsubscribe()
  }, [])

  let user: User | null = null
  if (authUser && member) {
    user = {
      userId: authUser.uid,
      user: member,
      isAdmin: isAdmin,
    }
  }

  return <AuthContext.Provider value={user}>{children}</AuthContext.Provider>
}
