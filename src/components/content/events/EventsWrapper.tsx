import { Alert, Spin } from 'antd'
import { useEffect, useState } from 'react'
import { Link, Route, RouteComponentProps, Switch } from 'react-router-dom'
import { useAuth } from '../../../context/AuthProvider'
import { getAllEvents } from '../../../services/db'
import { AumtEvent } from '../../../types'
import { Event } from './Event'
import EventsList from './EventsList'
import './EventsWrapper.css'

export default function EventsWrapperWithoutRouter() {
  const { authedUser } = useAuth()

  const [upcomingEvents, setUpcomingEvents] = useState<AumtEvent[]>([])
  const [pastEvents, setPastEvents] = useState<AumtEvent[]>([])
  const [errorMessage, setErrorMessage] = useState<string>('')
  const [loadingEvents, setLoadingEvents] = useState<boolean>(false)

  useEffect(() => {
    async function loadEvents() {
      try {
        const events = await getAllEvents()
        const currentDate = new Date()
        setErrorMessage('')
        setPastEvents(
          events
            .filter((e) => e.date < currentDate)
            .sort((a, b) => (a.date < b.date ? 1 : -1))
        )
        setUpcomingEvents(
          events
            .filter((e) => e.date >= currentDate)
            .sort((a, b) => (a.date > b.date ? 1 : -1))
        )
        setLoadingEvents(false)
      } catch (err) {
        setPastEvents([])
        setUpcomingEvents([])
        setErrorMessage(err.toString())
        setLoadingEvents(false)
      }
    }

    setErrorMessage('')
    setLoadingEvents(true)
    loadEvents()
  }, [])

  const renderEvent = (routerProps: RouteComponentProps) => {
    const { eventId }: any = routerProps.match.params
    if (!eventId) {
      return (
        <p>
          Error displaying event -{' '}
          <Link to="/events">Go Back to events page</Link>
        </p>
      )
    }
    const foundEvent = upcomingEvents
      .concat(pastEvents)
      .find((a) => a.urlPath === eventId)
    if (foundEvent) {
      return <Event authedUser={authedUser} event={foundEvent}></Event>
    }
    return (
      <p>
        Error displaying event -{' '}
        <Link to="/events">Go Back to events page</Link>
      </p>
    )
  }

  if (errorMessage) {
    return <Alert message={errorMessage} type="error"></Alert>
  } else if (loadingEvents) {
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
          path="/events/:eventId"
          render={(routerProps) => renderEvent(routerProps)}
        />
        <Route path="/events">
          <div className="eventsListWrapper">
            <div className="eventsListContainer upcomingEventsContainer">
              <h2>Upcoming Events</h2>
              {upcomingEvents.length ? (
                <EventsList events={upcomingEvents}></EventsList>
              ) : (
                <p>
                  There are no upcoming club events at this time. Please check
                  our Facebook page.
                </p>
              )}
            </div>
            <div className="eventsListContainer">
              <h2>Past Events</h2>
              {pastEvents.length ? (
                <EventsList events={pastEvents}></EventsList>
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
