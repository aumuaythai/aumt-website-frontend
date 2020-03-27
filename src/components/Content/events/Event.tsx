import React, {Component} from 'react'
import { Link } from 'react-router-dom'
import { ArrowLeftOutlined, CalendarOutlined, ClockCircleOutlined, HomeOutlined, FacebookOutlined } from '@ant-design/icons'
import {Divider} from 'antd'
import './Event.css'

interface EventProps {
    date: Date
    fbLink: string
    urlPath: string
    photoPath: string
    eventLocation: string
    title: string
    id: string
    description: string
}

interface EventState {
    displayDate: string
    displayTime: string
}

export class Event extends Component<EventProps, EventState> {
    constructor(props: EventProps) {
        super(props)
        const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
        const dateString = this.props.date.toLocaleDateString(undefined, options)
        const isAm = this.props.date.getHours() <= 12
        const displayTime = `${this.props.date.getHours() % 12}:${('0' + String(this.props.date.getMinutes())).slice(-2)} ${isAm ? 'AM' : 'PM'}`
        this.state = {
            displayDate: dateString,
            displayTime
        }
    }
    render() {
        return (
            <div className='eventContainer'>
                <div className="eventHeader">
                    <p className='backToEventsLink'><Link title='Back to Events' to='/events'><ArrowLeftOutlined /></Link></p>
                    <h2>
                        {this.props.title}
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
                        <HomeOutlined/> {this.props.eventLocation}
                    </div>
                    {this.props.fbLink ? 
                        <div className="detail fbLinkDetail">
                            <FacebookOutlined /> <a href={this.props.fbLink} target='_blank' rel="noopener noreferrer">{this.props.fbLink}</a>
                        </div>
                    : ''}
                </div>
                <Divider/>
                <p className='eventDescription'>
                    {this.props.description}
                </p>
            </div>
        )
    }
}