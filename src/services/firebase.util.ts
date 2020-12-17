import 'firebase/auth';
import 'firebase/database'

import firebase from "firebase/app";


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
    public initialize = (authStateChange: (a: firebase.User | null) => void) => {
        if (!firebase.apps.length) {
            firebase.initializeApp(this.firebaseConfig);
            firebase.auth().onAuthStateChanged(authStateChange)
        }
    }

    public signIn = (email: string, password: string): Promise<firebase.auth.UserCredential> => {
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