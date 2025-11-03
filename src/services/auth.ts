import firebase from 'firebase/app'
import { auth } from './firebase'

export const signIn = (
  email: string,
  password: string
): Promise<firebase.auth.UserCredential> => {
  return auth.signInWithEmailAndPassword(email, password)
}

export const signOut = (): Promise<void> => {
  return auth.signOut()
}

export const getCurrentUser = (): firebase.User | null => {
  return auth.currentUser
}

export const getCurrentUid = (): string | null => {
  const currentUser = getCurrentUser()
  return currentUser ? currentUser.uid : null
}

export const createUser = (email: string, password: string) => {
  return auth.createUserWithEmailAndPassword(email, password)
}

export const deleteCurrentUser = (): Promise<void> => {
  const user = auth.currentUser
  if (!user) {
    return Promise.reject('Cannot delete - user is not signed in')
  }
  return user.delete()
}

export const sendPasswordResetEmail = (email: string) => {
  return auth.sendPasswordResetEmail(email)
}
