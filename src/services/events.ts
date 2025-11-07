import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { notification } from 'antd'
import {
  addDoc,
  collection,
  deleteDoc,
  deleteField,
  doc,
  getDoc,
  getDocs,
  updateDoc,
} from 'firebase/firestore'
import { Event, EventSignup } from '../types'
import { db } from './firebase'

export type EventWithId = Event & { id: string }

const events = collection(db, 'events')

async function getEvent(eventId: string) {
  const event = await getDoc(doc(events, eventId))
  return event.data() as Event
}

async function getEvents(): Promise<EventWithId[]> {
  const snapshot = await getDocs(events)
  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...(doc.data() as Event),
  }))
}

async function createEvent(event: Event) {
  return await addDoc(events, event)
}

async function updateEvent(eventId: string, event: Event) {
  return await updateDoc(doc(events, eventId), event)
}

async function deleteEvent(eventId: string) {
  return await deleteDoc(doc(events, eventId))
}

async function addMemberToEvent(
  eventId: string,
  userId: string,
  signupData: EventSignup
) {
  return await updateDoc(doc(events, eventId), {
    [`signups.members.${userId}`]: signupData,
  })
}

async function removeMemberFromEvent(eventId: string, userId: string) {
  return await updateDoc(doc(events, eventId), {
    [`signups.members.${userId}`]: deleteField(),
  })
}

export function useEvent(eventId: string) {
  const query = useQuery({
    queryKey: ['event', eventId],
    queryFn: () => getEvent(eventId),
    enabled: !!eventId,
  })
  return query
}

export function useEvents() {
  const query = useQuery({
    queryKey: ['events'],
    queryFn: getEvents,
  })
  return query
}

export function useCreateEvent() {
  const queryClient = useQueryClient()
  const mutation = useMutation({
    mutationFn: createEvent,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['events'] })
      notification.success({
        message: 'Event created',
      })
    },
    onError: (error) => {
      notification.error({
        message: 'Error creating event: ' + error.toString(),
      })
    },
  })
  return mutation
}

export function useUpdateEvent() {
  const queryClient = useQueryClient()
  const mutation = useMutation({
    mutationFn: ({ eventId, event }: { eventId: string; event: Event }) =>
      updateEvent(eventId, event),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['events'] })
      notification.success({
        message: 'Event updated',
      })
    },
    onError: (error) => {
      notification.error({
        message: 'Error updating event: ' + error.toString(),
      })
    },
  })
  return mutation
}

export function useDeleteEvent() {
  const queryClient = useQueryClient()
  const mutation = useMutation({
    mutationFn: deleteEvent,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['events'] })
      notification.success({
        message: 'Event deleted',
      })
    },
  })
  return mutation
}

export function useAddMemberToEvent() {
  const queryClient = useQueryClient()
  const mutation = useMutation({
    mutationFn: ({
      eventId,
      userId,
      signupData,
    }: {
      eventId: string
      userId: string
      signupData: EventSignup
    }) => addMemberToEvent(eventId, userId, signupData),
    onSuccess: (_, { eventId }) => {
      queryClient.invalidateQueries({ queryKey: ['event', eventId] })
      notification.success({
        message: 'Member added',
      })
    },
    onError: (error) => {
      notification.error({
        message: 'Error adding member: ' + error.toString(),
      })
    },
  })
  return mutation
}

export function useRemoveMemberFromEvent() {
  const queryClient = useQueryClient()
  const mutation = useMutation({
    mutationFn: ({ eventId, userId }: { eventId: string; userId: string }) =>
      removeMemberFromEvent(eventId, userId),
    onSuccess: (_, { eventId }) => {
      queryClient.invalidateQueries({ queryKey: ['event', eventId] })
      notification.success({
        message: 'Member removed',
      })
    },
    onError: (error) => {
      notification.error({
        message: 'Error removing member: ' + error.toString(),
      })
    },
  })
  return mutation
}
