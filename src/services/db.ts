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
        if (this.db) {
            return this.db.collection('members')
                .doc(fbUser.uid)
                .get()
                .then((doc) => {
                    const docData = doc.data()
                    if (doc.exists && docData) {
                        return docData as AumtMember
                    } else {
                        throw new Error('No user exists for user id' + fbUser.uid)
                    }
                })
        } else {
            return Promise.reject('No db object')
        }
    }

    public getIsAdmin = (userId: string): Promise<boolean> => {
        if (this.db) {
            return this.db.collection('admin').doc(userId).get()
                .then((doc) => {
                    return !!doc.exists
                })
        } else {
            return Promise.reject('No db object')
        }
    }

    public submitNewForm = (formData: AumtWeeklyTraining): Promise<void> => {
        if (this.db) {
            return this.db.collection('weekly_trainings')
                .doc(formData.trainingId)
                .set(formData)
        } else {
            return Promise.reject('No db object')
        }
    }

    public getOpenForms = (): Promise<AumtWeeklyTraining[]> => {
            if (this.db) {
                const currentDate = new Date()
                return this.db.collection('weekly_trainings')
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
                                    feedback: data.feedback,
                                    trainingId: data.trainingId,
                                    sessions: data.sessions,
                                    opens: new Date(data.opens.seconds * 1000),
                                    closes: new Date(data.closes.seconds * 1000),
                                    notes: data.notes.split('%%NEWLINE%%').join('\n')
                                }
                                trainings.push(weeklyTraining)
                            }
                        });
                        return trainings
                    })
        } else {
            return Promise.reject('No db object')
        }
    }

    public isMemberSignedUpToForm = (userId: string, formId: string, removeSignup?: boolean): Promise<string> => {
            if (this.db) {
                return this.db.collection('weekly_trainings')
                    .doc(formId)
                    .get()
                    .then((doc) => {
                        const docData = doc.data()
                        if (doc.exists && docData) {
                            return docData as AumtWeeklyTraining
                        }
                        throw new Error('Form does not exist')
                    })
                    .then((trainingForm: AumtWeeklyTraining) => {
                        if (trainingForm) {
                            for (const session of trainingForm.sessions) {
                                if (userId in session.members) {
                                    if (removeSignup) {
                                        delete session.members[userId]
                                        if (this.db) {
                                            return this.db.collection('weekly_trainings')
                                                .doc(formId)
                                                .set(trainingForm)
                                                .then(() => {
                                                    return session.sessionId
                                                })
                                        } else {
                                            return Promise.reject('No db object')
                                        }
                                    } else {
                                        return session.sessionId
                                    }
                                }
                            }
                            return ''
                        } else {
                            throw new Error('Form does not exist')
                        }
                    })
            } else {
                return Promise.reject('No db object')
            }
    }
    public signUserUp = (userId: string, userData: AumtMember, formId: string, sessionId: string, feedback: string): Promise<void> => {
        if (this.db) {
            return this.isMemberSignedUpToForm(userId, formId, true)
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
                        session.members[userId] = userData.displayName.split(' ').join(userData.preferredName ? ` "${userData.preferredName}" ` : ' ')
                        return this.db?.collection('weekly_trainings')
                            .doc(formId)
                            .set(trainingForm)
                    } else {
                        throw new Error('No session found for session id')
                    }
                })
                .then(() => {
                    if (feedback) {
                        return this.db?.collection('weekly_trainings')
                            .doc(formId)
                            .update({
                                feedback: firebase.firestore.FieldValue.arrayUnion(feedback)
                            })
                    }
                })
        } else {
            return Promise.reject('No db object')
        }
    }
}

export default new DB()