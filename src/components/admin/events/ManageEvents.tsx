import { Button, Divider, notification, Popconfirm, Spin } from 'antd'
import { useEffect, useState } from 'react'
import { Link, useLocation } from 'react-router'
import { removeEvent } from '../../../services/db'
import { AumtEvent } from '../../../types'
import AdminStore from '../AdminStore'
import './ManageEvents.css'

interface ManageEventsProps {
  events: AumtEvent[]
}

export default function ManageEvents(props: ManageEventsProps) {
  const [removingEvent, setRemovingEvent] = useState<{
    [eventId: string]: boolean
  }>({})

  const events = props.events.slice().sort((a, b) => (a.date > b.date ? -1 : 1))
  const loadingEvents = !props.events.length

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

  if (loadingEvents) {
    return (
      <div>
        Loading Events <Spin />
      </div>
    )
  }

  return (
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
  )
}
