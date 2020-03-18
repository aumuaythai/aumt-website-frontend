import * as firebase from 'firebase'
import { AumtMember, AumtWeeklyTraining } from '../types';
class DB {
    private db: firebase.firestore.Firestore |  null = null;

    public initialize = () => {
        if (!this.db) {
            this.db = firebase.firestore()

        }
    }

    public getUserInfo = (fbUser: firebase.User): Promise<AumtMember> => {
        return new Promise((resolve, reject) => {
            if (this.db) {
                this.db.collection('members').doc(fbUser.uid).get()
                    .then((doc) => {
                        if (doc.exists) {
                            const docData: any = doc.data()
                            resolve(docData)
                        } else {
                            console.log('No User exists for uid ', fbUser.uid)
                            reject('No User for uid')
                        }
                    })
                    .catch((err) => {
                        console.log('error getting user by uid', err)
                        reject(err)
                    })
            }
        })
    }

    public getIsAdmin = (userId: string): Promise<boolean> => {
        return new Promise((resolve, reject) => {
            if (this.db) {
                this.db.collection('admin').doc(userId).get()
                    .then((doc) => {
                        resolve(doc.exists)
                    })
                    .catch((err) => {
                        console.log('error getting isadmin', err)
                    })
            }
        })
    }

    public submitNewForm = (formData: AumtWeeklyTraining): Promise<void> => {
        return new Promise((resolve, reject) => {
            console.log(formData)
            setTimeout(resolve, 2000)
        })
    }
}

export default new DB()