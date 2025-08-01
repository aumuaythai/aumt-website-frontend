import 'firebase/analytics'
import firebase from 'firebase/app'
import 'firebase/auth'
import 'firebase/database'
import 'firebase/firestore'
import 'firebase/functions'

const FIREBASE_CONFIG = {
  apiKey: import.meta.env.VITE_FB_API_KEY,
  authDomain: import.meta.env.VITE_FB_AUTH_DOMAIN,
  databaseURL: import.meta.env.VITE_FB_DATABASE_URL,
  projectId: import.meta.env.VITE_FB_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FB_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FB_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FB_APP_ID,
  measurementId: import.meta.env.VITE_GA_MEASUREMENT_ID,
}

firebase.initializeApp(FIREBASE_CONFIG)
export const auth = firebase.auth()
export const functions = firebase.functions()
export const db = firebase.firestore()
export const analytics = firebase.analytics()
