import React, {Component} from 'react'
import { Tooltip, Input, Select, Button } from 'antd'
import {CopyOutlined} from '@ant-design/icons'
import { MemberAttendance } from './MemberAttendance'
import './MemberDetails.css'
import { TableDataLine } from './TableHelper'
import { notification } from 'antd'
import { AumtMember } from '../../../types'
import db from '../../../services/db'

interface MemberDetailsProps {
    member: TableDataLine
}

interface MemberDetailsState {
    currentFirstName: string
    currentLastName: string
    currentPreferredName: string
    currentEmail: string
    currentIsUoaStudent: 'Yes' | 'No'
    currentUpi: string
    currentMembership: 'S1' | 'FY' | 'S2' | null
    currentIsReturningMember: 'Yes' | 'No'
    currentECName: string
    currentECNumber: string
    currentECRelationship: string
    saving: boolean
}

export class MemberDetails extends Component<MemberDetailsProps, MemberDetailsState> {
    constructor(props: MemberDetailsProps) {
        super(props)
        this.state = {
            currentFirstName: props.member.firstName,
            currentLastName: props.member.lastName,
            currentPreferredName: props.member.preferredName,
            currentEmail: props.member.email,
            currentIsUoaStudent: props.member.isUoAStudent,
            currentUpi: props.member.UPI,
            currentMembership: props.member.membership,
            currentIsReturningMember: props.member.isReturningMember,
            currentECName: props.member.EmergencyContactName,
            currentECNumber: props.member.EmergencyContactNumber,
            currentECRelationship: props.member.Relationship,
            saving: false
        }
    }
    componentDidUpdate = (prevProps: MemberDetailsProps) => {
        if (this.props !== prevProps) {
            this.setState({
                ...this.state,
                currentFirstName: this.props.member.firstName,
                currentLastName: this.props.member.lastName,
                currentPreferredName: this.props.member.preferredName,
                currentEmail: this.props.member.email,
                currentIsUoaStudent: this.props.member.isUoAStudent,
                currentUpi: this.props.member.UPI,
                currentMembership: this.props.member.membership,
                currentIsReturningMember: this.props.member.isReturningMember,
                currentECName: this.props.member.EmergencyContactName,
                currentECNumber: this.props.member.EmergencyContactNumber,
                currentECRelationship: this.props.member.Relationship
            })
        }
    }
    onFirstNameChange = (newName: string) => {
        this.setState({...this.state, currentFirstName: newName})
    }
    onLastNameChange = (newName: string) => {
        this.setState({...this.state, currentLastName: newName})
    }
    onPreferredNameChange = (newName: string) => {
        this.setState({...this.state, currentPreferredName: newName})
    }
    onEmailChange = (newEmail: string) => {
        this.setState({...this.state, currentEmail: newEmail})
    }
    onIsUoaChange = (isUoa: 'Yes' | 'No') => {
        this.setState({...this.state, currentIsUoaStudent: isUoa})
    }
    onUpiChange = (upi: string) => {
        this.setState({...this.state, currentUpi: upi})
    }
    onMembershipChange = (membership: 'S1' | 'S2' | 'FY' | 'None') => {
        let newMembership: 'S1' | 'S2' | 'FY' | 'None' | null = membership
        if (newMembership === 'None') {
            newMembership = null
        }
        this.setState({...this.state, currentMembership: newMembership})
    }
    onIsReturningChange = (isReturning: 'Yes' | 'No') => {
        this.setState({...this.state, currentIsReturningMember: isReturning})
    }
    onECNameChange = (name: string) => {
        this.setState({...this.state, currentECName: name})
    }
    onECNumberChange = (number: string) => {
        this.setState({...this.state, currentECNumber: number})
    }
    onECRelationChange = (relation: string) => {
        this.setState({...this.state, currentECRelationship: relation})
    }
    onSaveClick = () => {
        const member: AumtMember = {
            firstName: this.state.currentFirstName,
            lastName: this.state.currentLastName,
            preferredName: this.state.currentPreferredName,
            email: this.state.currentEmail,
            isUoAStudent: this.state.currentIsUoaStudent,
            UPI: this.state.currentUpi || '0',
            membership: this.state.currentMembership,
            isReturningMember: this.state.currentIsReturningMember,
            EmergencyContactName: this.state.currentECName,
            EmergencyContactNumber: this.state.currentECNumber,
            Relationship: this.state.currentECRelationship,
            disabled: false,
            displayName: '',
            emailVerified: false,
            password: ''
        }
        if (!member.firstName || !member.lastName) {
            return notification.error({message: 'First and Last Name Required'})
        } else if (!member.email) {
            return notification.error({message: 'Email Required'})
        } else if (!member.isUoAStudent || !member.isReturningMember) {
            return notification.error({message: 'Is UoA Student and Is Returning must be specified'})
        } else if (!member.EmergencyContactName || !member.EmergencyContactNumber || !member.Relationship) {
            return notification.error({message: 'All Emergency Contact Details are Required'})
        }
        this.setState({...this.state, saving: true})
        db.setMember(this.props.member.key, member)
            .then(() => {
                this.setState({...this.state, saving: false})
                notification.success({message: 'Saved'})
            })
            .catch((err) => {
                notification.error({message: 'Could not save member' + err.toString()})
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
                        <div className='memberDescriptionLine'>
                            <span className='memberDescriptionTitle'>First: </span>
                            <Input className='memberEditInput' value={this.state.currentFirstName} onChange={e => this.onFirstNameChange(e.target.value)}/>
                        </div>
                        <div className='memberDescriptionLine'>
                            <span className='memberDescriptionTitle'>Last: </span>
                            <Input className='memberEditInput' value={this.state.currentLastName} onChange={e => this.onLastNameChange(e.target.value)}/>
                        </div>
                        <div className='memberDescriptionLine'>
                            <span className='memberDescriptionTitle'>Preferred: </span>
                            <Input className='memberEditInput' value={this.state.currentPreferredName} onChange={e => this.onPreferredNameChange(e.target.value)}/>
                        </div>
                        <div className='memberDescriptionLine'>
                            <span className='memberDescriptionTitle'>Email: </span>
                            <Input className='memberEditInput longMemberEditInput' value={this.state.currentEmail} onChange={e => this.onEmailChange(e.target.value)}/>
                            <Tooltip title='Copy'><CopyOutlined onClick={e => this.copyText(this.state.currentEmail)}/></Tooltip>
                        </div>
                    </div>
                    <div className="memberDescriptionSection">
                        <h4>Details</h4>
                        <div className='memberDescriptionLine'>
                            <span className='memberDescriptionTitle'>UoA Student: </span>
                            <Select value={this.state.currentIsUoaStudent} onChange={this.onIsUoaChange} style={{ width: 120 }}>
                                <Select.Option value="Yes">Yes</Select.Option>
                                <Select.Option value="No">No</Select.Option>
                            </Select>
                        </div>
                        <div className={`memberDescriptionLine ${this.state.currentIsUoaStudent === 'Yes' ? '' : 'noHeight'}`}>
                            <span className='memberDescriptionTitle'>UPI: </span>
                            <Input className='memberEditInput' value={this.state.currentUpi} onChange={e => this.onUpiChange(e.target.value)}/>
                            <Tooltip title='Copy'><CopyOutlined onClick={e => this.copyText(this.props.member.UPI)}/></Tooltip>
                        </div>
                        <div className='memberDescriptionLine'>
                            <span className='memberDescriptionTitle'>Membership: </span>
                            <Select value={this.state.currentMembership || 'None'} onChange={this.onMembershipChange} style={{ width: 120 }}>
                                <Select.Option value="S1">S1</Select.Option>
                                <Select.Option value="S2">S2</Select.Option>
                                <Select.Option value="FY">FY</Select.Option>
                                <Select.Option value='None'>None</Select.Option>
                            </Select>
                        </div>
                        <div className='memberDescriptionLine'>
                            <span className='memberDescriptionTitle'>Returning Member: </span>
                            <Select value={this.state.currentIsReturningMember} onChange={this.onIsReturningChange} style={{ width: 120 }}>
                                <Select.Option value="Yes">Yes</Select.Option>
                                <Select.Option value="No">No</Select.Option>
                            </Select>
                        </div>
                    </div>
                    <div className="memberDescriptionSection">
                        <h4>Emergency Contact</h4>
                        <div className='memberDescriptionLine'>
                            <span className='memberDescriptionTitle'>Name: </span>
                            <Input className='memberEditInput' value={this.state.currentECName} onChange={e => this.onECNameChange(e.target.value)}/>
                        </div>
                        <div className='memberDescriptionLine'>
                            <span className='memberDescriptionTitle'>Number: </span>
                            <Input className='memberEditInput' value={this.state.currentECNumber} onChange={e => this.onECNumberChange(e.target.value)}/>
                            <Tooltip title='Copy'><CopyOutlined onClick={e => this.copyText(this.props.member.EmergencyContactNumber)}/></Tooltip>
                        </div>
                        <div className='memberDescriptionLine'>
                            <span className='memberDescriptionTitle'>Relation: </span>
                            <Input className='memberEditInput' value={this.state.currentECRelationship} onChange={e => this.onECRelationChange(e.target.value)}/>
                        </div>
                    </div>
                    <div className="memberDescriptionSection">
                        <Button type='primary' loading={this.state.saving} onClick={this.onSaveClick}>Save {this.state.currentFirstName} {this.state.currentLastName}</Button>
                    </div>
                    <div className="clearBoth"></div>
                </div>
                <div className="atttendanceContainer">
                    <h2>Attendance</h2>
                    <MemberAttendance member={this.props.member}></MemberAttendance>
                </div>
            </div>
        )
    }
}