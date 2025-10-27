// import { Button, Divider, notification, Popconfirm, Spin } from 'antd'
// import React, { Component } from 'react'
// import { Link } from 'react-router-dom'
// import { removeEvent } from '../../../services/db'
// import { AumtEvent } from '../../../types'
// import AdminStore from '../AdminStore'
// import './ManageEvents.css'

// interface ManageEventsProps {
//   events: AumtEvent[]
// }

// interface ManageEventsState {
//   loadingEvents: boolean
//   events: AumtEvent[]
//   removingEvent: {
//     [eventId: string]: boolean
//   }
// }

// export class ManageEvents extends Component<
//   ManageEventsProps,
//   ManageEventsState
// > {
//   constructor(props: ManageEventsProps) {
//     super(props)
//     this.state = {
//       loadingEvents: false,
//       events: [],
//       removingEvent: {},
//     }
//   }

//   componentDidMount() {
//     if (!this.props.events.length) {
//       this.setState({ ...this.state, loadingEvents: true })
//       AdminStore.requestEvents()
//     } else {
//       this.handleNewEvents(this.props.events)
//     }
//   }

//   componentDidUpdate = (
//     prevProps: ManageEventsProps,
//     prevState: ManageEventsState
//   ) => {
//     if (this.props.events !== prevProps.events) {
//       this.setState({ ...this.state, loadingEvents: false }, () => {
//         this.handleNewEvents(this.props.events)
//       })
//     }
//   }

//   handleNewEvents = (events: AumtEvent[]) => {
//     this.setState({
//       ...this.state,
//       events: events.slice().sort((a, b) => (a.date > b.date ? -1 : 1)),
//     })
//   }

//   removeEvent = (eventId: string) => {
//     this.setState({
//       ...this.state,
//       removingEvent: Object.assign(this.state.removingEvent, {
//         [eventId]: true,
//       }),
//     })
//     removeEvent(eventId)
//       .then(() => {
//         this.setState({
//           ...this.state,
//           removingEvent: Object.assign(this.state.removingEvent, {
//             [eventId]: false,
//           }),
//         })
//       })
//       .catch((err) => {
//         notification.open({
//           message: 'Error removing event: ' + err.toString(),
//         })
//         this.setState({
//           ...this.state,
//           removingEvent: Object.assign(this.state.removingEvent, {
//             [eventId]: false,
//           }),
//         })
//       })
//   }

//   render() {
//     if (this.state.loadingEvents) {
//       return (
//         <div>
//           Loading Events <Spin />
//         </div>
//       )
//     } else if (!this.state.events.length) {
//       return <p>No Events in DB</p>
//     }
//     return (
//       <div className="manageEventsContainer">
//         {this.state.events.map((event) => {
//           return (
//             <div className="eachEventManager" key={event.id}>
//               <div className="eventManageHeader">
//                 <h4 className="manageEventTitle">{event.title}</h4>
//                 <div className="manageEventOptions">
//                   {event.signups ? (
//                     <Link to={`/admin/events/${event.id}`}>
//                       <Button className="manageEventOptionButton">
//                         View Signups
//                       </Button>
//                     </Link>
//                   ) : (
//                     ''
//                   )}
//                   <Link to={`/admin/editevent/${event.id}`}>
//                     <Button className="manageEventOptionButton">Edit</Button>
//                   </Link>
//                   <Popconfirm
//                     title="Confirm Delete Event?"
//                     onConfirm={(e) => this.removeEvent(event.id)}
//                   >
//                     <Button
//                       className="manageEventOptionButton"
//                       loading={this.state.removingEvent[event.id]}
//                       danger
//                       type="primary"
//                     >
//                       Remove
//                     </Button>
//                   </Popconfirm>
//                 </div>
//                 <div className="clearBoth"></div>
//               </div>
//               <Divider />
//             </div>
//           )
//         })}
//       </div>
//     )
//   }
// }

import { Button, Divider, notification, Popconfirm, Spin } from 'antd'
import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { removeEvent } from '../../../services/db'
import { AumtEvent } from '../../../types'
import AdminStore from '../AdminStore'
import './ManageEvents.css'

interface ManageEventsProps {
  events: AumtEvent[]
}

export default function ManageEvents(props: ManageEventsProps) {
  const [removingEvent, setRemovingEvent] = useState<{
    [eventId: string]: boolean
  }>({})

  const events = props.events.slice().sort((a, b) => (a.date > b.date ? -1 : 1))
  const loadingEvents = !props.events.length

  useEffect(() => {
    AdminStore.requestEvents()
  }, [])

  async function handleRemoveEvent(eventId: string) {
    setRemovingEvent((prev) => ({ ...prev, [eventId]: true }))
    try {
      await removeEvent(eventId)
      setRemovingEvent((prev) => ({ ...prev, [eventId]: false }))
    } catch (error) {
      notification.open({
        message: 'Error removing event: ' + error.toString(),
      })
    }
  }

  if (loadingEvents) {
    return (
      <div>
        Loading Events <Spin />
      </div>
    )
  }

  return (
    <div className="manageEventsContainer">
      {events.map((event) => {
        return (
          <div className="eachEventManager" key={event.id}>
            <div className="eventManageHeader">
              <h4 className="manageEventTitle">{event.title}</h4>
              <div className="manageEventOptions">
                {event.signups && (
                  <Link to={`/admin/events/${event.id}`}>
                    <Button className="manageEventOptionButton">
                      View Signups
                    </Button>
                  </Link>
                )}
                <Link to={`/admin/editevent/${event.id}`}>
                  <Button className="manageEventOptionButton">Edit</Button>
                </Link>
                <Popconfirm
                  title="Confirm Delete Event?"
                  onConfirm={() => handleRemoveEvent(event.id)}
                >
                  <Button
                    className="manageEventOptionButton"
                    loading={removingEvent[event.id]}
                    danger
                    type="primary"
                  >
                    Remove
                  </Button>
                </Popconfirm>
              </div>
              <div className="clearBoth"></div>
            </div>
            <Divider />
          </div>
        )
      })}
    </div>
  )
}
