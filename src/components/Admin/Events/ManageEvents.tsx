import React, {Component} from 'react'
import { Link } from 'react-router-dom'
import { Spin, Popconfirm, Alert, Button, notification, Divider } from 'antd'
import './ManageEvents.css'
import { AumtEvent } from '../../../types'
import db from '../../../services/db'
import AdminStore from '../AdminStore'


interface ManageEventsProps {
    events: AumtEvent[]
}

interface ManageEventsState {
    loadingEvents: boolean
    events: AumtEvent[]
    removingEvent: {
        [eventId: string]: boolean
    }
}

export class ManageEvents extends Component<ManageEventsProps, ManageEventsState> {
    constructor(props: ManageEventsProps) {
        super(props)
        this.state = {
            loadingEvents: false,
            events: [],
            removingEvent: {}
        }
    }

    componentDidMount() {
        if (!this.props.events.length) {
            this.setState({...this.state, loadingEvents: true})
            AdminStore.requestEvents()
        } else {
            this.handleNewEvents(this.props.events)
        }

    }

    componentDidUpdate = (prevProps: ManageEventsProps, prevState: ManageEventsState) => {
        if (this.props.events !== prevProps.events) {
            this.setState({...this.state, loadingEvents: false}, () => {
                this.handleNewEvents(this.props.events)
            })
        }
    }

    handleNewEvents = (events: AumtEvent[]) => {
        this.setState({
            ...this.state,
            events: events.slice()
        })
    }

    removeEvent = (eventId: string) => {
        this.setState({
            ...this.state,
            removingEvent: Object.assign(this.state.removingEvent, {
                [eventId]: true
            })
        })
        db.removeEvent(eventId)
            .then(() => {
                this.setState({
                    ...this.state,
                    removingEvent: Object.assign(this.state.removingEvent, {
                        [eventId]: false
                    })
                })
            })
            .catch((err) => {
                notification.open({
                    message: 'Error removing event: ' + err.toString()
                })
                this.setState({
                    ...this.state,
                    removingEvent: Object.assign(this.state.removingEvent, {
                        [eventId]: false
                    })
                })
            })
    }

    render() {
        if (this.state.loadingEvents) {
            return (<div>Loading Events <Spin/></div>)
        } else if (!this.state.events.length) {
            return (<p>No Events in DB</p>)
        }
        return (
            <div className='manageEventsContainer'>
                {this.state.events.map((event) => {
                    return (
                        <div className="eachEventManager" key={event.id}>
                            <div className="eventManageHeader">
                                <h4 className='manageEventTitle'>
                                    {event.title}
                                </h4>
                                <div className='manageEventOptions'>
                                    <Link to={`/admin/editevent/${event.id}`}>
                                        <Button className='manageEventOptionButton'>Edit</Button>
                                    </Link>
                                    <Popconfirm title='Confirm Delete Event?' onConfirm={e => this.removeEvent(event.id)}>
                                        <Button className='manageEventOptionButton' loading={this.state.removingEvent[event.id]} type='danger'>Remove</Button>
                                    </Popconfirm>
                                </div>
                                <div className="clearBoth"></div>
                            </div>
                            <Divider/>
                        </div>
                    )
                })}
            </div>
        )
    }
}