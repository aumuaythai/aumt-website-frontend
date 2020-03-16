import React, {Component} from 'react'
import { useHistory, withRouter, RouteComponentProps } from 'react-router-dom'
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
                        <div className="eventHeader">
                            <h3 className="eventTitle">{event.title}</h3>
                            <div className="eventDateContainer">
                                {dateString}
                            </div>
                        </div>
                        <Divider></Divider>
                        <div className='eventBody'>
                            <p className="eventDescription">{event.description}</p>
                        </div>
                    </div>
                )
            })}
        </div>)
    }
}
export default withRouter(EventsList)