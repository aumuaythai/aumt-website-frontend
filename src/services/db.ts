import firebase from 'firebase/app'
import {
  AumtEvent,
  AumtEventSignupData,
  AumtMember,
  AumtMembersObj,
  ClubConfig,
  Training,
} from '../types'
import { db } from './firebase'

const TRAINING_DB_PATH = 'weekly_trainings'
const TRAINING_ATTENDANCE_DB_PATH = 'training_attendance'
const MEMBER_DB_PATH = 'members'

const listeners: Record<string, Function> = {}

export async function getUserInfo(fbUser: firebase.User): Promise<AumtMember> {
  if (!db) throw new Error('No db object')
  const doc = await db.collection(MEMBER_DB_PATH).doc(fbUser.uid).get()
  const docData = doc.data()

  if (!doc.exists || !docData) {
    throw new Error('No AUMT member exists for this acccount ' + fbUser.uid)
  }

  return docData as AumtMember
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

export async function getAllMembers(): Promise<AumtMembersObj> {
  if (!db) return Promise.reject('No db object')
  const membersSnapshot = await db.collection(MEMBER_DB_PATH).get()
  const members: AumtMembersObj = {}
  membersSnapshot.forEach((doc) => {
    members[doc.id] = doc.data() as AumtMember
  })
  return members
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

export const setMember = (
  memberId: string,
  memberData: AumtMember
): Promise<void> => {
  if (!db) return Promise.reject('No db object')
  return db.collection(MEMBER_DB_PATH).doc(memberId).set(memberData)
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
  if (!db) return []
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

export function signUserUp(
  userId: string,
  displayName: string,
  trainingId: string,
  sessionIds: string[],
  currentSessionIds: string[]
): Promise<void> {
  if (!db) return Promise.reject('No db object')

  // Build session update object
  const sessionObj = {}
  const timeAdded = new Date()

  // Add user to sessions in sessionIds array
  sessionIds.forEach((sessionId) => {
    sessionObj[sessionId] = {
      members: {
        [userId]: {
          name: displayName,
          timeAdded,
        },
      },
    }
  })

  // Remove user from sessions they're currently in but not in sessionIds
  const sessionsToRemove = currentSessionIds.filter(
    (sessionId) => !sessionIds.includes(sessionId)
  )

  if (sessionsToRemove.length > 0) {
    sessionsToRemove.forEach((sessionId) => {
      sessionObj[sessionId] = {
        members: {
          [userId]: firebase.firestore.FieldValue.delete(),
        },
      }
    })
  }

  // Update the training document
  return db.collection(TRAINING_DB_PATH).doc(trainingId).set(
    {
      sessions: sessionObj,
    },
    { merge: true }
  )
}

// export const signUserUp = (
//   userId: string,
//   displayName: string,
//   timeAdded: Date,
//   formId: string,
//   sessionIds: string[],
//   feedback: string,
//   prevSessionIds: string[]
// ): Promise<void> => {
//   if (!db) return Promise.reject('No db object')
//   const sessionObj = {}
//   sessionIds.forEach((sessionId) => {
//     ;(sessionObj as any)[sessionId] = {
//       members: {
//         [userId]: {
//           name: displayName,
//           timeAdded,
//         },
//       },
//     }
//   })
//   const removeSessions = prevSessionIds.filter(
//     (sId) => !sessionIds.includes(sId)
//   )
//   if (removeSessions.length) {
//     removeSessions.forEach((sId) => {
//       ;(sessionObj as any)[sId] = {
//         members: {
//           [userId]: firebase.firestore.FieldValue.delete(),
//         },
//       }
//     })
//   }
//   let mergeObj = {
//     sessions: sessionObj,
//   }
//   if (feedback) {
//     ;(mergeObj as any) = {
//       ...mergeObj,
//       feedback: firebase.firestore.FieldValue.arrayUnion(feedback),
//     }
//   }
//   return db
//     .collection(TRAINING_DB_PATH)
//     .doc(formId)
//     .set(mergeObj, { merge: true })
// }

export const listenToOneTraining = (
  formId: string,
  callback: (formId: string, training: Training) => void
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

export const unlisten = (listenerId: string) => {
  if (listeners[listenerId]) {
    listeners[listenerId]()
    delete listeners[listenerId]
  }
}

export const getListenerId = () => {
  const chars = 'weyuiopasdhjklzxcvbnm1234567890'
  let id = ''
  for (let i = 0; i < 10; i++) {
    id += chars[Math.floor(Math.random() * chars.length)]
  }
  return id
}

export const docToForm = (docData: any): Training => {
  if (Array.isArray(docData.sessions)) {
    console.log(docData)
    throw new Error('Outdated website, clear cache and refresh page please')
  }
  console.log('docData', docData)

  Object.keys(docData.sessions).forEach((sessionId: string) => {
    const session = docData.sessions[sessionId]
    Object.keys(session.members).forEach((i) => {
      session.members[i].timeAdded = new Date(
        session.members[i].timeAdded.seconds * 1000
      )
    })
  })
  const weeklyTraining: Training = {
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
