import { useQuery } from '@tanstack/react-query'
import { Spin } from 'antd'
import { getAllEvents } from '../../../services/db'
import EventsList from './EventsList'

export default function Events() {
  const { data } = useQuery({
    queryKey: ['events'],
    queryFn: () => getAllEvents(),
  })

  const currentDate = new Date()

  const pastEvents = data
    ?.filter((e) => e.date < currentDate)
    .sort((a, b) => (a.date < b.date ? 1 : -1))
  const upcomingEvents = data
    ?.filter((e) => e.date >= currentDate)
    .sort((a, b) => (a.date > b.date ? 1 : -1))

  if (!data) {
    return (
      <div className="mt-[30px]">
        Retrieving Events <Spin />
      </div>
    )
  }

  return (
    <div className="h-full overflow-y-scroll">
      <div className="max-w-[800px] !mx-auto px-[30px] mb-10">
        <h2>Upcoming Events</h2>
        {upcomingEvents?.length ? (
          <EventsList events={upcomingEvents} />
        ) : (
          <p>
            There are no upcoming club events at this time. Please check our
            Facebook page.
          </p>
        )}
      </div>
      <div className="max-w-[800px] !mx-auto px-[30px]">
        <h2>Past Events</h2>
        {pastEvents?.length ? (
          <EventsList events={pastEvents} />
        ) : (
          <p>There are no past club events up now</p>
        )}
      </div>
    </div>
  )
}
