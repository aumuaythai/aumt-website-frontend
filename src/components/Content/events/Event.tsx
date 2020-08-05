import React, {Component} from 'react'
import { Link } from 'react-router-dom'
import { ArrowLeftOutlined, CalendarOutlined, ClockCircleOutlined, HomeOutlined, FacebookOutlined } from '@ant-design/icons'
import { Button, Result, Input, Divider, Radio, notification, InputNumber} from 'antd'
import moment from 'moment'
import './Event.css'
import { AumtEvent, AumtMember, LicenseClasses } from '../../../types'
import firebaseUtil from '../../../services/firebase.util'
import db from '../../../services/db'
import { CampSignupForm } from './CampSignupForm'

interface EventProps {
    event: AumtEvent
    authedUser: AumtMember | null
}

interface EventState {
    displayDate: string
    displayTime: string
    signedUp: boolean
    waitlisted: boolean
    confirmedSignUp: boolean
    reservingSpot: boolean
    waitlistingMember: boolean
    withdrawingSpot: boolean
    currentOwnsCar: boolean | undefined
    currentSeats: number | undefined
    currentLicenseClass: LicenseClasses | ''
    currentDietaryRequirements: string
}

export class Event extends Component<EventProps, EventState> {
    constructor(props: EventProps) {
        super(props)
        const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
        const dateString = this.props.event.date.toLocaleDateString(undefined, options)
        const isAm = this.props.event.date.getHours() <= 12
        const displayTime = `${this.props.event.date.getHours() % 12}:${('0' + String(this.props.event.date.getMinutes())).slice(-2)} ${isAm ? 'AM' : 'PM'}`
        const signupInfo = this.getSignupInfo()
        const waitlistedInfo = this.getWaitlistedInfo()
        this.state = {
            displayDate: dateString,
            displayTime,
            signedUp: !!signupInfo,
            waitlisted: !!waitlistedInfo,
            confirmedSignUp: !!signupInfo && signupInfo.confirmed,
            currentOwnsCar: !!signupInfo && !!signupInfo.seatsInCar || undefined,
            currentSeats: signupInfo && signupInfo.seatsInCar || undefined,
            currentDietaryRequirements: signupInfo && signupInfo.dietaryRequirements || '',
            currentLicenseClass: signupInfo && signupInfo.driverLicenseClass || '',
            reservingSpot: false,
            withdrawingSpot: false,
            waitlistingMember: false
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
    getSignupInfo = () => {
        const uid = firebaseUtil.getCurrentUid()
        if (uid) {
            return this.props.event.signups?.members[uid]
        }
        return null
    }
    getWaitlistedInfo = () => {
        const uid = firebaseUtil.getCurrentUid()
        if (uid) {
            return this.props.event.signups?.waitlist[uid]
        }
        return null
    }
    onSignupFormSubmit = (signupData: {dietaryRequirements?: string, seatsInCar?: number, license?: LicenseClasses, name?: string, email?: string}, isWaitlist: boolean) => {
        const displayName = this.props.authedUser ? `${this.props.authedUser.firstName} ${this.props.authedUser.lastName}` : ''
        if (!displayName) {
            notification.error({message: 'Name required'})
            return
        }
        if (!isWaitlist) {
            this.setState({...this.state, reservingSpot: true })
        } else {
            this.setState({...this.state, waitlistingMember: true})
        }
        const confirmed = this.props.event.signups?.needAdminConfirm ? false : true
        db.signUpToEvent(this.props.event.id,
            firebaseUtil.getCurrentUid() || this.generateMockUid(),
            Object.assign({
                displayName,
                timeSignedUpMs: new Date().getTime(),
                confirmed,
                email: this.props.authedUser?.email || 'NO EMAIL'
            }, signupData.dietaryRequirements ? {
                dietaryRequirements: signupData.dietaryRequirements
            } : {}, signupData.license ? {
                driverLicenseClass: signupData.license,
                seatsInCar: signupData.seatsInCar || -1
            } : {})
            , isWaitlist)
            .then(() => {
                if (isWaitlist) {
                    this.setState({...this.state, waitlisted: true})
                } else {
                    this.setState({
                        ...this.state,
                        signedUp: true,
                        confirmedSignUp: confirmed
                    })
                }
            })
            .catch((err) => {
                notification.error({message: 'Error signing up to event: ' + err.toString()})
            })
            .finally(() => {
                this.setState({...this.state, reservingSpot: false, waitlistingMember: false})
            })
    }
    getWaitlistPosition = (): string => {
        const uid = firebaseUtil.getCurrentUid()
        if (uid && this.props.event.signups && this.props.event.signups.waitlist) {
            const keys = Object.keys(this.props.event.signups.waitlist)
            const sortedKeys = keys.sort((a, b) => {
                if (this.props.event.signups) {
                    const dataA = this.props.event.signups.waitlist[a]
                    const dataB = this.props.event.signups.waitlist[b]
                    return dataA.timeSignedUpMs - dataB.timeSignedUpMs
                }
                return 0
            })
            const position = sortedKeys.indexOf(uid) + 1
            if (position > 0) {
                return 'number ' + position
            }
        }
        return ''
    }
    onWithdrawClick = () => {
        this.setState({...this.state, withdrawingSpot: true})
        const firebaseUid = firebaseUtil.getCurrentUid()
        db.removeMemberFromEvent(firebaseUid || this.generateMockUid(), this.props.event.id)
            .then(() => {
                if (firebaseUid && this.props.event.signups) {
                    delete this.props.event.signups.members[firebaseUid]
                }
                this.setState({
                    ...this.state,
                    signedUp: false,
                    confirmedSignUp: false
                })
            })
            .catch((err) => {
                notification.error({message: 'Error withdrawing from event: ' + err.toString()})
            })
            .finally(() => {
                this.setState({...this.state, withdrawingSpot: false})
            })
    }
    render() {
        return (
            <div className='eventContainer'>
                <div className="eventHeader">
                    <p className='backToEventsLink'><Link title='Back to Events' to='/events'><ArrowLeftOutlined /></Link></p>
                    <h2>
                        {this.props.event.title}
                    </h2>
                    <div className='eventHeaderSpacer'></div>
                </div>
                <div className="eventDetailsContainer">
                    <div className="detail dayDetail">
                        <CalendarOutlined /> {this.state.displayDate}
                    </div>
                    <div className="detail timeDetail">
                        <ClockCircleOutlined /> {this.state.displayTime}
                    </div>
                    <div className="detail locationDetail">
                        <HomeOutlined/> {this.props.event.locationLink ?
                        <a href={this.props.event.locationLink} target='_blank' rel='noopener noreferrer'>
                            {this.props.event.location}
                        </a>
                        : this.props.event.location}
                    </div>
                    {this.props.event.fbLink ? 
                        <div className="detail fbLinkDetail">
                            <FacebookOutlined /> <a href={this.props.event.fbLink} target='_blank' rel="noopener noreferrer">{this.props.event.fbLink}</a>
                        </div>
                    : ''}
                </div>
                <Divider/>
                <p className='eventDescription'>
                    {this.props.event.description}
                </p>
                <Divider/>
                {(() => {
                    if (this.props.event.signups) {
                        const {signups} = this.props.event
                        if (this.state.signedUp) {
                            return <div>
                                <Result
                                status='success'
                                title='You are signed up'
                                subTitle={!this.state.confirmedSignUp ?
                                    'Once the committee receives your payment, your spot will be fully reserved' :
                                    this.props.event.signups.needAdminConfirm ? 'Our records show you have paid, your spot is confirmed' : ''}>
                                </Result>
                                <Button
                                    type='link'
                                    loading={this.state.withdrawingSpot}
                                    onClick={this.onWithdrawClick}>Withdraw Signup</Button>
                                </div>
                        } 
                        if (this.state.waitlisted) {
                            return <div>
                                <p>You are currently {this.getWaitlistPosition() || ''} on the event waitlist.</p>
                                <p>If a spot frees up the committee will let you know!</p>
                            </div>
                        }
                        return <div>
                            {signups.opens > new Date(20000000000000) ?
                                <div>Signups will open {moment(signups.opens).format('MMMM Do')}</div>
                                : 
                                !this.props.authedUser ? 
                                <div>
                                    <p>You must <Link to={`/login?from=/events/${this.props.event.urlPath}`}> log in </Link> to reserve your place.</p>
                                    <h4>Not a member?</h4>
                                    <p>Message the AUMT committee, they can save you a spot!</p>
                                </div>
                                :
                                this.props.event.signups.limit && (this.props.event.signups.limit <= Object.keys(this.props.event.signups.members).length) ?
                                <div>
                                    <h4>Signups are currently full</h4>
                                    <p>Fill out the form below to join the waitlist and the committee will let message you if a spot opens.</p>
                                        <CampSignupForm
                                            includeNameAndEmail={false}
                                            isWaitlist={true}
                                            onSubmit={(data) => this.onSignupFormSubmit(data, true)}
                                            submitting={this.state.waitlistingMember}></CampSignupForm>
                                </div>
                                :
                                <div>
                                    <h2>Signups</h2>
                                    {this.props.event.signups.isCamp ? 
                                        <CampSignupForm
                                            includeNameAndEmail={false}
                                            isWaitlist={false}
                                            onSubmit={(data) => this.onSignupFormSubmit(data, false)}
                                            submitting={this.state.reservingSpot}></CampSignupForm>
                                    :
                                    <Button
                                        loading={this.state.reservingSpot}
                                        type='primary'
                                        block
                                        className='reserveEventSpotButton'
                                        onClick={e => this.onSignupFormSubmit({}, false)}>Reserve a Spot</Button>
                                    }
                                </div>
                                }
                        </div>
                    } else {
                        return ''
                    }
                })()}
            </div>
        )
    }
}