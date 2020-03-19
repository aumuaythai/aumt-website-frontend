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
                            console.log('doc exists', docData)
                            const trainingForm = docData
                            trainingForm.sessions.forEach((session: any) => {
                                // remove current signup first
                                if (session.members.find((m: string) => m === userId)) {
                                    if (removeSignup) {
                                        session.members = session.members.filter((m: string) => m !== userId)
                                        console.log('new members', session.members)
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
                        return reject('Form does not exist')
                    })
                    .catch(reject)
            }
        })
    }
    public signUserUp = (userId: string, formId: string, sessionId: string): Promise<void> => {
        return new Promise((resolve, reject) => {
            if (this.db) {
                this.isMemberSignedUpToForm(userId, formId, true)
                    .then(() => {
                        if (this.db) {
                            this.db.collection('weekly_trainings')
                                .doc(formId)
                                .get()
                                .then((doc) => {
                                    const docData = doc.data()
                                    if (doc.exists && docData) {
                                        const trainingForm = docData
                                        const session = trainingForm.sessions.find((s: AumtTrainingSession) => s.sessionId === sessionId)
                                        if (session) {
                                            session.members.push(userId)
                                            this.db?.collection('weekly_trainings')
                                                .doc(formId)
                                                .set(trainingForm)
                                                .then(resolve)
                                        } else {
                                            return reject('No session found for session id')
                                        }
                                    } else {
                                        return reject('No form for specified form id')
                                    }
                                })
                                .catch(reject)
                        }
                    })
                    .catch(reject)
            }
        })
    }
}

export default new DB()