import { HttpsCallableResult } from '@firebase/functions-types'
import firebase from 'firebase/app'
import 'firebase/functions'

export const functions = firebase.functions()
// Uncomment if using emulator
// .useEmulator("localhost", 5001);

export function isAdmin(): Promise<HttpsCallableResult> {
  if (!this.functions) return Promise.reject('No db object')
  const call = this.functions.httpsCallable('checkUserIsAdmin')
  return call({})
}

export function removeUser(uid: string): Promise<HttpsCallableResult> {
  if (!this.functions) return Promise.reject('No db object')
  const call = this.functions.httpsCallable('removeUser')
  return call({ uid: uid })
}
