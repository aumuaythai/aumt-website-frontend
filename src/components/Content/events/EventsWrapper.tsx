import React, {Component} from 'react'
import {EventsList} from './EventsList'
import './EventsWrapper.css'
import { AumtEvent } from '../../../types'

interface EventWrapperProps {
}

interface EventWrapperState {
    upcomingEvents: AumtEvent[]
    pastEvents: AumtEvent[]
}

export class EventWrapper extends Component<EventWrapperProps, EventWrapperState> {
    constructor(props: EventWrapperProps) {
        super(props)
        this.state = {
            upcomingEvents: [],
            pastEvents: []
        }
    }
    componentDidMount() {
        // TODO: get events from database
        this.setState({
            ...this.state,
            upcomingEvents: [{
                title: 'First AUMT Dinner',
                id: '203490f9wnf',
                description: `Come join us next Wednesday for dinner at the food court by Aotea Sqaure for some tasty grub. We will continue on to either shadows or the arcade depending on what people are feeling and there are rumours of a tab provided by the club...

                Busy? Meet up with us later at the arcade or shadows anyways`,
                fbLink: 'https://www.facebook.com/events/209300303470732/',
                date: new Date(2020, 1, 25, 19),
                urlPath: 'first-dinner',
                location: 'Sky World Entertainment Centre'
            }]
        })
    }
    render() {
        return (<div>
            <div className="eventsListContainer upcomingEventsContainer">
                <h2>Upcoming Events</h2>
                {this.state.upcomingEvents.length ?
                <EventsList events={this.state.upcomingEvents}></EventsList> :
                <p>There are no upcoming club events at this time. Please check our Facebook page.</p>}
            </div>
            <div className="eventsListContainer">
                <h2>Past Events</h2>
                {this.state.pastEvents.length ?
                <EventsList events={this.state.pastEvents}></EventsList> :
                <p>There are no past club events up now</p>}
            </div>
        </div>)
    }
}