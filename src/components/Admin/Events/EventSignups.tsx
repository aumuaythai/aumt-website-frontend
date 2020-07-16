import React, {Component} from 'react'
import { Link, withRouter, RouteComponentProps } from 'react-router-dom'
import { Spin, Button, notification } from 'antd'
import { PlusOutlined, ArrowLeftOutlined } from '@ant-design/icons'
import './EventSignups.css'
import { AumtEvent } from '../../../types'
import db from '../../../services/db'
import AdminStore from '../AdminStore'
import { EventSignupTable } from './EventSignupTable'


interface EventSignupsProps extends RouteComponentProps {
    events: AumtEvent[]
}

interface EventSignupsState {
    event: AumtEvent | null
    loadingEvents: boolean
}

class EventSignups extends Component<EventSignupsProps, EventSignupsState> {
    constructor(props: EventSignupsProps) {
        super(props)
        this.state = {
            event: null,
            loadingEvents: false
        }
    }

    componentDidMount = () => {
        if (!this.props.events.length) {
            this.setState({...this.state, loadingEvents: true})
            AdminStore.requestEvents()
        } else {
            this.handleNewEvents(this.props.events)
        }
    }

    componentDidUpdate = (prevProps: EventSignupsProps, prevState: EventSignupsState) => {
        if (this.props.events !== prevProps.events) {
            this.setState({...this.state, loadingEvents: false}, () => {
                this.handleNewEvents(this.props.events)
            })
        }
    }

    handleNewEvents = (events: AumtEvent[]) => {
        const paths = window.location.pathname.split('/')
        const pathEventIdx = paths.indexOf('events')
        if (pathEventIdx > -1) {
            const eventId = paths[pathEventIdx + 1]
            const foundEvent = events.find(e => e.id === eventId)
            if (foundEvent) {
                this.setState({
                    ...this.state,
                    event: foundEvent
                })
            } else {
                notification.error({message: 'Error retrieving event for id ' + eventId + ', redirecting to dashboard'})
                this.props.history.push('/admin/events')
            }
        }
    }

    render() {
        if (this.state.loadingEvents) {
            return <div className='eventSignupsSpinContainer'><Spin/></div>
        }
        if (!this.state.event || !this.state.event.signups) {
            return <div>No event with signups found</div>
        }
        return (
            <div className='eventSignupsContainer'>
                <h1 className='eventSignupsHeader'>
                        <Link className='mainAdminCreateBack' to='/admin/events'>
                        <ArrowLeftOutlined />
                    </Link>
                    {this.state.event?.title}</h1>
                <div className="eventSignupsMemberDisplaySection">
                    <div className="eventSignupMemberDisplayHeader">
                        <h3 className='eventSignupMemberDisplayTitle'>Signups</h3>
                        <Button className='eventSignupMemberDisplayAddButton' type='primary' shape='round'><PlusOutlined/>Add Member</Button>
                        <div className="clearBoth"></div>
                        <EventSignupTable signupData={this.state.event.signups.members}></EventSignupTable>
                    </div>
                </div>
                <div className="eventSignupsMemberDisplaySection">
                    <div className="eventSignupMemberDisplayHeader">
                        <h3 className='eventSignupMemberDisplayTitle'>Waitlist</h3>
                        <Button className='eventSignupMemberDisplayAddButton' type='primary' shape='round'><PlusOutlined/>Add Member</Button>
                        <div className="clearBoth"></div>
                        <EventSignupTable signupData={this.state.event.signups.waitlist}></EventSignupTable>
                    </div>
                </div>
            </div>
        )
    }
}

export default withRouter(EventSignups)