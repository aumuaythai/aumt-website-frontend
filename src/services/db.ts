import * as firebase from 'firebase/app'
import 'firebase/firestore'
import { AumtMember, AumtWeeklyTraining, AumtTrainingSession, AumtEvent, AumtMembersObj, ClubConfig, AumtEventSignupData, AumtCommitteeApp } from '../types';
import validator from './validator';

type MockMember = {
    [uid: string]: {
        name: string,
        timeAdded: Date
    }
}
class DB {
    private db: firebase.firestore.Firestore |  null = null;
    private listeners: Record<string, Function> = {}

    public initialize = () => {
        if (!this.db) {
            this.db = firebase.firestore()
        }
    }

    public getUserInfo = (fbUser: firebase.User): Promise<AumtMember> => {
        if (!this.db) return Promise.reject('No db object')
        return this.db.collection('members')
            .doc(fbUser.uid)
            .get()
            .then((doc) => {
                const docData = doc.data()
                if (doc.exists && docData) {
                    try {
                        const member = this.docToMember(docData)
                        return member
                    } catch (e) {
                        throw e
                    }
                } else {
                    throw new Error('No AUMT member exists for this acccount ' + fbUser.uid)
                }
            })
    }

    public getIsAdmin = (userId: string): Promise<boolean> => {
        if (!this.db) return Promise.reject('No db object')
        return this.db.collection('admin').doc(userId).get()
            .then((doc) => {
                return !!doc.exists
            })
    }

    public setEmailVerified = (userId: string, emailVerified: boolean): Promise<void> => {
        if (!this.db) return Promise.reject('No db object')
        return this.db.collection('members')
            .doc(userId)
            .update({emailVerified})
    }

    public getClubConfig = (): Promise<ClubConfig> => {
        if (!this.db) return Promise.reject('No db object')
        return this.db
            .collection('config')
            .doc('config')
            .get()
            .then((doc) => {
                const data: any = doc.data()
                return {
                    clubSignupStatus: data.clubSignupStatus,
                    clubSignupSem: data.clubSignupSem
                }
            })
    }

    public setClubJoinForm = (open: boolean): Promise<void> => {
        if (!this.db) return Promise.reject('No db object')
        return this.db
            .collection('config')
            .doc('config')
            .update({
                clubSignupStatus: open ? 'open' : 'closed'
            })
    }

    public setClubSignupSem = (sem: 'S1' | 'S2'): Promise<void> => {
        if (!this.db) return Promise.reject('No db object')
        return this.db
            .collection('config')
            .doc('config')
            .update({
                clubSignupSem: sem
            })
    }

    public getAllMembers = (): Promise<AumtMembersObj> => {
        if (!this.db) return Promise.reject('No db object')
        return this.db.collection('members').get()
            .then((querySnapshot) => {
                const members: AumtMembersObj = {}
                querySnapshot.forEach((doc) => {
                    const data = doc.data()
                    try {
                        members[doc.id] = this.docToMember(data)
                    } catch (e) {
                        console.warn(e)
                    }
                })
                return members
            })
    }

    public getS22020UnverifiedMembers = (): Promise<AumtMembersObj> => {
        if (!this.db) return Promise.reject('No db object')
        return this.db.collection('members')
            .where('membership', 'in', ['FY', 'S2'])
            .where('emailVerified', '==', false)
            .get()
            .then((querySnapshot) => {
                const members: AumtMembersObj = {}
                querySnapshot.forEach((doc) => {
                    const data = doc.data()
                    try {
                        const member = this.docToMember(data)
                        members[doc.id] = member
                    } catch (e) {
                        console.warn(e)
                    }
                })
                return members
            })

    }

    public submitCommitteeApplication = (app: AumtCommitteeApp): Promise<void> => {
        if (!this.db) return Promise.reject('No db object')
        return this.db.collection('committee-apps')
            .doc(this.getListenerId())
            .set(app)
    }

    public getCommitteeApplications = (): Promise<AumtCommitteeApp[]> => {
        if (!this.db) return Promise.reject('No db object')
        return this.db.collection('committee-apps')
            .get()
            .then((querySnapshot) => {
                const apps: AumtCommitteeApp[] = []
                querySnapshot.forEach((doc) => {
                    apps.push(doc.data() as AumtCommitteeApp)
                })
                return apps.sort((a, b) => a.timestampMs - b.timestampMs)
            })
    }

    public submitNewForm = (formData: AumtWeeklyTraining): Promise<void> => {
        if (!this.db) return Promise.reject('No db object')
        if (!formData) {
            return Promise.reject('No form data submitted')
        }
        return this.db.collection('weekly_trainings')
            .doc(formData.trainingId)
            .set(formData)
    }

