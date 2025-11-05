import { Member } from '@/types'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { notification } from 'antd'
import { auth, db } from './firebase'

const MEMBER_DB_PATH = 'members'

async function getMembers(): Promise<Member[]> {
  const members = await db.collection('members').get()
  return members.docs.map((doc) => doc.data() as Member)
}

async function createMember(member: Member, password: string) {
  const user = await auth.createUserWithEmailAndPassword(member.email, password)
  if (!user.user?.uid) {
    throw new Error('Failed to create user')
  }

  return await db.collection(MEMBER_DB_PATH).doc(user.user.uid).set(member)
}

async function updateMember(userId: string, member: Member) {
  return await db.collection(MEMBER_DB_PATH).doc(userId).update(member)
}

async function deleteMember(userId: string) {
  return await db.collection(MEMBER_DB_PATH).doc(userId).delete()
}

export function useMembers() {
  const query = useQuery({
    queryKey: ['members'],
    queryFn: getMembers,
  })

  return query
}

export function useCreateMember() {
  const queryClient = useQueryClient()

  const mutation = useMutation({
    mutationFn: ({ member, password }: { member: Member; password: string }) =>
      createMember(member, password),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['members'] })
      notification.success({
        message: 'Member created',
      })
    },
    onError: (error) => {
      notification.error({
        message: 'Error creating member: ' + error.toString(),
      })
    },
  })

  return mutation
}

export function useUpdateMember() {
  const queryClient = useQueryClient()

  const mutation = useMutation({
    mutationFn: ({ userId, member }: { userId: string; member: Member }) =>
      updateMember(userId, member),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['members'] })
      notification.success({ message: 'Member updated' })
    },
    onError: (error) => {
      notification.error({
        message: 'Error updating member: ' + error.toString(),
      })
    },
  })

  return mutation
}

export function useDeleteMember() {
  const queryClient = useQueryClient()

  const mutation = useMutation({
    mutationFn: (userId: string) => deleteMember(userId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['members'] })
      notification.success({ message: 'Member deleted' })
    },
    onError: (error) => {
      notification.error({
        message: 'Error deleting member: ' + error.toString(),
      })
    },
  })

  return mutation
}
