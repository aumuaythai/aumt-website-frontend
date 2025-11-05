import { EventWithId } from '@/services/events'
import { Divider } from 'antd'
import { Link } from 'react-router'
import { RenderMarkdown } from '../utility/RenderMarkdown'

interface EventListProps {
  events: EventWithId[]
}

const dateOptions: Intl.DateTimeFormatOptions = {
  weekday: 'long',
  year: 'numeric',
  month: 'long',
  day: 'numeric',
}

export default function EventsList({ events }: EventListProps) {
  if (events.length === 0) {
    return <p>There are no club events up at this time</p>
  }

  return (
    <ul className="flex flex-col gap-y-4">
      {events.map((event) => {
        const date = event.date.toDate()
        const dateString = date.toLocaleDateString(undefined, dateOptions)

        return (
          <Link
            to={`/events/${event.id}`}
            className="border block border-gray-200 p-5 cursor-pointer transition hover:border-gray-300 hover:shadow-lg"
            key={event.id}
          >
            <div className="flex justify-between items-center">
              <h3>{event.title}</h3>
              <time dateTime={date.toISOString()} className="text-sm">
                {dateString}
              </time>
            </div>
            <Divider className="!my-4" />
            <div className="max-h-36 overflow-y-auto text-sm">
              <RenderMarkdown source={event.description} />
            </div>
          </Link>
        )
      })}
    </ul>
  )
}
