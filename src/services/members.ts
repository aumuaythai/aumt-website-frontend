import { Member } from '@/types'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { notification } from 'antd'
import { createUserWithEmailAndPassword } from 'firebase/auth'
import {
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  setDoc,
  updateDoc,
} from 'firebase/firestore'
import { auth, db } from './firebase'

const members = collection(db, 'members')

export async function getMember(userId: string) {
  const member = await getDoc(doc(members, userId))
  return member.data() as Member
}

async function getMembers() {
  const snapshot = await getDocs(members)
  return snapshot.docs.map((doc) => doc.data() as Member)
}

async function createMember(member: Member, password: string) {
  const user = await createUserWithEmailAndPassword(
    auth,
    member.email,
    password
  )
  if (!user.user?.uid) {
    throw new Error('Failed to create user')
  }

  return await setDoc(doc(members, user.user.uid), member)
}

async function updateMember(userId: string, member: Member) {
  return await updateDoc(doc(members, userId), member)
}

async function deleteMember(userId: string) {
  return await deleteDoc(doc(members, userId))
}

export function useMember(userId?: string) {
  const query = useQuery({
    queryKey: ['member', userId],
    queryFn: () => getMember(userId!),
    enabled: !!userId,
  })
  return query
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
