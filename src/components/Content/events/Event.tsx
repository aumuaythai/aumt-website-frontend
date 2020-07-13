import React, {Component} from 'react'
import { Link } from 'react-router-dom'
import { ArrowLeftOutlined, CalendarOutlined, ClockCircleOutlined, HomeOutlined, FacebookOutlined } from '@ant-design/icons'
import { Button, Result, Divider, notification} from 'antd'
import moment from 'moment'
import './Event.css'
import { AumtEvent, AumtMember } from '../../../types'
import firebaseUtil from '../../../services/firebase.util'
import db from '../../../services/db'

interface EventProps {
    event: AumtEvent
    authedUser: AumtMember | null
}

interface EventState {
    displayDate: string
    displayTime: string
    signedUp: boolean
    confirmedSignUp: boolean
    reservingSpot: boolean
    withdrawingSpot: boolean
}

export class Event extends Component<EventProps, EventState> {
    constructor(props: EventProps) {
        super(props)
        const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
        const dateString = this.props.event.date.toLocaleDateString(undefined, options)
        const isAm = this.props.event.date.getHours() <= 12
        const displayTime = `${this.props.event.date.getHours() % 12}:${('0' + String(this.props.event.date.getMinutes())).slice(-2)} ${isAm ? 'AM' : 'PM'}`
        const signupInfo = this.getSignupInfo()
        this.state = {
            displayDate: dateString,
            displayTime,
            signedUp: !!signupInfo,
            confirmedSignUp: !!signupInfo && signupInfo.confirmed,
            reservingSpot: false,
            withdrawingSpot: false
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
    onReserveClicked = () => {
        console.log(this.props.event)
        const displayName = this.props.authedUser ? `${this.props.authedUser?.firstName} ${this.props.authedUser?.lastName}` : 'ted ted ted'
        this.setState({
            ...this.state,
            reservingSpot: true
        })
        const confirmed = this.props.event.signups?.needAdminConfirm ? false : true
        db.signUpToEvent(this.props.event.id,
            firebaseUtil.getCurrentUid() || this.generateMockUid(),
            {
                displayName,
                timeSignedUpMs: new Date().getTime(),
                confirmed
            })
            .then(() => {
                this.setState({
                    ...this.state,
                    signedUp: true,
                    confirmedSignUp: confirmed
                })
            })
            .catch((err) => {
                notification.error({message: 'Error signing up to event: ' + err.toString()})
            })
            .finally(() => {
                this.setState({...this.state, reservingSpot: false})
            })
    }
    onWithdrawClick = () => {
        this.setState({...this.state, withdrawingSpot: true})
        db.removeMemberFromEvent(firebaseUtil.getCurrentUid() || this.generateMockUid(), this.props.event.id)
            .then(() => {
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
                        <HomeOutlined/> {this.props.event.location}
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
                        return <div>
                            {signups.opens > new Date() ?
                                <div>Signups will open {moment(signups.opens).format('MMMM Do')}</div>
                                : 
                                <div>
                                    <Button
                                        loading={this.state.reservingSpot}
                                        type='primary'
                                        onClick={this.onReserveClicked}>Reserve a Spot</Button>
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