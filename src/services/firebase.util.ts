import 'firebase/auth';
import 'firebase/database'
import 'firebase/analytics'

import * as firebase from "firebase/app";
import { User } from 'firebase/app'

export class AnalyticEvents {
    public static FIREBASE_JOIN_PAGE_VISITED = 'firebase_join_page_visited'
    public static FIREBASE_EVENTS_PAGE_VISITED = 'firebase_events_page_visited'
    public static FIREBASE_FIRST_TIME_LOGIN = 'firebase_first_time_login'
    public static FIREBASE_SEM_2_CONFIRMATION = 'firebase_sem_2_confirmation'
}


class FirebaseUtil {
    private firebaseConfig = {
        apiKey: process.env.REACT_APP_FB_API_KEY,
        authDomain: process.env.REACT_APP_FB_AUTH_DOMAIN,
        databaseURL: process.env.REACT_APP_FB_DATABASE_URL,
        projectId: process.env.REACT_APP_FB_PROJECT_ID,
        storageBucket: process.env.REACT_APP_FB_STORAGE_BUCKET,
        messagingSenderId: process.env.REACT_APP_FB_MESSAGING_SENDER_ID,
        appId: process.env.REACT_APP_FB_APP_ID,
        measurementId: process.env.REACT_APP_FB_MEASUREMENT_ID
    }
    public initialize = (authStateChange: (a: User | null) => void) => {
        if (!firebase.apps.length) {
            firebase.initializeApp(this.firebaseConfig);
            firebase.auth().onAuthStateChanged(authStateChange)
            firebase.analytics()
        }
    }

    public signIn = (email: string, password: string): Promise<firebase.auth.UserCredential> => {
        return firebase.auth().signInWithEmailAndPassword(email, password)
    }

    public getCurrentUser = (): User | null => {
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

    public sendAnalytics = (type: string) => {
        try {
            firebase.analytics().logEvent(type)
        } catch (err) {
            console.error(err)
        }
    }
}
export default new FirebaseUtil()