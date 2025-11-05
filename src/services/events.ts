import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { notification } from 'antd'
import { Event } from '../types'
import { db } from './firebase'

async function getEvent(eventId: string) {
  const doc = await db.collection('events').doc(eventId).get()
  return doc.data() as Event
}

async function getEvents() {
  const snapshot = await db.collection('events').get()
  return snapshot.docs.map((doc) => doc.data() as Event)
}

async function createEvent(event: Event) {
  return await db.collection('events').doc().set(event)
}

async function updateEvent(eventId: string, event: Event) {
  return await db.collection('events').doc(eventId).update(event)
}

async function deleteEvent(eventId: string) {
  return await db.collection('events').doc(eventId).delete()
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
