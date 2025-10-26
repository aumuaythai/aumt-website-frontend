import { HttpsCallableResult } from '@firebase/functions-types'
import 'firebase/functions'
import { functions } from './firebase'

// Uncomment if using emulator
// .useEmulator("localhost", 5001);

export function isAdmin(): Promise<HttpsCallableResult> {
  if (!functions) return Promise.reject('No db object')
  const call = functions.httpsCallable('checkUserIsAdmin')
  return call({})
}

export function removeUser(uid: string): Promise<HttpsCallableResult> {
  if (!functions) return Promise.reject('No db object')
  const call = functions.httpsCallable('removeUser')
  return call({ uid: uid })
}
