import { PlusOutlined } from '@ant-design/icons'
import { useQuery } from '@tanstack/react-query'
import { Button, Divider, notification, Popconfirm, Spin } from 'antd'
import { useEffect, useState } from 'react'
import { Link } from 'react-router'
import { getAllEvents, removeEvent } from '../../../services/db'
import AdminStore from '../AdminStore'
import './ManageEvents.css'

export default function ManageEvents() {
  const [removingEvent, setRemovingEvent] = useState<{
    [eventId: string]: boolean
  }>({})

  const { data, isPending } = useQuery({
    queryKey: ['events'],
    queryFn: () => getAllEvents(),
  })

  useEffect(() => {
    AdminStore.requestEvents()
  }, [])

  async function handleRemoveEvent(eventId: string) {
    setRemovingEvent((prev) => ({ ...prev, [eventId]: true }))
    try {
      await removeEvent(eventId)
      setRemovingEvent((prev) => ({ ...prev, [eventId]: false }))
    } catch (error) {
      notification.open({
        message: 'Error removing event: ' + error.toString(),
      })
    }
  }

  if (isPending) {
    return (
      <div>
        Loading Events <Spin />
      </div>
    )
  }

  if (!data) {
    return (
      <div>
        No Events Found <Spin />
      </div>
    )
  }

  const events = data.slice().sort((a, b) => (a.date > b.date ? -1 : 1))

  return (
    <div className="text-center max-w-[600px] mx-auto">
      <div className="mt-[30px] flex justify-between">
        <h2 className="text-xl">Manage Events</h2>
        <Link to="/admin/events/create" className="float-right">
          <Button type="primary" size="large" shape="round">
            Create Event <PlusOutlined />
          </Button>
        </Link>
      </div>
      <div className="manageEventsContainer">
        {events.map((event) => {
          return (
            <div className="eachEventManager" key={event.id}>
              <div className="eventManageHeader">
                <h4 className="manageEventTitle">{event.title}</h4>
                <div className="manageEventOptions">
                  {event.signups && (
                    <Link to={`/admin/events/${event.id}`}>
                      <Button className="manageEventOptionButton">
                        View Signups
                      </Button>
                    </Link>
                  )}
                  <Link to={`/admin/editevent/${event.id}`}>
                    <Button className="manageEventOptionButton">Edit</Button>
                  </Link>
                  <Popconfirm
                    title="Confirm Delete Event?"
                    onConfirm={() => handleRemoveEvent(event.id)}
                  >
                    <Button
                      className="manageEventOptionButton"
                      loading={removingEvent[event.id]}
                      danger
                      type="primary"
                    >
                      Remove
                    </Button>
                  </Popconfirm>
                </div>
                <div className="clearBoth"></div>
              </div>
              <Divider />
            </div>
          )
        })}
      </div>
    </div>
  )
}
