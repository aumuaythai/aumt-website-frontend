import { useEvents } from '@/services/events'
import { Spin } from 'antd'
import EventsList from './EventsList'

export default function Events() {
  const { data: events, isPending: isLoadingEvents } = useEvents()

  const currentDate = new Date()

  const pastEvents = events
    ?.filter((e) => e.date.toDate() < currentDate)
    .sort((a, b) => (a.date.toDate() < b.date.toDate() ? 1 : -1))
  const upcomingEvents = events
    ?.filter((e) => e.date.toDate() >= currentDate)
    .sort((a, b) => (a.date.toDate() > b.date.toDate() ? 1 : -1))

  if (isLoadingEvents) {
    return (
      <div>
        Loading Events <Spin />
      </div>
    )
  }

  return (
    <div className="max-w-3xl mx-auto px-6 pt-8 flex flex-col gap-y-8">
      <div className="flex flex-col gap-y-2">
        <h1 className="text-2xl">Upcoming Events</h1>
        {upcomingEvents?.length ? (
          <EventsList events={upcomingEvents} />
        ) : (
          <p>There are no upcoming events.</p>
        )}
      </div>

      <div className="flex flex-col gap-y-2">
        <h1 className="text-2xl">Past Events</h1>
        {pastEvents?.length ? (
          <EventsList events={pastEvents} />
        ) : (
          <p>There are no past events.</p>
        )}
      </div>
    </div>
  )
}
