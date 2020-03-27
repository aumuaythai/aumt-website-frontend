import React, {Component} from 'react'
import { Popconfirm, Alert, Button, notification, Divider } from 'antd'
import { SyncOutlined } from '@ant-design/icons'
import './ManageEvents.css'
import {CreateEvent} from './CreateEvent'
import { AumtEvent } from '../../types'
import db from '../../services/db'


interface ManageEventsProps {
}

interface ManageEventsState {
    loadingEvents: boolean
    errorText: string
    events: AumtEvent[]
    editingEvent: {
        [eventId: string]: boolean
    },
    removingEvent: {
        [eventId: string]: boolean
    }
}

export class ManageEvents extends Component<ManageEventsProps, ManageEventsState> {
    constructor(props: ManageEventsProps) {
        super(props)
        this.state = {
            loadingEvents: false,
            errorText: '',
            events: [],
            editingEvent: {},
            removingEvent: {}
        }
    }

    componentDidMount() {
        this.getAllEvents()
    }

    getAllEvents = () => {
        this.setState({
            ...this.state,
            loadingEvents: true,
            events: [],
            errorText: ''
        })
        db.getAllEvents()
            .then((events: AumtEvent[]) => {
                this.setState({
                    ...this.state,
                    loadingEvents: false,
                    events,
                    errorText: ''
                })
            })
            .catch((err) => {
                this.setState({
                    ...this.state,
                    loadingEvents: false,
                    errorText: err.toString()
                })
            })
    }

    onEventEditClick = (eventId: string) => {
        this.setState({
            ...this.state,
            editingEvent: Object.assign(this.state.editingEvent, {[eventId]: !this.state.editingEvent[eventId]})
        })
    }

    onEventEditSubmit = (eventData: AumtEvent): Promise<void> => {
        return db.submitEvent(eventData)
    }

    removeEvent = (eventId: string) => {
        console.log('removing', eventId)
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
                this.getAllEvents()

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
        if (this.state.errorText) {
            return (<Alert type='error' message={this.state.errorText}></Alert>)
        } else if (this.state.loadingEvents) {
            return (<p>Loading Events <SyncOutlined spin/></p>)
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
                                    <Button onClick={e => this.onEventEditClick(event.id)}>
                                        {this.state.editingEvent[event.id] ? 'Cancel Edit' : 'Edit'}
                                    </Button>
                                    <Popconfirm title='Confirm Delete Event?' onConfirm={e => this.removeEvent(event.id)}>
                                        <Button loading={this.state.removingEvent[event.id]} type='danger'>Remove</Button>
                                    </Popconfirm>
                                </div>
                                <div className="clearBoth"></div>
                            </div>
                            {this.state.editingEvent[event.id] ?
                                (
                                    <div className="eventEditManage">
                                        <CreateEvent
                                            onCreateEventSubmit={this.onEventEditSubmit}
                                            defaultValues={event}
                                            ></CreateEvent>
                                    </div>
                                ) :
                                ''}
                            <Divider/>
                        </div>
                    )
                })}
            </div>
        )
    }
}