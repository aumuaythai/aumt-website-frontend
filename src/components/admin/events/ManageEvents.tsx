import { useDeleteEvent, useEvents } from '@/services/events'
import { PlusOutlined } from '@ant-design/icons'
import { Button, Divider, Popconfirm, Spin } from 'antd'
import { Link } from 'react-router'

export default function ManageEvents() {
  const { data: events, isPending: isLoadingEvents } = useEvents()
  const deleteEvent = useDeleteEvent()

  function handleRemoveEvent(eventId: string) {
    deleteEvent.mutate(eventId)
  }

  if (isLoadingEvents) {
    return (
      <div>
        Loading Events <Spin />
      </div>
    )
  }

  if (!events) {
    return <div>No Events Found</div>
  }

  const sortedEvents = events.slice().sort((a, b) => (a.date > b.date ? -1 : 1))

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
        {sortedEvents.map((event) => {
          return (
            <>
              <li key={event.id} className="flex gap-x-4 justify-between">
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
                      loading={deleteEvent.isPending}
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
