import firebase from 'firebase/app'
import {
  AumtCommitteeApp,
  AumtEvent,
  AumtEventSignupData,
  AumtMember,
  AumtMembersObj,
  AumtTrainingSession,
  AumtWeeklyTraining,
  ClubConfig,
} from '../types'
import { db } from './firebase'
import validator from './validator'

const TRAINING_DB_PATH = 'weekly_trainings'
const TRAINING_ATTENDANCE_DB_PATH = 'training_attendance'
const MEMBER_DB_PATH = 'members'

const listeners: Record<string, Function> = {}

export const getUserInfo = (fbUser: firebase.User): Promise<AumtMember> => {
  if (!db) return Promise.reject('No db object')
  return db
    .collection(MEMBER_DB_PATH)
    .doc(fbUser.uid)
    .get()
    .then((doc) => {
      const docData = doc.data()
      if (doc.exists && docData) {
        try {
          const member = docToMember(docData)
          return member
        } catch (e) {
          throw e
        }
      } else {
        throw new Error('No AUMT member exists for this acccount ' + fbUser.uid)
      }
    })
}

export const getIsAdmin = (userId: string): Promise<boolean> => {
  if (!db) return Promise.reject('No db object')
  return db
    .collection('admin')
    .doc(userId)
    .get()
    .then((doc) => {
      return !!doc.exists
    })
}

export const setEmailVerified = (
  userId: string,
  emailVerified: boolean
): Promise<void> => {
  if (!db) return Promise.reject('No db object')
  return db.collection(MEMBER_DB_PATH).doc(userId).update({ emailVerified })
}

export const getClubConfig = (): Promise<ClubConfig> => {
  if (!db) return Promise.reject('No db object')
  return db
    .collection('config')
    .doc('config')
    .get()
    .then((doc) => {
      const data: any = doc.data()
      return { ...data }
    })
}

export const setClubConfig = (config: ClubConfig): Promise<void> => {
  if (!db) return Promise.reject('No db object')
  return db.collection('config').doc('config').set(config)
}

export const setClubJoinForm = (open: boolean): Promise<void> => {
  if (!db) return Promise.reject('No db object')
  return db
    .collection('config')
    .doc('config')
    .update({
      clubSignupStatus: open ? 'open' : 'closed',
    })
}

export const setClubSignupSem = (sem: 'S1' | 'S2' | 'SS'): Promise<void> => {
  if (!db) return Promise.reject('No db object')
  return db.collection('config').doc('config').update({
    clubSignupSem: sem,
  })
}

export const getAllMembers = (): Promise<AumtMembersObj> => {
  if (!db) return Promise.reject('No db object')
  return db
    .collection(MEMBER_DB_PATH)
    .get()
    .then((querySnapshot) => {
      const members: AumtMembersObj = {}
      querySnapshot.forEach((doc) => {
        const data = doc.data()
        try {
          members[doc.id] = docToMember(data)
        } catch (e) {
          console.warn(e)
        }
      })
      return members
    })
}

export const submitCommitteeApplication = (
  app: AumtCommitteeApp
): Promise<void> => {
  if (!db) return Promise.reject('No db object')
  return db.collection('committee-apps').doc(getListenerId()).set(app)
}

export const getCommitteeApplications = (): Promise<AumtCommitteeApp[]> => {
  if (!db) return Promise.reject('No db object')
  return db
    .collection('committee-apps')
    .get()
    .then((querySnapshot) => {
      const apps: AumtCommitteeApp[] = []
      querySnapshot.forEach((doc) => {
        apps.push(doc.data() as AumtCommitteeApp)
      })
      return apps.sort((a, b) => a.timestampMs - b.timestampMs)
    })
}

export const submitNewForm = (formData: AumtWeeklyTraining): Promise<void> => {
  if (!db) return Promise.reject('No db object')
  if (!formData) {
    return Promise.reject('No form data submitted')
  }
  return db.collection(TRAINING_DB_PATH).doc(formData.trainingId).set(formData)
}

export const submitEvent = (eventData: AumtEvent): Promise<void> => {
  if (!db) return Promise.reject('No db object')
  return db.collection('events').doc(eventData.id).set(eventData)
}

export const signUpToEvent = (
  eventId: string,
  uid: string,
  signupData: AumtEventSignupData,
  waitlist?: boolean
) => {
  if (!db) return Promise.reject('No db object')
  return db
    .collection('events')
    .doc(eventId)
    .set(
      {
        signups: {
          [waitlist ? 'waitlist' : 'members']: {
            [uid]: signupData,
          },
        },
      },
      { merge: true }
    )
}

