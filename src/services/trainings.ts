import { Training } from '@/types'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { notification } from 'antd'
import { db } from './firebase'

const TRAINING_DB_PATH = 'weekly_trainings'

async function getTraining(trainingId: string): Promise<Training> {
  const doc = await db.collection(TRAINING_DB_PATH).doc(trainingId).get()
  return doc.data() as Training
}

async function getTrainings(): Promise<Training[]> {
  const snapshot = await db.collection(TRAINING_DB_PATH).get()
  return snapshot.docs.map((doc) => doc.data() as Training)
}

async function createTraining(training: Training) {
  return await db.collection(TRAINING_DB_PATH).doc().set(training)
}

async function deleteTraining(trainingId: string) {
  return await db.collection(TRAINING_DB_PATH).doc(trainingId).delete()
}

async function updateTraining(trainingId: string, training: Training) {
  return await db.collection(TRAINING_DB_PATH).doc(trainingId).update(training)
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