    public submitEvent = (eventData: AumtEvent): Promise<void> => {
        if (!this.db) return Promise.reject('No db object')
        return this.db.collection('events')
            .doc(eventData.id)
            .set(eventData)
    }

    public signUpToEvent = (eventId: string, uid: string, signupData: AumtEventSignupData, waitlist?: boolean) => {
        if (!this.db) return Promise.reject('No db object')
        return this.db.collection('events')
            .doc(eventId)
            .set({
                signups: {
                    [waitlist ? 'waitlist' : 'members']: {
                        [uid]: signupData
                    }
                }
            }, {merge: true})
    }

    public confirmMemberEventSignup = (eventId: string, uid: string, confirmed: boolean, waitlist?: boolean) => {
        if (!this.db) return Promise.reject('No db object')
        return this.db.collection('events')
            .doc(eventId)
            .set({
                signups: {
                    [waitlist ? 'waitlist' : 'members']: {
                        [uid]: {
                            confirmed
                        }
                    }
                }
            }, {merge: true})
    }

    public removeMemberFromEvent = (uid: string, eventId: string, waitlist?: boolean) => {
        if (!this.db) return Promise.reject('No db object')
        return this.db.collection('events')
            .doc(eventId)
            .set({
                signups: {
                    [waitlist ? 'waitlist' : 'members']: {
                        [uid]: firebase.firestore.FieldValue.delete()
                    }
                }
            }, {merge: true})
    }

    public getAllEvents = (): Promise<AumtEvent[]> => {
        if (!this.db) return Promise.reject('No db object')
        return this.db.collection('events')
            .get()
            .then((querySnapshot) => {
                const events: AumtEvent[] = []
                querySnapshot.forEach((doc) => {
                    const docData = doc.data()
                    const event = this.docToEvent(docData)
                    events.push(event)
                })
                return events
            })
    }

    public getEventById = (id: string): Promise<AumtEvent> => {
        if (!this.db) return Promise.reject('No db object')
        return this.db.collection('events')
            .doc(id)
            .get()
            .then((doc) => {
                if (!doc.exists) {
                    return Promise.reject('No event found')
                }
                return this.docToEvent(doc.data())
            })
    }

    public removeEvent = (eventId: string): Promise<void> => {
        if (!this.db) return Promise.reject('No db object')
        return this.db.collection('events')
            .doc(eventId)
            .delete()
    }

    public removeTraining = (trainingId: string): Promise<void> => {
        if (!this.db) return Promise.reject('No db object')
        return this.db.collection('weekly_trainings')
            .doc(trainingId)
            .delete()
    }

    public getAllForms = (): Promise<AumtWeeklyTraining[]> => {
        if (!this.db) return Promise.reject('No db object')
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
    }

    public updatePaid = (memberId: string, newPaid: 'Yes' | 'No'): Promise<void> => {
        if (!this.db) return Promise.reject('No db object')
        return this.db.collection('members')
            .doc(memberId)
            .update({paid: newPaid})
    }

    public updateMembership = (memberId: string, newMembership: 'S1' | 'S2' | 'FY'): Promise<void> => {
        if (!this.db) return Promise.reject('No db object')
        return this.db.collection('members')
            .doc(memberId)
            .update({membership: newMembership})
    }

    public getOpenForms = (): Promise<AumtWeeklyTraining[]> => {
            if (!this.db) return Promise.reject('No db object')
            const currentDate = new Date()
            return this.db.collection('weekly_trainings')
                .where('closes', '>=', currentDate)
                .get()
                .then((querySnapshot) => {
                    const trainings: AumtWeeklyTraining[] = []
                    querySnapshot.forEach((doc) => {
                        const data = doc.data()
                        // can't do where('opens', '<', currentDate) in firestore db so have to here
                        if (data.opens.seconds * 1000 <= currentDate.getTime()) {
                            const weeklyTraining = this.docToForm(data)
                            trainings.push(weeklyTraining)
                        }
                    })
                    return trainings
                })
    }

    public setMember = (memberId: string, memberData: AumtMember): Promise<void> => {
        if (!this.db) return Promise.reject('No db object') 
        return this.db.collection('members')
            .doc(memberId)
            .set(memberData)
    }

    public addMultipleMembers = (members: Record<string, AumtMember>): Promise<void> => {
        if (!this.db) return Promise.reject('No db object')
        const batch = this.db.batch()
        const memberCollection = this.db.collection('members')
        Object.keys(members).forEach((key: string) => {
            const docRef = memberCollection.doc(key)
            batch.set(docRef, members[key])
        })
        return batch.commit()
    }

