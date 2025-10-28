import { Divider } from 'antd'
import React, { Component } from 'react'
import { Link } from 'react-router'
import { AumtEvent } from '../../../types'
import { RenderMarkdown } from '../../utility/RenderMarkdown'

interface EventListProps {
  events: AumtEvent[]
}

export default function EventsList(props: EventListProps) {
  if (props.events.length === 0) {
    return <p>There are no club events up at this time</p>
  }

  return (
    <div className="max-w-[800px] !mx-auto px-[30px]">
      {props.events.map((event) => {
        const options: Intl.DateTimeFormatOptions = {
          weekday: 'long',
          year: 'numeric',
          month: 'long',
          day: 'numeric',
        }
        const dateString = event.date.toLocaleDateString(undefined, options)
        return (
          <Link
            to={`/events/${event.id}`}
            className="border block border-gray-200 p-5 cursor-pointer transition mb-5 hover:border-gray-300 duration-100 hover:shadow-lg"
            key={event.id}
          >
            <div className="eventPreviewHeader">
              <h3 className="min-w-[calc(100%-200px)] float-left text-left">
                {event.title}
              </h3>
              <div className="max-w-[200px] float-left mt-[3px] text-clip">
                {dateString}
              </div>
            </div>
            <Divider></Divider>
            <div className="max-h-[100px] overflow-y-auto text-left">
              <div className="eventPreviewDescription">
                <RenderMarkdown source={event.description}></RenderMarkdown>
              </div>
            </div>
          </Link>
        )
      })}
    </div>
  )
}
