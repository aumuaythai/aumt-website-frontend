import * as firebase from 'firebase'
import { AumtMember, AumtWeeklyTraining, AumtTrainingSession } from '../types';
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
                        reject(err)
                    })
            }
        })
    }

    public submitNewForm = (formData: AumtWeeklyTraining): Promise<void> => {
        return new Promise((resolve, reject) => {
            if (this.db) {
                this.db.collection('weekly_trainings')
                    .doc(formData.trainingId)
                    .set(formData)
                    .then(resolve)
                    .catch(reject)
            }
        })
    }

    public getOpenForms = (): Promise<AumtWeeklyTraining[]> => {
        return new Promise((resolve, reject) => {
            if (this.db) {
                const currentDate = new Date()
                this.db.collection('weekly_trainings')
                    .where('opens', '<=', currentDate)
                    .get()
                    .then((querySnapshot) => {
                        const trainings: AumtWeeklyTraining[] = []
                        querySnapshot.forEach((doc) => {
                            const data = doc.data()
                            // can't do where('closes', '>', currentDate) in firestore db so have to here
                            if (data.closes.seconds * 1000 >= currentDate.getTime()) {
                                const weeklyTraining: AumtWeeklyTraining = {
                                    title: data.title,
                                    trainingId: data.trainingId,
                                    sessions: data.sessions,
                                    opens: new Date(data.opens.seconds * 1000),
                                    closes: new Date(data.closes.seconds * 1000),
                                    notes: data.notes.split('%%NEWLINE%%').join('\n')
                                }
                                trainings.push(weeklyTraining)
                            }
                        });
                        resolve(trainings)
                }).catch(reject)
            }
        })
    }

    public isMemberSignedUpToForm = (userId: string, formId: string, removeSignup?: boolean): Promise<string> => {
        return new Promise((resolve, reject) => {
            if (this.db) {
                this.db.collection('weekly_trainings')
                    .doc(formId)
                    .get()
                    .then((doc) => {
                        const docData = doc.data()
                        if (doc.exists && docData) {
                            return docData
                        }
                        throw new Error('Form does not exist')
                    })
                    .then((trainingForm) => {
                        if (trainingForm) {
                            trainingForm.sessions.forEach((session: AumtTrainingSession) => {
                                if (userId in session.members) {
                                    if (removeSignup) {
                                        delete session.members[userId]
                                        this.db?.collection('weekly_trainings')
                                            .doc(formId)
                                            .set(trainingForm)
                                            .then(() => {
                                                return resolve(session.sessionId)
                                            })
                                            .catch(reject)
                                            
                                    } else {
                                        return resolve(session.sessionId)
                                    }
                                }
                            })
                            return resolve('')
                        }
                    })
                    .catch(reject)
            }
        })
    }
    public signUserUp = (userId: string, userData: AumtMember, formId: string, sessionId: string): Promise<void> => {
        return new Promise((resolve, reject) => {
            if (this.db) {
                this.isMemberSignedUpToForm(userId, formId, true)
                    .then(() => {
                        if (this.db) {
                            return this.db.collection('weekly_trainings')
                                .doc(formId)
                                .get()
                        } else {
                            throw new Error('no db object to make request to')
                        }
                    })
                    .then((doc) => {
                        const docData = doc.data()
                        if (doc.exists && docData) {
                            return docData as AumtWeeklyTraining
                        } else {
                            throw new Error('No form for specified form id')
                        }
                    })
                    .then((trainingForm: AumtWeeklyTraining) => {
                        const session = trainingForm.sessions.find((s: AumtTrainingSession) => s.sessionId === sessionId)
                        if (session) {
                            session.members[userId] = userData
                            return this.db?.collection('weekly_trainings')
                                .doc(formId)
                                .set(trainingForm)
                        } else {
                            throw new Error('No session found for session id')
                        }
                    })
                    .then(resolve)
                    .catch(reject)
            }
        })
    }
}

export default new DB()