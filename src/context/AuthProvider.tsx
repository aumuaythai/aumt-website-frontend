import { useMember } from '@/services/members'
import { User as FirebaseUser } from 'firebase/auth'
import { ReactNode, useEffect, useState } from 'react'
import { useIsAdmin } from '../services/auth'
import { auth } from '../services/firebase'
import { User } from '../types'
import { AuthContext } from './use-auth'

export default function AuthProvider({ children }: { children: ReactNode }) {
  const [authUser, setAuthUser] = useState<FirebaseUser | null>(null)

  const { data: member, isLoading: isLoadingMember } = useMember(authUser?.uid)
  const { data: isAdmin, isPending: isLoadingAdmin } = useIsAdmin(authUser?.uid)

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(setAuthUser)
    return () => unsubscribe()
  }, [])

  let user: User | null = null
  if (authUser && member) {
    user = {
      ...member,
      id: authUser.uid,
      isAdmin: isAdmin,
    }
  }

  return (
    <AuthContext.Provider
      value={{ user, isLoading: isLoadingMember || isLoadingAdmin }}
    >
      {children}
    </AuthContext.Provider>
  )
}
