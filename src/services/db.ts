import firebase from 'firebase/app'
import {
  AumtEventSignupData,
  AumtMembersObj,
  ClubConfig,
  Event,
  Member,
  Training,
} from '../types'
import { db } from './firebase'

const TRAINING_DB_PATH = 'weekly_trainings'
const TRAINING_ATTENDANCE_DB_PATH = 'training_attendance'
const MEMBER_DB_PATH = 'members'

export async function getUserInfo(fbUser: firebase.User): Promise<Member> {
  if (!db) throw new Error('No db object')
  const doc = await db.collection(MEMBER_DB_PATH).doc(fbUser.uid).get()
  const docData = doc.data()

  if (!doc.exists || !docData) {
    throw new Error('No AUMT member exists for this acccount ' + fbUser.uid)
  }

  return docData as Member
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

export const getAllEvents = (): Promise<Event[]> => {
  if (!db) return Promise.reject('No db object')
  return db
    .collection('events')
    .get()
    .then((querySnapshot) => {
      const events: Event[] = []
      querySnapshot.forEach((doc) => {
        const docData = doc.data()
        const event = docToEvent(docData)
        events.push(event)
      })
      return events
    })
}

export const getEventById = (id: string): Promise<Event> => {
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

export const docToEvent = (docData: any): Event => {
  if (!docData.date) {
    throw new Error('No date on event: ' + JSON.stringify(docData))
  }
  const event: Event = {
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
