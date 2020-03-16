import React, {Component} from 'react'
import { Divider } from 'antd'
import { AumtEvent } from '../../../types'
import './EventsList.css'

interface EventListProps {
    events: AumtEvent[]
}

interface EventListState {
    
}

export class EventsList extends Component<EventListProps, EventListState> {
    render() {
        if (this.props.events.length === 0) {
            return (<p>There are no club events up at this time</p>)
        }
        return (<div className='eventsListContainer'>
            {this.props.events.map((event) => {
                const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
                const dateString = event.date.toLocaleDateString(undefined, options)
                return (<div key={event.id} className='eventPreviewContainer'>
                    <div className="eventHeader">
                        <h3 className="eventTitle">{event.title}</h3>
                        <div className="eventDateContainer">
                            {dateString}
                            {/* <span className='locationIcon'>
                                <svg width="24" height="24" xmlns="http://www.w3.org/2000/svg" fill-rule="evenodd" clip-rule="evenodd"><path d="M12 10c-1.104 0-2-.896-2-2s.896-2 2-2 2 .896 2 2-.896 2-2 2m0-5c-1.657 0-3 1.343-3 3s1.343 3 3 3 3-1.343 3-3-1.343-3-3-3m-7 2.602c0-3.517 3.271-6.602 7-6.602s7 3.085 7 6.602c0 3.455-2.563 7.543-7 14.527-4.489-7.073-7-11.072-7-14.527m7-7.602c-4.198 0-8 3.403-8 7.602 0 4.198 3.469 9.21 8 16.398 4.531-7.188 8-12.2 8-16.398 0-4.199-3.801-7.602-8-7.602"/></svg>
                            </span> */}
                        </div>
                    </div>
                    <Divider></Divider>
                    <div className='eventBody'>
                        <p className="eventDescription">{event.description}{event.description}{event.description}</p>
                    </div>
                </div>)
            })}
        </div>)
    }
}