import { ClubConfig } from '@/types'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { notification } from 'antd'
import { db } from './firebase'

async function getConfig(): Promise<ClubConfig> {
  const doc = await db.collection('config').doc('config').get()
  return doc.data() as ClubConfig
}

async function updateConfig(config: ClubConfig): Promise<void> {
  await db.collection('config').doc('config').set(config)
}

export function useConfig() {
  const query = useQuery({
    queryKey: ['config'],
    queryFn: getConfig,
  })

  return query
}

export function useUpdateConfig() {
  const queryClient = useQueryClient()

  const mutation = useMutation({
    mutationFn: updateConfig,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['config'] })
      notification.success({
        message: 'Club settings saved successfully',
      })
    },
    onError: (error) => {
      notification.error({
        message: 'Error updating config',
        description: error.toString(),
      })
    },
  })

  return mutation
}
