import React, {Component} from 'react'
import { Link, withRouter, RouteComponentProps } from 'react-router-dom'
import { Spin, Button, notification, Input } from 'antd'
import { PlusOutlined, ArrowLeftOutlined } from '@ant-design/icons'
import './EventSignups.css'
import { AumtEvent } from '../../../types'
import AdminStore from '../AdminStore'
import { EventSignupTable } from './EventSignupTable'
import db from '../../../services/db'


interface EventSignupsProps extends RouteComponentProps {
    events: AumtEvent[]
}

interface EventSignupsState {
    event: AumtEvent | null
    loadingEvents: boolean
    addingMember: boolean
    signupMemberName: string
    signupMemberEmail: string
    addingWaitlistMember: boolean
    waitlistMemberName: string
    waitlistMemberEmail: string
}

class EventSignups extends Component<EventSignupsProps, EventSignupsState> {
    private signupNameInput: Input | null = null
    constructor(props: EventSignupsProps) {
        super(props)
        this.state = {
            event: null,
            loadingEvents: false,
            addingMember: false,
            signupMemberName: '',
            signupMemberEmail: '',
            addingWaitlistMember: false,
            waitlistMemberName: '',
            waitlistMemberEmail: ''
        }
    }

    generateMockUid = () => {
        let alphabet = '1234567890qwertyuiopasdfghjklzxcvbnm'
        let uid = 'NONMEMBER'
        for (let i = 0; i < 10; i++) {
            uid += alphabet[Math.floor(Math.random() * alphabet.length)]
        }
        return uid
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

    addMemberClick = () => {
        this.setState({...this.state, addingMember: true})
        if (this.signupNameInput) {
            this.signupNameInput.focus()
        }
    }

    onCancelAddMember = () => {
        this.setState({...this.state, addingMember: false})
    }

    signupNameChange = (name: string) => {
        this.setState({...this.state, signupMemberName: name})
    }

    signupEmailChange = (email: string) => {
        this.setState({...this.state, signupMemberEmail: email})
    }

    addWaitlistMemberClick = () => {
        this.setState({...this.state, addingWaitlistMember: true})
    }

    onCancelAddWaitlistMember = () => {
        this.setState({...this.state, addingWaitlistMember: false})
    }

    waitlistNameChange = (name: string) => {
        this.setState({...this.state, waitlistMemberName: name})
    }

    waitlistEmailChange = (email: string) => {
        this.setState({...this.state, waitlistMemberEmail: email})
    }

    signUpNewMember = () => {
        if (!this.state.signupMemberName) {
            return notification.error({message: 'Name required'})
        }
        if (!this.state.signupMemberEmail) {
            return notification.error({message: 'Email required'})
        }
        if (!this.state.event) {
            return
        }
        db.signUpToEvent(this.state.event?.id, this.generateMockUid(), {
            confirmed: false,
            timeSignedUpMs: new Date().getTime(),
            displayName: this.state.signupMemberName,
            email: this.state.signupMemberEmail
        }, false)
            .then(() => {
                notification.success({message: `Successfully signed up ${this.state.signupMemberName}`})
            })
            .catch((err) => {
                notification.error({message: `Error signing up to event: ${err.toString()}`})
            })
    }

    waitlistNewMember = () => {
        if (!this.state.waitlistMemberName) {
            return notification.error({message: 'Name required'})
        }
        if (!this.state.waitlistMemberEmail) {
            return notification.error({message: 'Email required'})
        }
        if (!this.state.event) {
            return
        }
        db.signUpToEvent(this.state.event.id, this.generateMockUid(), {
            confirmed: false,
            timeSignedUpMs: new Date().getTime(),
            displayName: this.state.waitlistMemberName,
            email: this.state.waitlistMemberEmail
        }, true)
            .then(() => {
                notification.success({message: `Successfully added ${this.state.waitlistMemberName} to waitlist`})
            })
            .catch((err) => {
                notification.error({message: `Error signing up to event: ${err.toString()}`})
            })
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
                        <Button className='eventSignupMemberDisplayAddButton' type='primary' shape='round' onClick={this.addMemberClick}><PlusOutlined/>Add Member</Button>
                        <div className="clearBoth"></div>
                        {this.state.addingMember ? 
                            <div className="eventSignupsAddMemberContainer">
                                <Input
                                    placeholder={'Name'}
                                    ref={(input) => { this.signupNameInput = input; }}
                                    onChange={e => this.signupNameChange(e.target.value)}
                                    className='eventSignupsAddMemberInput'/>
                                <Input
                                    placeholder={'Email'}
                                    // ref={(input) => { this.signupNameInput = input; }}
                                    onChange={e => this.signupEmailChange(e.target.value)}
                                    className='eventSignupsAddMemberInput'
                                    onPressEnter={this.signUpNewMember}/>
                                <Button onClick={this.signUpNewMember}>Add</Button>
                                <Button onClick={this.onCancelAddMember} type='link'>Cancel</Button>
                            </div>
                        : ''}
                        <EventSignupTable isWaitlist={false} eventId={this.state.event.id} signupData={this.state.event.signups.members}></EventSignupTable>
                        <div className="eventSignupsTableFooter">
                            Total: {Object.keys(this.state.event.signups.members).length} Limit: {this.state.event.signups.limit || 'None'}
                        </div>
                    </div>
                </div>
                <div className="eventSignupsMemberDisplaySection">
                    <div className="eventSignupMemberDisplayHeader">
                        <h3 className='eventSignupMemberDisplayTitle'>Waitlist</h3>
                        <Button className='eventSignupMemberDisplayAddButton' type='primary' shape='round' onClick={this.addWaitlistMemberClick}><PlusOutlined/>Add Member</Button>
                        <div className="clearBoth"></div>
                        {this.state.addingWaitlistMember ? 
                            <div className="eventSignupsAddMemberContainer">
                                <Input
                                    placeholder={'Name'}
                                    // ref={(input) => { this.signupNameInput = input; }}
                                    onChange={e => this.waitlistNameChange(e.target.value)}
                                    className='eventSignupsAddMemberInput'/>
                                <Input
                                    placeholder={'Email'}
                                    // ref={(input) => { this.signupNameInput = input; }}
                                    onChange={e => this.waitlistEmailChange(e.target.value)}
                                    className='eventSignupsAddMemberInput'
                                    onPressEnter={this.waitlistNewMember}
                                    />
                                <Button onClick={this.waitlistNewMember}>Add</Button>
                                <Button onClick={this.onCancelAddWaitlistMember} type='link'>Cancel</Button>
                            </div>
                        : ''}
                        <EventSignupTable isWaitlist={true} eventId={this.state.event.id} signupData={this.state.event.signups.waitlist}></EventSignupTable>
                    </div>
                </div>
            </div>
        )
    }
}

export default withRouter(EventSignups)