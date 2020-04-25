import 'firebase/auth';
import 'firebase/database'

import * as firebase from "firebase/app";
import { User } from 'firebase/app'


class FirebaseUtil {
    private firebaseConfig = {
        apiKey: process.env.REACT_APP_FB_API_KEY,
        authDomain: process.env.REACT_APP_FB_AUTH_DOMAIN,
        databaseURL: process.env.REACT_APP_FB_DATABASE_URL,
        projectId: process.env.REACT_APP_FB_PROJECT_ID,
        storageBucket: process.env.REACT_APP_FB_STORAGE_BUCKET,
        messagingSenderId: process.env.REACT_APP_FB_MESSAGING_SENDER_ID,
        appId: process.env.REACT_APP_FB_APP_ID
    }
    public initialize = (authStateChange: (a: User | null) => void) => {
        if (!firebase.apps.length) {
            firebase.initializeApp(this.firebaseConfig);
            firebase.auth().onAuthStateChanged(authStateChange)
        }
    }

    public signIn = (email: string, password: string) => {
        return firebase.auth().signInWithEmailAndPassword(email, password)
    }

    public getCurrentUser = () => {
        return firebase.auth().currentUser
    }

    public createUser = (email: string, password: string) => {
        return firebase.auth().createUserWithEmailAndPassword(email, password)
    }

    public signOut = () => {
        return firebase.auth().signOut()
    }

    public sendPasswordResetEmail = (email: string) => {
        return firebase.auth().sendPasswordResetEmail(email)
    }
}
export default new FirebaseUtil()