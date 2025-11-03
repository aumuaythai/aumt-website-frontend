import { Divider } from 'antd'
import { Link } from 'react-router'
import { AumtEvent } from '../../types'
import { RenderMarkdown } from '../utility/RenderMarkdown'

interface EventListProps {
  events: AumtEvent[]
}

const dateOptions: Intl.DateTimeFormatOptions = {
  weekday: 'long',
  year: 'numeric',
  month: 'long',
  day: 'numeric',
}

export default function EventsList(props: EventListProps) {
  if (props.events.length === 0) {
    return <p>There are no club events up at this time</p>
  }

  return (
    <ul className="flex flex-col gap-y-4">
      {props.events.map((event) => {
        const dateString = event.date.toLocaleDateString(undefined, dateOptions)

        return (
          <Link
            to={`/events/${event.id}`}
            className="border block border-gray-200 p-5 cursor-pointer transition hover:border-gray-300 hover:shadow-lg"
            key={event.id}
          >
            <div className="flex justify-between items-center">
              <h3>{event.title}</h3>
              <time dateTime={event.date.toISOString()}>{dateString}</time>
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
