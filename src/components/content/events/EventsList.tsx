import { Divider } from 'antd'
import React, { Component } from 'react'
import { RouteComponentProps, withRouter } from 'react-router-dom'
import { AumtEvent } from '../../../types'
import { RenderMarkdown } from '../../utility/RenderMarkdown'

interface EventListProps extends RouteComponentProps {
  events: AumtEvent[]
}

interface EventListState {}

class EventsList extends Component<EventListProps, EventListState> {
  onEventClick = (eventPath: string) => {
    this.props.history.push(`/events/${eventPath}`)
  }
  render() {
    if (this.props.events.length === 0) {
      return <p>There are no club events up at this time</p>
    }
    return (
      <div className="max-w-[800px] !mx-auto px-[30px]">
        {this.props.events.map((event) => {
          const options: Intl.DateTimeFormatOptions = {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
          }
          const dateString = event.date.toLocaleDateString(undefined, options)
          return (
            <div
              className="border border-gray-200 p-5 cursor-pointer transition mb-5 hover:border-gray-300 duration-100 hover:shadow-lg"
              key={event.id}
              onClick={(e) => this.onEventClick(event.urlPath)}
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
            </div>
          )
        })}
      </div>
    )
  }
}
export default withRouter(EventsList)
