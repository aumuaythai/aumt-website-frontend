import { Training } from '@/types'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { notification } from 'antd'
import {
  collection,
  deleteDoc,
  deleteField,
  doc,
  getDoc,
  getDocs,
  query,
  setDoc,
  updateDoc,
  where,
} from 'firebase/firestore'
import { db } from './firebase'

export type TrainingWithId = Training & { id: string }

const trainings = collection(db, 'weekly_trainings')

async function getTraining(trainingId: string) {
  const training = await getDoc(doc(trainings, trainingId))
  return training.data() as Training
}

async function getTrainings(): Promise<TrainingWithId[]> {
  const snapshot = await getDocs(trainings)
  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...(doc.data() as Training),
  }))
}

async function getOpenTrainings(): Promise<TrainingWithId[]> {
  const snapshot = await getDocs(
    query(trainings, where('closes', '>=', new Date()))
  )
  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...(doc.data() as Training),
  }))
}

async function createTraining(training: Training) {
  return await setDoc(doc(trainings), training)
}

async function deleteTraining(trainingId: string) {
  return await deleteDoc(doc(trainings, trainingId))
}

async function updateTraining(trainingId: string, training: Training) {
  return await updateDoc(doc(trainings, trainingId), training)
}

export async function updateMemberSessions(
  userId: string,
  displayName: string,
  trainingId: string,
  sessionIds: string[],
  currentSessionIds: string[]
) {
  const sessionObj = {}
  const timeAdded = new Date()

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

  const sessionsToRemove = currentSessionIds.filter(
    (sessionId) => !sessionIds.includes(sessionId)
  )

  if (sessionsToRemove.length > 0) {
    sessionsToRemove.forEach((sessionId) => {
      sessionObj[sessionId] = {
        members: {
          [userId]: deleteField(),
        },
      }
    })
  }

  return await updateDoc(doc(trainings, trainingId), {
    sessions: sessionObj,
  })
}

export function useTraining(trainingId: string) {
  const query = useQuery({
    queryKey: ['training', trainingId],
    queryFn: () => getTraining(trainingId),
    enabled: !!trainingId,
  })
  return query
}

export function useTrainings() {
  const query = useQuery({
    queryKey: ['trainings'],
    queryFn: getTrainings,
  })

  return query
}

export function useOpenTrainings() {
  const query = useQuery({
    queryKey: ['openTrainings'],
    queryFn: getOpenTrainings,
  })
  return query
}

export function useCreateTraining() {
  const queryClient = useQueryClient()

  const mutation = useMutation({
    mutationFn: createTraining,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['trainings'] })
      notification.success({
        message: 'Training created',
      })
    },
    onError: (error) => {
      notification.error({
        message: 'Error creating training: ' + error.toString(),
      })
    },
  })

  return mutation
}

export function useDeleteTraining() {
  const queryClient = useQueryClient()

  const mutation = useMutation({
    mutationFn: deleteTraining,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['trainings'] })
      notification.success({
        message: 'Training deleted',
      })
    },
    onError: (error) => {
      notification.error({
        message: 'Error deleting training: ' + error.toString(),
      })
    },
  })

  return mutation
}

export function useUpdateTraining() {
  const queryClient = useQueryClient()

  const mutation = useMutation({
    mutationFn: ({
      trainingId,
      training,
    }: {
      trainingId: string
      training: Training
    }) => updateTraining(trainingId, training),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['trainings'] })
      notification.success({
        message: 'Training updated',
      })
    },
    onError: (error) => {
      notification.error({
        message: 'Error updating training: ' + error.toString(),
      })
    },
  })

  return mutation
}

export function useUpdateMemberSessions() {
  const queryClient = useQueryClient()

  const mutation = useMutation({
    mutationFn: ({
      userId,
      displayName,
      trainingId,
      sessionIds,
      currentSessionIds,
    }: {
      userId: string
      displayName: string
      trainingId: string
      sessionIds: string[]
      currentSessionIds: string[]
    }) =>
      updateMemberSessions(
        userId,
        displayName,
        trainingId,
        sessionIds,
        currentSessionIds
      ),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['trainings'] })
      notification.success({ message: 'Member added to training' })
    },
    onError: (error) => {
      notification.error({
        message: 'Error adding member to training: ' + error.message,
      })
    },
  })

  return mutation
}
