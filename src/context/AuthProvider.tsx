import { useMember } from '@/services/members'
import { User as FirebaseUser } from 'firebase/auth'
import { ReactNode, useEffect, useState } from 'react'
import { useIsAdmin } from '../services/auth'
import { auth } from '../services/firebase'
import { User } from '../types'
import { AuthContext } from './use-auth'

export default function AuthProvider({ children }: { children: ReactNode }) {
  const [authUser, setAuthUser] = useState<FirebaseUser | null | undefined>(
    undefined,
  )

  const { data: member, isPending: isLoadingMember } = useMember(authUser?.uid)
  const { data: isAdmin, isPending: isLoadingAdmin } = useIsAdmin(authUser?.uid)

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => setAuthUser(user))
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
      value={{
        user,
        isLoading:
          authUser === undefined ||
          (!!authUser?.uid && (isLoadingMember || isLoadingAdmin)),
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}
