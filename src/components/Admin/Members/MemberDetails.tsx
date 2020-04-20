import React, {Component} from 'react'
import { Tooltip, Button } from 'antd'
import {CopyOutlined} from '@ant-design/icons'
import './MemberDetails.css'
import { TableDataLine } from './TableHelper'
import { notification } from 'antd'

interface MemberDetailsProps {
    member: TableDataLine
}

interface MemberDetailsState {
    showingAttendance: boolean
}

export class MemberDetails extends Component<MemberDetailsProps, MemberDetailsState> {
    constructor(props: MemberDetailsProps) {
        super(props)
        this.state = {
            showingAttendance: false
        }
    }
    toggleAttendance = () => {
        this.setState({
            ...this.state,
            showingAttendance: !this.state.showingAttendance
        })
    }
    copyText = (text: string) => {
        navigator.clipboard.writeText(text).then(() => {
            notification.success({message: 'Copied'})
        })
        .catch((err) => {
            notification.error({message: 'Text not copied: ' + err.toString()})
        })
    }
    render() {
        return (
            <div>
                <div className="membershipDescriptionContainer">
                    <div className="memberDescriptionSection">
                        <h4>Name</h4>
                        <p>
                            <span className='memberDescriptionTitle'>First: </span>
                            <span className='membershipDescriptionValue'>{this.props.member.firstName}</span>
                        </p>
                        <p>
                            <span className='memberDescriptionTitle'>Last: </span>
                            <span className='membershipDescriptionValue'>{this.props.member.lastName}</span>
                        </p>
                        <p>
                            <span className='memberDescriptionTitle'>Preferred: </span>
                            <span className='membershipDescriptionValue'>{this.props.member.preferredName}</span>
                        </p>
                    </div>
                    <div className="memberDescriptionSection">
                        <h4>Details</h4>
                        <p>
                            <span className='memberDescriptionTitle'>Email: </span>
                            <span className='membershipDescriptionValue'>{this.props.member.email}</span>
                            <Tooltip title='Copy'><CopyOutlined onClick={e => this.copyText(this.props.member.email)}/></Tooltip>
                        </p>
                        <p>
                            <span className='memberDescriptionTitle'>UoA Student: </span>
                            <span className='membershipDescriptionValue'>{this.props.member.isUoAStudent}</span>
                        </p>
                        {this.props.member.isUoAStudent ? <p>
                            <span className='memberDescriptionTitle'>UPI: </span>
                            <span className='membershipDescriptionValue'>{this.props.member.UPI}</span>
                            <Tooltip title='Copy'><CopyOutlined onClick={e => this.copyText(this.props.member.UPI)}/></Tooltip>
                        </p> : ''}
                        <p>
                            <span className='memberDescriptionTitle'>Membership: </span>
                            <span className='membershipDescriptionValue'>{this.props.member.membership}</span>
                        </p>
                    </div>
                    <div className="memberDescriptionSection">
                        <h4>Emergency Contact</h4>
                        <p>
                            <span className='memberDescriptionTitle'>Name: </span>
                            <span className='membershipDescriptionValue'>{this.props.member.EmergencyContactName}</span>
                        </p>
                        <p>
                            <span className='memberDescriptionTitle'>Number: </span>
                            <span className='membershipDescriptionValue'>{this.props.member.EmergencyContactNumber}</span>
                            <Tooltip title='Copy'><CopyOutlined onClick={e => this.copyText(this.props.member.EmergencyContactNumber)}/></Tooltip>
                        </p>
                        <p>
                            <span className='memberDescriptionTitle'>Relation: </span>
                            <span className='membershipDescriptionValue'>{this.props.member.Relationship}</span>
                            <Tooltip title='Copy'><CopyOutlined onClick={e => this.copyText(this.props.member.Relationship)}/></Tooltip>
                        </p>
                    </div>
                    <div className="clearBoth"></div>
                    <Button onClick={this.toggleAttendance}>{this.state.showingAttendance ? 'Hide Attendance' : 'ShowAttendance'}</Button>
                </div>
                <div className="atttendanceContainer">
                    {this.state.showingAttendance ? 
                    'asdfasdf'
                    : ''}
                </div>
            </div>
        )
    }
}