    public removeMultipleMembers = (memberIds: string[]): Promise<void> => {
        if (!this.db) return Promise.reject('No db object')
        const batch = this.db.batch()
        memberIds.forEach((id) => {
            const doc = this.db!.collection('members')
                .doc(id)
            batch.delete(doc)
        })
        return batch.commit()
    }

    public removeMember = (memberId: string): Promise<void> => {
        if (!this.db) return Promise.reject('No db object')
        return this.db.collection('members')
            .doc(memberId)
            .delete()
    }

    public getTrainingData = (formId: string): Promise<AumtWeeklyTraining> => {
        if (!this.db) return Promise.reject('No db object')
        return this.db.collection('weekly_trainings')
            .doc(formId)
            .get()
            .then((doc) => {
                const docData = doc.data()
                if (doc.exists && docData) {
                    return this.docToForm(docData)
                }
                throw new Error('Form does not exist')
            })
    }

    public removeMemberFromForm = (userId: string, formId: string, sessionId: string): Promise<string> => {
        if (!this.db) return Promise.reject('No db object')
        return this.getTrainingData(formId)
            .then((trainingForm: AumtWeeklyTraining) => {
                if (trainingForm) {
                    const session = trainingForm.sessions.find(s => s.sessionId === sessionId)
                    if (session) {
                        delete session.members[userId]
                        if (!this.db) {
                            throw new Error('No db object')
                        }
                        return this.db.collection('weekly_trainings')
                            .doc(formId)
                            .set(trainingForm)
                            .then(() => {
                                return session.sessionId
                            })
                    } else {
                        throw new Error('No session id on form, aborting')
                    }
                } else {
                    throw new Error('No training form for formid found, aborting')
                }
            })
    }

    public moveMember = (userId: string, displayName: string, timeAdded: Date,formId: string, fromSessionId: string, toSessionId: string): Promise<string> => {
        if (!this.db) return Promise.reject('No db object')
        return this.signUserUp(userId, displayName, timeAdded, formId, toSessionId, '')
            .then(() => {
                return this.removeMemberFromForm(userId,formId,fromSessionId)
            })
    }

