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

export async function addMemberToSession(
  userId: string,
  displayName: string,
  trainingId: string,
  sessionId: string
) {
  const snapshot = await getDoc(doc(trainings, trainingId))
  const training = snapshot.data() as Training

  const sessions = training.sessions
  sessions[sessionId].members[userId] = {
    name: displayName,
    timeAdded: new Date(),
  }

  return await updateDoc(doc(trainings, trainingId), {
    sessions: sessions,
  })
}

export async function removeMemberFromSession(
  userId: string,
  trainingId: string,
  sessionId: string
) {
  const snapshot = await getDoc(doc(trainings, trainingId))
  const training = snapshot.data() as Training
  delete training.sessions[sessionId].members[userId]

  return await updateDoc(doc(trainings, trainingId), {
    sessions: training.sessions,
  })
}

export async function updateMemberSessions(
  userId: string,
  displayName: string,
  trainingId: string,
  sessionIds: string[]
) {
  const snapshot = await getDoc(doc(trainings, trainingId))
  const training = snapshot.data() as Training

  const sessions = training.sessions
  Object.values(sessions).forEach((session) => {
    if (sessionIds.includes(session.sessionId) && !session.members[userId]) {
      session.members[userId] = {
        name: displayName,
        timeAdded: new Date(),
      }
    } else {
      delete session.members[userId]
    }
  })

  return await updateDoc(doc(trainings, trainingId), {
    sessions: sessions,
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

export function useAddMemberToSession() {
  const queryClient = useQueryClient()
  const mutation = useMutation({
    mutationFn: ({
      userId,
      displayName,
      trainingId,
      sessionId,
    }: {
      userId: string
      displayName: string
      trainingId: string
      sessionId: string
    }) => addMemberToSession(userId, displayName, trainingId, sessionId),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['trainings'] })
    },
    onError: (error) => {
      notification.error({
        message: 'Error adding member to session: ' + error.message,
      })
    },
  })
  return mutation
}

export function useRemoveMemberFromSession() {
  const queryClient = useQueryClient()
  const mutation = useMutation({
    mutationFn: ({
      userId,
      trainingId,
      sessionId,
    }: {
      userId: string
      trainingId: string
      sessionId: string
    }) => removeMemberFromSession(userId, trainingId, sessionId),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['trainings'] })
    },
    onError: (error) => {
      notification.error({
        message: 'Error removing member from session: ' + error.message,
      })
    },
  })
  return mutation
}

export function useUpdateMemberSessions() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({
      userId,
      displayName,
      trainingId,
      sessionIds,
    }: {
      userId: string
      displayName: string
      trainingId: string
      sessionIds: string[]
    }) => updateMemberSessions(userId, displayName, trainingId, sessionIds),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['trainings'] })
    },
    onError: (error) => {
      notification.error({
        message: 'Error signing up: ' + error.toString(),
      })
    },
  })
}
