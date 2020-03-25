import React, {Component} from 'react'
import { withRouter, RouteComponentProps } from 'react-router-dom'
import { Divider } from 'antd'
import { AumtEvent } from '../../../types'
import './EventsList.css'

interface EventListProps extends RouteComponentProps {
    events: AumtEvent[]
}

interface EventListState {
    
}

class EventsList extends Component<EventListProps, EventListState> {
    onEventClick = (eventPath: string) => {
        this.props.history.push(`/events/${eventPath}`)
    }
    render() {
        if (this.props.events.length === 0) {
            return (<p>There are no club events up at this time</p>)
        }
        return (<div className='eventsListContainer'>
            {this.props.events.map((event) => {
                const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
                const dateString = event.date.toLocaleDateString(undefined, options)
                return (
                    <div className='eventPreviewContainer' key={event.id} onClick={e => this.onEventClick(event.urlPath)}>
                        <div className="eventPreviewHeader">
                            <h3 className="eventPreviewTitle">{event.title}</h3>
                            <div className="eventPreviewDateContainer">
                                {dateString}
                            </div>
                        </div>
                        <Divider></Divider>
                        <div className='eventPreviewBody'>
                            <p className="eventPreviewDescription">{event.description}</p>
                        </div>
                    </div>
                )
            })}
        </div>)
    }
}
export default withRouter(EventsList)