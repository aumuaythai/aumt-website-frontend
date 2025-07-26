import 'firebase/auth'
import 'firebase/database'

import firebase from 'firebase/app'

class FirebaseUtil {
  private firebaseConfig = {
    apiKey: import.meta.env.VITE_FB_API_KEY,
    authDomain: import.meta.env.VITE_FB_AUTH_DOMAIN,
    databaseURL: import.meta.env.VITE_FB_DATABASE_URL,
    projectId: import.meta.env.VITE_FB_PROJECT_ID,
    storageBucket: import.meta.env.VITE_FB_STORAGE_BUCKET,
    messagingSenderId: import.meta.env.VITE_FB_MESSAGING_SENDER_ID,
    appId: import.meta.env.VITE_FB_APP_ID,
    measurementId: import.meta.env.VITE_GA_MEASUREMENT_ID,
  }
  public initialize = (authStateChange: (a: firebase.User | null) => void) => {
    if (!firebase.apps.length) {
      firebase.initializeApp(this.firebaseConfig)
      firebase.auth().onAuthStateChanged(authStateChange)
    }
  }

  public signIn = (
    email: string,
    password: string
  ): Promise<firebase.auth.UserCredential> => {
    return firebase.auth().signInWithEmailAndPassword(email, password)
  }

  public getCurrentUser = (): firebase.User | null => {
    return firebase.auth().currentUser
  }

  public getCurrentUid = (): string | null => {
    const currentUser = this.getCurrentUser()
    return currentUser ? currentUser.uid : null
  }

  public createUser = (email: string, password: string) => {
    return firebase.auth().createUserWithEmailAndPassword(email, password)
  }

  public signOut = (): Promise<void> => {
    return firebase.auth().signOut()
  }

  public deleteCurrentUser = (): Promise<void> => {
    const user = firebase.auth().currentUser
    if (!user) {
      return Promise.reject('Cannot delete - user is not signed in')
    }
    return user.delete()
  }

  public sendPasswordResetEmail = (email: string) => {
    return firebase.auth().sendPasswordResetEmail(email)
  }
}
export default new FirebaseUtil()
