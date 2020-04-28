import React, {Component} from 'react'
import { RouteComponentProps, Switch, Route, withRouter, Link } from 'react-router-dom';
import { Spin, Alert } from 'antd';
import EventsList from './EventsList'
import {Event} from './Event'
import './EventsWrapper.css'
import { AumtEvent } from '../../../types'
import db from '../../../services/db';

interface EventWrapperProps extends RouteComponentProps {
    
}

interface EventWrapperState {
    upcomingEvents: AumtEvent[]
    pastEvents: AumtEvent[]
    errorMessage: string
    loadingEvents: boolean
}

class EventsWrapperWithoutRouter extends Component<EventWrapperProps, EventWrapperState> {
    constructor(props: EventWrapperProps) {
        super(props)
        this.state = {
            upcomingEvents: [],
            pastEvents: [],
            errorMessage: '',
            loadingEvents: false
        }
    }
    componentDidMount() {
        this.setState({
            ...this.state,
            errorMessage: '',
            loadingEvents: true
        })
        db.getAllEvents()
            .then((events: AumtEvent[]) => {
                const currentDate = new Date()
                this.setState({
                    ...this.state,
                    errorMessage: '',
                    pastEvents: events.filter(e => e.date < currentDate),
                    upcomingEvents: events.filter(e => e.date >= currentDate),
                    loadingEvents: false
                })
            })
            .catch((err) => {
                this.setState({
                    pastEvents: [],
                    upcomingEvents: [],
                    errorMessage: err.toString(),
                    loadingEvents: false
                })
            })
    }
    renderEvent = (routerProps: RouteComponentProps) => {
        const {eventId}: any = routerProps.match.params
        if (!eventId) {
            return (<p>Error displaying event - <Link to='/events'>Go Back to events page</Link></p>)
        }
        const foundEvent = this.state.upcomingEvents.concat(this.state.pastEvents).find((a) => a.urlPath === eventId)
        if (foundEvent) {
            return (<Event
                    photoPath={foundEvent.photoPath}
                    urlPath={foundEvent.urlPath}
                    description={foundEvent.description}
                    date={foundEvent.date}
                    fbLink={foundEvent.fbLink}
                    eventLocation={foundEvent.location}
                    title={foundEvent.title}
                    id={foundEvent.id}
                ></Event>)
        }
        return (<p>Error displaying event - <Link to='/events'>Go Back to events page</Link></p>)        
    }
    render() {
        const { path } = this.props.match;
        if (this.state.errorMessage) {
            return (<Alert message={this.state.errorMessage} type='error'></Alert>)
        } else if (this.state.loadingEvents) {
            return (<div className='retrievingEventsText'>Retrieving Events <Spin/></div>)
        }

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