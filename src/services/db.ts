import * as firebase from 'firebase'
import { AumtMember, AumtWeeklyTraining, AumtTrainingSession, AumtEvent } from '../types';

type MockMember = {
    [uid: string]: {
        name: string,
        timeAdded: Date
    }
}
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

    public submitEvent = (eventData: AumtEvent): Promise<void> => {
        if (this.db) {
            return this.db.collection('events')
                .doc(eventData.id)
                .set(eventData)
        } else {
            return Promise.reject('No db object')
        }
    }

    public getAllEvents = (): Promise<AumtEvent[]> => {
        if (this.db) {
            return this.db.collection('events')
                .get()
                .then((querySnapshot) => {
                    const events: AumtEvent[] = []
                    querySnapshot.forEach((doc) => {
                        const docData = doc.data()
                        events.push({
                            ...docData,
                            date: new Date(docData.date.seconds * 1000)
                        } as AumtEvent)
                    })
                    return events
                })
        } else {
            return Promise.reject('No db object')
        }
    }

    public removeEvent = (eventId: string): Promise<void> => {
        if (this.db) {
            return this.db.collection('events')
                .doc(eventId)
                .delete()
        } else {
            return Promise.reject('No db object')
        }
    }

    public getAllForms = (): Promise<AumtWeeklyTraining[]> => {
        if (this.db) {
            return this.db.collection('weekly_trainings')
                .get()
                .then((querySnapshot) => {
                    const allForms: AumtWeeklyTraining[] = []
                    querySnapshot.forEach((doc) => {
                        const data = doc.data()
                        const form = this.docToForm(data)
                        allForms.push(form)
                    });
                    return allForms
                })
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
                                const weeklyTraining = this.docToForm(data)
                                trainings.push(weeklyTraining)
                            }
                        });
                        return trainings
                    })
        } else {
            return Promise.reject('No db object')
        }
    }

    public removeMemberFromForm = (userId: string, formId: string, sessionId: string): Promise<string> => {
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
                        const session = trainingForm.sessions.find(s => s.sessionId === sessionId)
                        if (session) {
                            delete session.members[userId]
                            if (this.db) {
                            return this.db.collection('weekly_trainings')
                                .doc(formId)
                                .set(trainingForm)
                                .then(() => {
                                    return session.sessionId
                                })
                            } else {
                                throw new Error('No db object')
                            }
                        } else {
                            throw new Error('No session id on form, aborting')
                        }
                    } else {
                        throw new Error('No training form for formid found, aborting')
                    }
                })
        } else {
            return Promise.reject('No db object')
        }
    }

    public moveMember = (userId: string, displayName: string, formId: string, fromSessionId: string, toSessionId: string): Promise<string> => {
        if (this.db) {
            return this.signUserUp(userId, displayName, formId, toSessionId, '')
                .then(() => {
                    return this.removeMemberFromForm(userId,formId,fromSessionId)
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
                                    if (!removeSignup) {
                                        return session.sessionId
                                    } else {
                                        return this.removeMemberFromForm(userId, formId, session.sessionId)
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
    public signUserUp = (userId: string, displayName: string, formId: string, sessionId: string, feedback: string): Promise<void> => {
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
                        session.members[userId] = {
                            name: displayName,
                            timeAdded: new Date()
                        }
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

    signMockData = () => {
        if (this.db) {
            return this.db.collection('members')
                .get()
                .then((querySnapshot) => {
                    const uids: MockMember[] = []
                    querySnapshot.forEach((doc) => {
                        const data = doc.data()
                        uids.push({
                            [doc.id]: {
                                name: (data as AumtMember).firstName,
                                timeAdded: this.getRandomDate(new Date(2020, 3, 5), new Date())
                            }
                        })
                    })
                    return uids
                })
                .then((uids: MockMember[]) => {
                    return this.getAllForms()
                        .then((forms: AumtWeeklyTraining[]) => {
                            const form = forms[0]
                            if (!form) throw new Error('NO FORM')
                            form.sessions.forEach((session) => {
                                const randLimit = Math.floor(Math.random() * 15 + 16)
                                for (let i = 0; i < randLimit; i ++) {
                                    if (!uids.length || Object.keys(session.members).length > session.limit) {
                                        return
                                    }
                                    const randIndex = Math.floor(Math.random() * uids.length)
                                    const memberI = uids[randIndex]
                                    uids.splice(randIndex, 1)
                                    const uid = Object.keys(memberI)[0]
                                    session.members[uid] = memberI[uid]
                                }
                            })
                            return form
                        })
                        .then((form: AumtWeeklyTraining) => {
                            this.submitNewForm(form)
                        })
                })
        } else {
            return Promise.reject('No db object')
        }
    }
    
    private getRandomDate = (start: Date, end: Date) => {
        return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
    }

    private docToForm = (docData: any): AumtWeeklyTraining => {
        const docSessions = docData.sessions.map((session: any) => {
            Object.keys(session.members).forEach((i) => {
                session.members[i].timeAdded = new Date(session.members[i].timeAdded.seconds)
            })
            return session
        })
        const weeklyTraining: AumtWeeklyTraining = {
            title: docData.title,
            feedback: docData.feedback,
            trainingId: docData.trainingId,
            sessions: docSessions,
            opens: new Date(docData.opens.seconds * 1000),
            closes: new Date(docData.closes.seconds * 1000),
            notes: docData.notes.split('%%NEWLINE%%').join('\n')
        }
        return weeklyTraining
    }
}

export default new DB()
