import { useEvents } from '@/services/events'
import { PlusOutlined } from '@ant-design/icons'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { Button, Divider, notification, Popconfirm, Spin } from 'antd'
import { Link } from 'react-router'
import { getAllEvents, removeEvent } from '../../../services/db'

export default function ManageEvents() {
  const queryClient = useQueryClient()

  const { data, isPending: isLoadingEvents } = useEvents()

  const removeEventMutation = useMutation({
    mutationFn: (eventId: string) => removeEvent(eventId),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['events'] })
      notification.success({
        message: 'Event removed successfully',
      })
    },
  })

  function handleRemoveEvent(eventId: string) {
    removeEventMutation.mutate(eventId)
  }

  if (isLoadingEvents) {
    return (
      <div>
        Loading Events <Spin />
      </div>
    )
  }

  if (!data) {
    return <div>No Events Found</div>
  }

  const events = data.slice().sort((a, b) => (a.date > b.date ? -1 : 1))

  return (
    <div className="max-w-2xl mx-auto pt-8">
      <div className="flex justify-between">
        <h1 className="text-2xl">Manage Events</h1>
        <Link to="/admin/events/create">
          <Button type="primary" shape="round" icon={<PlusOutlined />}>
            Create Event
          </Button>
        </Link>
      </div>
      <ul className="flex flex-col mt-8">
        {events.map((event) => {
          return (
            <>
              <li key={event.title} className="flex gap-x-4 justify-between">
                <h2>{event.title}</h2>
                <div className="flex gap-x-2">
                  {event.signups && (
                    <Link to={`/admin/events/${event.id}`}>
                      <Button>View Signups</Button>
                    </Link>
                  )}
                  <Link to={`/admin/events/${event.id}`}>
                    <Button>Edit</Button>
                  </Link>
                  <Popconfirm
                    title="Confirm Delete Event?"
                    onConfirm={() => handleRemoveEvent(event.id)}
                  >
                    <Button
                      loading={removeEventMutation.isPending}
                      danger
                      type="primary"
                    >
                      Remove
                    </Button>
                  </Popconfirm>
                </div>
              </li>
              <Divider />
            </>
          )
        })}
      </ul>
    </div>
  )
}
