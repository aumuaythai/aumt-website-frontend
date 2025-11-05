import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { notification } from 'antd'
import {
  arrayRemove,
  arrayUnion,
  collection,
  doc,
  FieldValue,
  getDoc,
  updateDoc,
} from 'firebase/firestore'
import { db } from './firebase'

const attendance = collection(db, 'training_attendance')

type Attendance = string[]

async function getAttendance(sessionId: string): Promise<Attendance> {
  const attendanceDoc = await getDoc(doc(attendance, sessionId))
  return attendanceDoc.data() as Attendance
}

async function addAttendance(sessionId: string, memberId: string) {
  updateDoc(doc(attendance, sessionId), { members: arrayUnion(memberId) })
}

async function removeAttendance(sessionId: string, memberId: string) {
  updateDoc(doc(attendance, sessionId), { members: arrayRemove(memberId) })
}

export function useAttendance(sessionId?: string) {
  return useQuery({
    queryKey: ['attendance', sessionId],
    queryFn: () => getAttendance(sessionId!),
    enabled: !!sessionId,
  })
}

export function useAddAttendance() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({
      sessionId,
      memberId,
    }: {
      sessionId: string
      memberId: string
    }) => addAttendance(sessionId, memberId),
    onSuccess: (_, { sessionId }) => {
      queryClient.invalidateQueries({ queryKey: ['attendance', sessionId] })
    },
    onError: (error) => {
      notification.error({
        message: 'Error adding attendance: ' + error.message,
      })
    },
  })
}

export function useRemoveAttendance() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({
      sessionId,
      memberId,
    }: {
      sessionId: string
      memberId: string
    }) => removeAttendance(sessionId, memberId),
    onSuccess: (_, { sessionId }) => {
      queryClient.invalidateQueries({ queryKey: ['attendance', sessionId] })
    },
    onError: (error) => {
      notification.error({
        message: 'Error removing attendance: ' + error.message,
      })
    },
  })
}
