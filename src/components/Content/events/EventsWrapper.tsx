import { Alert, Spin } from 'antd'
import React, { Component } from 'react'
import {
  Link,
  Route,
  RouteComponentProps,
  Switch,
  withRouter,
} from 'react-router-dom'
import { getAllEvents } from '../../../services/db'
import { AumtEvent, AumtMember } from '../../../types'
import { Event } from './Event'
import EventsList from './EventsList'
import './EventsWrapper.css'

interface EventWrapperProps extends RouteComponentProps {
  authedUser: AumtMember | null
}

interface EventWrapperState {
  upcomingEvents: AumtEvent[]
  pastEvents: AumtEvent[]
  errorMessage: string
  loadingEvents: boolean
}

class EventsWrapperWithoutRouter extends Component<
  EventWrapperProps,
  EventWrapperState
> {
  constructor(props: EventWrapperProps) {
    super(props)
    this.state = {
      upcomingEvents: [],
      pastEvents: [],
      errorMessage: '',
      loadingEvents: false,
    }
  }
  componentDidMount() {
    this.setState({
      ...this.state,
      errorMessage: '',
      loadingEvents: true,
    })
    getAllEvents()
      .then((events: AumtEvent[]) => {
        const currentDate = new Date()
        this.setState({
          ...this.state,
          errorMessage: '',
          pastEvents: events
            .filter((e) => e.date < currentDate)
            .sort((a, b) => (a.date < b.date ? 1 : -1)),
          upcomingEvents: events
            .filter((e) => e.date >= currentDate)
            .sort((a, b) => (a.date > b.date ? 1 : -1)),
          loadingEvents: false,
        })
      })
      .catch((err) => {
        this.setState({
          pastEvents: [],
          upcomingEvents: [],
          errorMessage: err.toString(),
          loadingEvents: false,
        })
      })
  }
  renderEvent = (routerProps: RouteComponentProps) => {
    const { eventId }: any = routerProps.match.params
    if (!eventId) {
      return (
        <p>
          Error displaying event -{' '}
          <Link to="/events">Go Back to events page</Link>
        </p>
      )
    }
    const foundEvent = this.state.upcomingEvents
      .concat(this.state.pastEvents)
      .find((a) => a.urlPath === eventId)
    if (foundEvent) {
      return (
        <Event authedUser={this.props.authedUser} event={foundEvent}></Event>
      )
    }
    return (
      <p>
        Error displaying event -{' '}
        <Link to="/events">Go Back to events page</Link>
      </p>
    )
  }
  render() {
    const { path } = this.props.match
    if (this.state.errorMessage) {
      return <Alert message={this.state.errorMessage} type="error"></Alert>
    } else if (this.state.loadingEvents) {
      return (
        <div className="retrievingEventsText">
          Retrieving Events <Spin />
        </div>
      )
    }

    return (
      <div className="eventsWrapper">
        <Switch>
          <Route
            path={`${path}/:eventId`}
            render={(routerProps) => this.renderEvent(routerProps)}
          />
          <Route path={path}>
            <div className="eventsListWrapper">
              <div className="eventsListContainer upcomingEventsContainer">
                <h2>Upcoming Events</h2>
                {this.state.upcomingEvents.length ? (
                  <EventsList events={this.state.upcomingEvents}></EventsList>
                ) : (
                  <p>
                    There are no upcoming club events at this time. Please check
                    our Facebook page.
                  </p>
                )}
              </div>
              <div className="eventsListContainer">
                <h2>Past Events</h2>
                {this.state.pastEvents.length ? (
                  <EventsList events={this.state.pastEvents}></EventsList>
                ) : (
                  <p>There are no past club events up now</p>
                )}
              </div>
            </div>
          </Route>
        </Switch>
      </div>
    )
  }
}

export default withRouter(EventsWrapperWithoutRouter)