export const confirmMemberEventSignup = (
  eventId: string,
  uid: string,
  confirmed: boolean,
  waitlist?: boolean
) => {
  if (!db) return Promise.reject('No db object')
  return db
    .collection('events')
    .doc(eventId)
    .set(
      {
        signups: {
          [waitlist ? 'waitlist' : 'members']: {
            [uid]: {
              confirmed,
            },
          },
        },
      },
      { merge: true }
    )
}

export const removeMemberFromEvent = (
  uid: string,
  eventId: string,
  waitlist?: boolean
) => {
  if (!db) return Promise.reject('No db object')
  return db
    .collection('events')
    .doc(eventId)
    .set(
      {
        signups: {
          [waitlist ? 'waitlist' : 'members']: {
            [uid]: firebase.firestore.FieldValue.delete(),
          },
        },
      },
      { merge: true }
    )
}

export const getAllEvents = (): Promise<AumtEvent[]> => {
  if (!db) return Promise.reject('No db object')
  return db
    .collection('events')
    .get()
    .then((querySnapshot) => {
      const events: AumtEvent[] = []
      querySnapshot.forEach((doc) => {
        const docData = doc.data()
        const event = docToEvent(docData)
        events.push(event)
      })
      return events
    })
}

export const getEventById = (id: string): Promise<AumtEvent> => {
  if (!db) return Promise.reject('No db object')
  return db
    .collection('events')
    .doc(id)
    .get()
    .then((doc) => {
      if (!doc.exists) {
        return Promise.reject('No event found')
      }
      return docToEvent(doc.data())
    })
}

export const removeEvent = (eventId: string): Promise<void> => {
  if (!db) return Promise.reject('No db object')
  return db.collection('events').doc(eventId).delete()
}

export const removeTraining = (trainingId: string): Promise<void> => {
  if (!db) return Promise.reject('No db object')
  return db.collection(TRAINING_DB_PATH).doc(trainingId).delete()
}

export const getAllForms = (): Promise<AumtWeeklyTraining[]> => {
  if (!db) return Promise.reject('No db object')
  return db
    .collection(TRAINING_DB_PATH)
    .get()
    .then((querySnapshot) => {
      const allForms: AumtWeeklyTraining[] = []
      querySnapshot.forEach((doc) => {
        const data = doc.data()
        const form = docToForm(data)
        allForms.push(form)
      })
      return allForms
    })
}

export const updatePaid = (
  memberId: string,
  newPaid: 'Yes' | 'No'
): Promise<void> => {
  if (!db) return Promise.reject('No db object')
  return db.collection(MEMBER_DB_PATH).doc(memberId).update({ paid: newPaid })
}

export const updateMembership = (
  memberId: string,
  newMembership: 'S1' | 'S2' | 'FY' | 'SS'
): Promise<void> => {
  if (!db) return Promise.reject('No db object')
  return db
    .collection(MEMBER_DB_PATH)
    .doc(memberId)
    .update({ membership: newMembership })
}

export const getOpenForms = (): Promise<AumtWeeklyTraining[]> => {
  if (!db) return Promise.reject('No db object')
  const currentDate = new Date()
  return db
    .collection(TRAINING_DB_PATH)
    .where('closes', '>=', currentDate)
    .get()
    .then((querySnapshot) => {
      const trainings: AumtWeeklyTraining[] = []
      querySnapshot.forEach((doc) => {
        const data = doc.data()
        // can't do where('opens', '<', currentDate) in firestore db so have to here
        if (data.opens.seconds * 1000 <= currentDate.getTime()) {
          const weeklyTraining = docToForm(data)
          trainings.push(weeklyTraining)
        }
      })
      return trainings
    })
}

export const setMember = (
  memberId: string,
  memberData: AumtMember
): Promise<void> => {
  if (!db) return Promise.reject('No db object')
  return db.collection(MEMBER_DB_PATH).doc(memberId).set(memberData)
}

export const addMultipleMembers = (
  members: Record<string, AumtMember>
): Promise<void> => {
  if (!db) return Promise.reject('No db object')
  const batch = db.batch()
  const memberCollection = db.collection(MEMBER_DB_PATH)
  Object.keys(members).forEach((key: string) => {
    const docRef = memberCollection.doc(key)
    batch.set(docRef, members[key])
  })
  return batch.commit()
}

export const removeMultipleMembers = (memberIds: string[]): Promise<void> => {
  if (!db) return Promise.reject('No db object')
  const batch = db.batch()
  memberIds.forEach((id) => {
    const doc = db!.collection(MEMBER_DB_PATH).doc(id)
    batch.delete(doc)
  })
  return batch.commit()
}

export const removeMember = (memberId: string): Promise<void> => {
  if (!db) return Promise.reject('No db object')
  return db.collection(MEMBER_DB_PATH).doc(memberId).delete()
}

