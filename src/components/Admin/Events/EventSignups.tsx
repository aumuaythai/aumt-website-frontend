import React, {Component} from 'react'
import { Link, withRouter, RouteComponentProps } from 'react-router-dom'
import { Spin, Button, notification, Input } from 'antd'
import { PlusOutlined, ArrowLeftOutlined } from '@ant-design/icons'
import './EventSignups.css'
import { AumtEvent, LicenseClasses } from '../../../types'
import AdminStore from '../AdminStore'
import { EventSignupTable } from './EventSignupTable'
import { CampSignupForm } from '../../Content/events/CampSignupForm'
import db from '../../../services/db'


interface EventSignupsProps extends RouteComponentProps {
    events: AumtEvent[]
}

interface EventSignupsState {
    event: AumtEvent | null
    loadingEvents: boolean
    addingMember: boolean
    addingWaitlistMember: boolean
    submittingMember: boolean
    submittingWaitlistMember: boolean
}

class EventSignups extends Component<EventSignupsProps, EventSignupsState> {
    private signupNameInput: Input | null = null
    constructor(props: EventSignupsProps) {
        super(props)
        this.state = {
            event: null,
            loadingEvents: false,
            addingMember: false,
            addingWaitlistMember: false,
            submittingMember: false,
            submittingWaitlistMember: false
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


    addWaitlistMemberClick = () => {
        this.setState({...this.state, addingWaitlistMember: true})
    }

    onCancelAddWaitlistMember = () => {
        this.setState({...this.state, addingWaitlistMember: false})
    }


    signUpNewMember = (signupData: {phoneNumber: string, dietaryRequirements?: string, medicalInfo?: string, seatsInCar?: number, license?: LicenseClasses, name?: string, email?: string}, isWaitlist: boolean) => {
        if (!signupData.name) {
            return notification.error({message: 'Name required'})
        }
        if (!signupData.email) {
            return notification.error({message: 'Email required'})
        }
        if (!this.state.event) {
            return
        }
        if (isWaitlist) {
            this.setState({...this.state, submittingWaitlistMember: true})
        } else {
            this.setState({...this.state, submittingMember: true})
        }

        db.signUpToEvent(this.state.event?.id, this.generateMockUid(), {
            confirmed: false,
            timeSignedUpMs: new Date().getTime(),
            displayName: signupData.name,
            email: signupData.email,
            phoneNumber: signupData.phoneNumber,
            dietaryRequirements: signupData.dietaryRequirements,
            medicalInfo: signupData.medicalInfo,
            seatsInCar: signupData.seatsInCar,
            driverLicenseClass: signupData.license
        }, isWaitlist)
            .then(() => {
                notification.success({message: `Successfully signed up ${signupData.name}`})
            })
            .catch((err) => {
                notification.error({message: `Error signing up to event: ${err.toString()}`})
            })
            .finally(() => {
                if (isWaitlist) {
                    this.setState({...this.state, submittingWaitlistMember: false, addingWaitlistMember: false})
                } else {
                    this.setState({...this.state, submittingMember: false, addingMember: false})
                }
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
                <div className="eventSignupsHeaderContainer">
                    <h1 className='eventSignupsHeader'>
                        <Link className='mainAdminCreateBack' to='/admin/events'>
                        <ArrowLeftOutlined />
                    </Link>
                    {this.state.event.title}</h1>
                    <div className="eventSignupsHeaderButtons">
                        <Link to={`/admin/editevent/${this.state.event.id}`}>
                            <Button>Edit Event</Button>
                        </Link>
                    </div>
                </div>
                <div className="clearBoth"></div>
                <div className="eventSignupsMemberDisplaySection">
                    <div className="eventSignupMemberDisplayHeader">
                        <h3 className='eventSignupMemberDisplayTitle'>Signups</h3>
                        <Button className='eventSignupMemberDisplayAddButton' type='primary' shape='round' onClick={this.addMemberClick}><PlusOutlined/>Add Member</Button>
                        <p className='eventSignupMemberDisplayTotalText'>Total: {Object.keys(this.state.event.signups.members).length} / {this.state.event.signups.limit}</p>
                        <div className="clearBoth"></div>
                        {this.state.addingMember ? 
                            <div className="eventSignupsAddMemberContainer">
                                <Button onClick={this.onCancelAddMember}>Cancel</Button>
                                <CampSignupForm
                                    isCamp={this.state.event.signups.isCamp}
                                    onSubmit={(data) => this.signUpNewMember(data, false)}
                                    isWaitlist={false}
                                    includeNameAndEmail={true}
                                    submitting={this.state.submittingMember}
                                    ></CampSignupForm>
                            </div>
                        : ''}
                        <EventSignupTable
                            urlPath={this.state.event.urlPath}
                            isWaitlist={false}
                            eventId={this.state.event.id}
                            signupData={this.state.event.signups.members}
                            isCamp={this.state.event.signups.isCamp}
                            limit={this.state.event.signups.limit}></EventSignupTable>
                    </div>
                </div>
                <div className="clearBoth"></div>
                <div className="eventSignupsMemberDisplaySection">
                    <div className="eventSignupMemberDisplayHeader">
                        <h3 className='eventSignupMemberDisplayTitle'>Waitlist</h3>
                        <Button className='eventSignupMemberDisplayAddButton' type='primary' shape='round' onClick={this.addWaitlistMemberClick}><PlusOutlined/>Add Member</Button>
                        <p className='eventSignupMemberDisplayTotalText'>Total: {Object.keys(this.state.event.signups.waitlist).length}</p>
                        <div className="clearBoth"></div>
                        {this.state.addingWaitlistMember ? 
                            <div className="eventSignupsAddMemberContainer">
                            <Button onClick={this.onCancelAddWaitlistMember}>Cancel</Button>
                               <CampSignupForm
                               isCamp={this.state.event.signups.isCamp}
                                onSubmit={(data) => this.signUpNewMember(data, true)}
                                isWaitlist={true}
                                includeNameAndEmail={true}
                                submitting={this.state.submittingWaitlistMember}
                                ></CampSignupForm>
                            </div>
                        : ''}
                        <EventSignupTable
                            urlPath={this.state.event.urlPath}
                            isWaitlist={true}
                            eventId={this.state.event.id}
                            signupData={this.state.event.signups.waitlist}
                            isCamp={this.state.event.signups.isCamp}
                            limit={null}></EventSignupTable>
                    </div>
                </div>
            </div>
        )
    }
}

export default withRouter(EventSignups)