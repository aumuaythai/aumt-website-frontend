import { useQuery } from '@tanstack/react-query'
import {
  sendPasswordResetEmail as firebaseSendPasswordResetEmail,
  signOut as firebaseSignOut,
  signInWithEmailAndPassword,
} from 'firebase/auth'
import { doc, getDoc } from 'firebase/firestore'
import { auth, db } from './firebase'

export async function signIn(email: string, password: string) {
  return await signInWithEmailAndPassword(auth, email, password)
}

export async function signOut(): Promise<void> {
  return await firebaseSignOut(auth)
}

export async function sendPasswordResetEmail(email: string) {
  return firebaseSendPasswordResetEmail(auth, email)
}

export async function getIsAdmin(userId: string) {
  const user = await getDoc(doc(db, 'admin', userId))
  return !!user.exists()
}

export function useIsAdmin(userId?: string) {
  return useQuery({
    queryKey: ['isAdmin', userId],
    queryFn: () => getIsAdmin(userId!),
    enabled: !!userId,
    initialData: false,
  })
}