export const getTrainingData = (
  formId: string
): Promise<AumtWeeklyTraining> => {
  if (!db) return Promise.reject('No db object')
  return db
    .collection(TRAINING_DB_PATH)
    .doc(formId)
    .get()
    .then((doc) => {
      const docData = doc.data()
      if (doc.exists && docData) {
        return docToForm(docData)
      }
      throw new Error('Form does not exist')
    })
}

export const checkTrainingAttendanceExists = async (
  formId: string,
  sessionId: string
): Promise<boolean> => {
  if (!db) return false
  const doc = await db.collection(TRAINING_ATTENDANCE_DB_PATH).doc(formId).get()
  const docData = doc.data()
  if (doc.exists && docData) {
    return !!docData.sessions[sessionId]
  }
  return false
}

export const createTrainingAttendance = async (
  formId: string,
  sessionId: string
): Promise<void> => {
  if (!db) return Promise.reject('No db object')
  return db
    .collection(TRAINING_ATTENDANCE_DB_PATH)
    .doc(formId)
    .set(
      {
        sessions: {
          [sessionId]: {
            members: [],
          },
        },
      },
      { merge: true }
    )
}

export const getTrainingAttendance = async (
  formId: string,
  sessionId: string
): Promise<string[]> => {
  if (!db) return null
  if (!(await checkTrainingAttendanceExists(formId, sessionId))) {
    await createTrainingAttendance(formId, sessionId)
    return []
  }
  const doc = await db.collection(TRAINING_ATTENDANCE_DB_PATH).doc(formId).get()

  const docData = doc.data()
  if (doc.exists && docData) {
    return docData.sessions[sessionId].members
  }
  throw new Error('Form does not exist')
}

export const setMemberTrainingAttendance = (
  formId: string,
  sessionId: string,
  memberId: string,
  attended: string[]
): Promise<void> => {
  if (!db) return Promise.reject('No db object')
  return db
    .collection(TRAINING_ATTENDANCE_DB_PATH)
    .doc(formId)
    .set(
      {
        sessions: {
          [sessionId]: {
            members: attended,
          },
        },
      },
      { merge: true }
    )
}

export const removeMemberFromForm = (
  userId: string,
  formId: string,
  sessionIds: string[]
): Promise<void> => {
  if (!db) return Promise.reject('No db object')
  const sessionObj = {}
  sessionIds.forEach((id) => {
    ;(sessionObj as any)[id] = {
      members: {
        [userId]: firebase.firestore.FieldValue.delete(),
      },
    }
  })
  return db.collection(TRAINING_DB_PATH).doc(formId).set(
    {
      sessions: sessionObj,
    },
    { merge: true }
  )
}

export const signUserUp = (
  userId: string,
  displayName: string,
  timeAdded: Date,
  formId: string,
  sessionIds: string[],
  feedback: string,
  prevSessionIds: string[]
): Promise<void> => {
  if (!db) return Promise.reject('No db object')
  const sessionObj = {}
  sessionIds.forEach((sessionId) => {
    ;(sessionObj as any)[sessionId] = {
      members: {
        [userId]: {
          name: displayName,
          timeAdded,
        },
      },
    }
  })
  const removeSessions = prevSessionIds.filter(
    (sId) => !sessionIds.includes(sId)
  )
  if (removeSessions.length) {
    removeSessions.forEach((sId) => {
      ;(sessionObj as any)[sId] = {
        members: {
          [userId]: firebase.firestore.FieldValue.delete(),
        },
      }
    })
  }
  let mergeObj = {
    sessions: sessionObj,
  }
  if (feedback) {
    ;(mergeObj as any) = {
      ...mergeObj,
      feedback: firebase.firestore.FieldValue.arrayUnion(feedback),
    }
  }
  return db
    .collection(TRAINING_DB_PATH)
    .doc(formId)
    .set(mergeObj, { merge: true })
}

export const formatMembers = () => {
  if (!db) return Promise.reject('No db object')
  // const experiences = ['Cash', 'Bank Transfer']
  return db.collection('members').get()
  // .then((querySnapshot) => {
  //     querySnapshot.forEach((doc) => {
  //         // doc.ref.update({

  //         // })
  //     })
  // })
}

export const listenToOneTraining = (
  formId: string,
  callback: (formId: string, training: AumtWeeklyTraining) => void
): string => {
  if (!db) throw new Error('no db')
  const listenerId = getListenerId()
  listeners[listenerId] = db
    .collection(TRAINING_DB_PATH)
    .doc(formId)
    .onSnapshot((doc: firebase.firestore.DocumentSnapshot) => {
      callback(formId, docToForm(doc.data()))
    })
  return listenerId
}

