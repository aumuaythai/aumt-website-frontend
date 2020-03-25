import React, {Component} from 'react'
import { RouteComponentProps, Switch, Route, withRouter, Link } from 'react-router-dom';
import EventsList from './EventsList'
import { Event } from './Event'
import './EventsWrapper.css'
import { AumtEvent } from '../../../types'

interface EventWrapperProps extends RouteComponentProps {
    
}

interface EventWrapperState {
    upcomingEvents: AumtEvent[]
    pastEvents: AumtEvent[]
}

export class EventsWrapperWithoutRouter extends Component<EventWrapperProps, EventWrapperState> {
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
            }, {
                title: '2020 Omori Retreat',
                id: 's0df80e9f',
                description: `
                Camp is back and we're so excited to for you to come with us! We promise a week of high-quality training to help you achieve peak form, Huka Prawn Park, and a cute pupper for you to swoon over.`,
                date: new Date(2020, 5, 17),
                urlPath: 'camp2020',
                location: 'Taupo, NZ'
            }]
        })
    }
    renderEvent = (routerProps: RouteComponentProps) => {
        const {eventId}: any = routerProps.match.params
        if (!eventId) {
            return (<p>Error displaying event - <Link to='/events'>Go Back to events page</Link></p>)
        }
        const foundEvent = this.state.upcomingEvents.concat(this.state.pastEvents).find((a) => a.urlPath === eventId)
        if (foundEvent) {
            return <Event
                    urlPath={foundEvent.urlPath}
                    description={foundEvent.description}
                    date={foundEvent.date}
                    fbLink={foundEvent.fbLink}
                    location={foundEvent.location}
                    title={foundEvent.title}
                    id={foundEvent.id}
                ></Event>
        }
        return (<p>Error displaying event - <Link to='/events'>Go Back to events page</Link></p>)        
    }
    render() {
        const { path } = this.props.match;

        return (
        <div>
            <Switch>
                <Route path={`${path}/:eventId`} render={routerProps => this.renderEvent(routerProps)}/>
                <Route path={path}>
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
                </Route>
            </Switch>
        </div>
        )
    }
}

export default withRouter(EventsWrapperWithoutRouter)