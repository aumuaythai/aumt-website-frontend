import { ClubConfig } from '@/types'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { notification } from 'antd'
import { collection, doc, getDoc, setDoc } from 'firebase/firestore'
import { db } from './firebase'

const configCollection = collection(db, 'config')

async function getConfig(): Promise<ClubConfig> {
  const config = await getDoc(doc(configCollection, 'config'))
  return config.data() as ClubConfig
}

async function updateConfig(config: ClubConfig): Promise<void> {
  return await setDoc(doc(configCollection, 'config'), config)
}

export function useConfig() {
  return useQuery({
    queryKey: ['config'],
    queryFn: getConfig,
  })
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
