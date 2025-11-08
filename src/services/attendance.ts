import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { notification } from 'antd'
import {
  arrayRemove,
  arrayUnion,
  collection,
  doc,
  FieldValue,
  getDoc,
  getDocs,
  setDoc,
  updateDoc,
} from 'firebase/firestore'
import { db } from './firebase'

const attendance = collection(db, 'training_attendance_flat')

type Attendance = Record<string, string[]>

async function getAttendance(trainingId: string): Promise<Attendance | null> {
  console.log(trainingId)
  const attendanceDoc = await getDoc(doc(attendance, trainingId))
  if (!attendanceDoc.exists()) {
    return null
  }

  return attendanceDoc.data() as Attendance
}

async function addAttendance(
  trainingId: string,
  sessionId: string,
  memberId: string
) {
  updateDoc(doc(attendance, trainingId), { [sessionId]: arrayUnion(memberId) })
}

async function removeAttendance(
  trainingId: string,
  sessionId: string,
  memberId: string
) {
  updateDoc(doc(attendance, trainingId), { [sessionId]: arrayRemove(memberId) })
}

export function useAttendance(trainingId: string) {
  return useQuery({
    queryKey: ['attendance', trainingId],
    queryFn: () => getAttendance(trainingId),
    enabled: !!trainingId,
  })
}

export function useAddAttendance() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({
      trainingId,
      sessionId,
      memberId,
    }: {
      trainingId: string
      sessionId: string
      memberId: string
    }) => addAttendance(trainingId, sessionId, memberId),
    onSuccess: (_, { trainingId }) => {
      queryClient.invalidateQueries({ queryKey: ['attendance', trainingId] })
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
      trainingId,
      sessionId,
      memberId,
    }: {
      trainingId: string
      sessionId: string
      memberId: string
    }) => removeAttendance(trainingId, sessionId, memberId),
    onSuccess: (_, { trainingId }) => {
      queryClient.invalidateQueries({ queryKey: ['attendance', trainingId] })
    },
    onError: (error) => {
      notification.error({
        message: 'Error removing attendance: ' + error.message,
      })
    },
  })
}