    public isMemberSignedUpToForm = (userId: string, formId: string, removeSignup?: boolean): Promise<string> => {
            if (!this.db) {
                return Promise.reject('No db object')
            }
            return this.getTrainingData(formId)
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
    }
    public signUserUp = (userId: string, displayName: string, timeAdded: Date, formId: string, sessionId: string, feedback: string): Promise<void> => {
        if (!this.db) return Promise.reject('No db object')
        return this.isMemberSignedUpToForm(userId, formId, true)
            .then(() => this.getTrainingData(formId))
            .then((trainingForm: AumtWeeklyTraining) => {
                const session = trainingForm.sessions.find((s: AumtTrainingSession) => s.sessionId === sessionId)
                if (session) {
                    session.members[userId] = {
                        name: displayName,
                        timeAdded: timeAdded
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
    }

    public formatMembers = () => {
        if (!this.db) return Promise.reject('No db object')
        // const experiences = ['Cash', 'Bank Transfer']
        return this.db.collection('events')
            .get()
            .then((querySnapshot) => {
                querySnapshot.forEach((doc) => {
                    if (doc.data().signups) {
                        console.log(doc.data())
                        doc.ref.set({
                            signups: {
                                isCamp: false
                            }
                            // timeJoined: firebase.firestore.FieldValue.delete()
                        }, {merge: true})
                    }
                })
            })
    }

    public signMockData = () => {
        if (!this.db) return Promise.reject('No db object')
        return this.db.collection('members')
            .get()
            .then((querySnapshot) => {
                const uids: MockMember[] = []
                querySnapshot.forEach((doc) => {
                    const data = doc.data()
                    uids.push({
                        [doc.id]: {
                            name: data.firstName + (data.preferredName ? ` "${data.preferredName}" ` : ' ') + data.lastName,
                            timeAdded: this.getRandomDate(new Date(2020, 4, 10), new Date(2020, 4, 14))
                        }
                    })
                })
                return uids
            })
            .then((uids: MockMember[]) => {
                return this.getAllForms()
                    .then((forms: AumtWeeklyTraining[]) => {
                        const form = forms.find(f => f.title.indexOf('Week 11') > -1)
                        if (!form) throw new Error('NO FORM')
                        form.sessions = form.sessions.map((session) => {
                            const randLimit = Math.floor(Math.random() * 15 + 16)
                            for (let i = 0; i < randLimit; i ++) {
                                if (!uids.length || Object.keys(session.members).length >= session.limit) {
                                    break
                                }
                                const randIndex = Math.floor(Math.random() * uids.length)
                                const memberI = uids[randIndex]
                                uids.splice(randIndex, 1)
                                const uid = Object.keys(memberI)[0]
                                session.members[uid] = Object.assign({}, memberI[uid])
                            }
                            return session
                        })
                        return form
                    })
                    .then((form: AumtWeeklyTraining) => {
                        this.submitNewForm(form)
                    })
            })
    }

    public listenToOneTraining = (formId: string, callback: (formId: string, training: AumtWeeklyTraining) => void): string => {
        if (!this.db) throw new Error('no db')
        const listenerId = this.getListenerId()
        this.listeners[listenerId] = this.db.collection('weekly_trainings')
            .doc(formId)
            .onSnapshot((doc: firebase.firestore.DocumentSnapshot) => {
                callback(formId, this.docToForm(doc.data()))
            })
        return listenerId
    }

    public listenToTrainings = (callback: (forms: AumtWeeklyTraining[]) => void): string => {
        if (!this.db) throw new Error('no db')
        const listenerId = this.getListenerId()
        this.listeners[listenerId] = this.db.collection('weekly_trainings')
            .onSnapshot((querySnapshot) => {
                const newForms: AumtWeeklyTraining[] = []
                querySnapshot.docs.forEach((doc) => {
                    newForms.push(this.docToForm(doc.data()))
                })
                callback(newForms)
            })
        return listenerId
    }

    public listenToEvents = (callback: (events: AumtEvent[]) => void, errorCallback: (message: string) => void): string => {
        if (!this.db) throw new Error('no db')
        const listenerId = this.getListenerId()
        this.listeners[listenerId] = this.db.collection('events')
            .onSnapshot((querySnapshot) => {
                const newEvents: AumtEvent[] = []
                querySnapshot.docs.forEach((doc) => {
                    try {
                        const event = this.docToEvent(doc.data())
                        newEvents.push(event)
                    } catch (err) {
                        if (errorCallback ) {
                            errorCallback(`Excluding event because ${err.toString()}`)
                        }
                    }
                })
                callback(newEvents)
            })
        return listenerId
    }

    public listenToMembers = (callback: (members: AumtMembersObj) => void): string => {
        if (!this.db) throw new Error('No db')
        const listenerId = this.getListenerId()
        this.listeners[listenerId] = this.db.collection('members')
            .onSnapshot((querySnapshot) => {
                const members: AumtMembersObj = {}
                querySnapshot.forEach((doc) => {
                    const data = doc.data()
                    try {
                        members[doc.id] = this.docToMember(data)
                    } catch (e) {
                        console.warn(e)
                    }
                })
                callback(members)
            })
        return listenerId
    }

    public unlisten = (listenerId: string) => {
        if (this.listeners[listenerId]) {
            this.listeners[listenerId]()
            delete this.listeners[listenerId]
        }
    }
    
    private getRandomDate = (start: Date, end: Date) => {
        return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
    }

    private getListenerId = () => {
        const chars = 'weyuiopasdhjklzxcvbnm1234567890'
        let id = ''
        for (let i = 0; i < 10; i ++) {
            id += chars[Math.floor(Math.random() * chars.length)]
        }
        return id
    }

    private docToForm = (docData: any): AumtWeeklyTraining => {
        if (!Array.isArray(docData.sessions)) {
            throw new Error('Outdated website, refresh page please')
        }
        const docSessions = docData.sessions.map((session: any) => {
            Object.keys(session.members).forEach((i) => {
                session.members[i].timeAdded = new Date(session.members[i].timeAdded.seconds * 1000)
            })
            return session
        })
        const weeklyTraining: AumtWeeklyTraining = {
            title: docData.title,
            feedback: docData.feedback,
            trainingId: docData.trainingId,
            sessions: docSessions,
            openToPublic: docData.openToPublic || false,
            opens: new Date(docData.opens.seconds * 1000),
            closes: new Date(docData.closes.seconds * 1000),
            notes: docData.notes.split('%%NEWLINE%%').join('\n')
        }
        return weeklyTraining
    }

    private docToMember = (docData: any): AumtMember => {
        const member = validator.createAumtMember(docData)
        if (typeof(member) === 'string') {
            throw new Error(`Could not read member. Reason: ${member}, Data: ${JSON.stringify(docData)}`)
        }
        return member
    }

    private docToEvent = (docData: any): AumtEvent => {
        if (!docData.date) {
            throw new Error('No date on event: ' + JSON.stringify(docData))
        }
        const event: AumtEvent = {
            ...docData,
            date: new Date(docData.date.seconds * 1000),
            signups: docData.signups ? {
                ...docData.signups,
                opens: new Date(docData.signups.opens.seconds * 1000)
            } : null
        }
        return event
    }
}

export default new DB()