export const listenToTrainings = (
  callback: (forms: AumtWeeklyTraining[]) => void
): string => {
  if (!db) throw new Error('no db')
  const listenerId = getListenerId()
  listeners[listenerId] = db
    .collection(TRAINING_DB_PATH)
    .onSnapshot((querySnapshot) => {
      const newForms: AumtWeeklyTraining[] = []
      querySnapshot.docs.forEach((doc) => {
        newForms.push(docToForm(doc.data()))
      })
      callback(newForms)
    })
  return listenerId
}

export const listenToEvents = (
  callback: (events: AumtEvent[]) => void,
  errorCallback: (message: string) => void
): string => {
  if (!db) throw new Error('no db')
  const listenerId = getListenerId()
  listeners[listenerId] = db
    .collection('events')
    .onSnapshot((querySnapshot) => {
      const newEvents: AumtEvent[] = []
      querySnapshot.docs.forEach((doc) => {
        try {
          const event = docToEvent(doc.data())
          newEvents.push(event)
        } catch (err) {
          console.warn(err)
          // NOTE: uncomment this block if errors occur:
          // if (errorCallback ) {
          //     errorCallback(`Excluding event because ${err.toString()}`)
          // }
        }
      })
      callback(newEvents)
    })
  return listenerId
}

export const listenToMembers = (
  callback: (members: AumtMembersObj) => void
): string => {
  if (!db) throw new Error('No db')
  const listenerId = getListenerId()
  listeners[listenerId] = db
    .collection(MEMBER_DB_PATH)
    .onSnapshot((querySnapshot) => {
      const members: AumtMembersObj = {}
      querySnapshot.forEach((doc) => {
        const data = doc.data()
        try {
          members[doc.id] = docToMember(data)
        } catch (e) {
          console.warn(e)
        }
      })
      callback(members)
    })
  return listenerId
}

export const unlisten = (listenerId: string) => {
  if (listeners[listenerId]) {
    listeners[listenerId]()
    delete listeners[listenerId]
  }
}

export const getRandomDate = (start: Date, end: Date) => {
  return new Date(
    start.getTime() + Math.random() * (end.getTime() - start.getTime())
  )
}

export const getListenerId = () => {
  const chars = 'weyuiopasdhjklzxcvbnm1234567890'
  let id = ''
  for (let i = 0; i < 10; i++) {
    id += chars[Math.floor(Math.random() * chars.length)]
  }
  return id
}

export const docToForm = (docData: any): AumtWeeklyTraining => {
  if (Array.isArray(docData.sessions)) {
    console.log(docData)
    throw new Error('Outdated website, clear cache and refresh page please')
  }
  Object.keys(docData.sessions).forEach((sessionId: string) => {
    const session = docData.sessions[sessionId]
    Object.keys(session.members).forEach((i) => {
      session.members[i].timeAdded = new Date(
        session.members[i].timeAdded.seconds * 1000
      )
    })
  })
  const weeklyTraining: AumtWeeklyTraining = {
    title: docData.title,
    feedback: docData.feedback,
    trainingId: docData.trainingId,
    sessions: docData.sessions,
    signupMaxSessions: docData.signupMaxSessions || 1,
    openToPublic: docData.openToPublic || false,
    opens: new Date(docData.opens.seconds * 1000),
    closes: new Date(docData.closes.seconds * 1000),
    notes: docData.notes.split('%%NEWLINE%%').join('\n'),
    semester: docData.semester,
    paymentLock: docData.paymentLock,
  }
  return weeklyTraining
}

export const formToDoc = (form: AumtWeeklyTraining) => {
  const sessions: AumtTrainingSession[] = []
  Object.values(form.sessions).forEach((session: AumtTrainingSession) => {
    sessions.push(session)
  })
  return {
    ...form,
    sessions: sessions.sort((a, b) => a.position - b.position),
  }
}

export const docToMember = (docData: any): AumtMember => {
  const member = validator.createAumtMember(docData)
  if (typeof member === 'string') {
    throw new Error(
      `Could not read member. Reason: ${member}, Data: ${JSON.stringify(
        docData
      )}`
    )
  }
  return member
}

export const docToEvent = (docData: any): AumtEvent => {
  if (!docData.date) {
    throw new Error('No date on event: ' + JSON.stringify(docData))
  }
  const event: AumtEvent = {
    ...docData,
    date: new Date(docData.date.seconds * 1000),
    signups: docData.signups
      ? {
          ...docData.signups,
          opens: new Date(docData.signups.opens.seconds * 1000),
          closes: new Date(docData.signups.closes?.seconds * 1000),
        }
      : null,
  }
  return event
}
