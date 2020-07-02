import React, {Component} from 'react'
import {withRouter, RouteComponentProps} from 'react-router-dom'
import { Tooltip, Input, Radio, Button, Popconfirm } from 'antd'
import {CopyOutlined} from '@ant-design/icons'
import { MemberAttendance } from './MemberAttendance'
import './MemberDetails.css'
import { TableDataLine } from './TableHelper'
import { notification } from 'antd'
import { AumtMember } from '../../../types'
import db from '../../../services/db'
import DataFormatterUtil from '../../../services/data.util'
import Validator from '../../../services/validator'

interface MemberDetailsProps extends RouteComponentProps {
    member: TableDataLine
}

interface MemberDetailsState {
    currentFirstName: string
    currentLastName: string
    currentPreferredName: string
    currentEmail: string
    currentIgHandle: string
    currentIsUoaStudent: 'Yes' | 'No'
    currentUpi: string
    currentMembership: 'S1' | 'FY' | 'S2'
    currentPaid: 'Yes' | 'No',
    currentPaymentType: 'Bank Transfer' | 'Cash' | 'Other'
    currentIsReturningMember: 'Yes' | 'No'
    currentEmailVerified: boolean
    currentInitialExperience: string
    currentECName: string
    currentECNumber: string
    currentECRelationship: string
    saving: boolean
    removing: boolean
}

class MemberDetails extends Component<MemberDetailsProps, MemberDetailsState> {
    constructor(props: MemberDetailsProps) {
        super(props)
        this.state = {
            currentFirstName: props.member.firstName,
            currentLastName: props.member.lastName,
            currentPreferredName: props.member.preferredName,
            currentEmail: props.member.email,
            currentIgHandle: props.member.instagramHandle,
            currentIsUoaStudent: props.member.isUoAStudent,
            currentUpi: props.member.upi,
            currentMembership: props.member.membership,
            currentPaid: props.member.paid,
            currentPaymentType: props.member.paymentType,
            currentIsReturningMember: props.member.isReturningMember,
            currentEmailVerified: props.member.emailVerified,
            currentInitialExperience: props.member.initialExperience,
            currentECName: props.member.EmergencyContactName,
            currentECNumber: props.member.EmergencyContactNumber,
            currentECRelationship: props.member.EmergencyContactRelationship,
            saving: false,
            removing: false,
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
                currentIgHandle: this.props.member.instagramHandle,
                currentInitialExperience: this.props.member.initialExperience,
                currentIsUoaStudent: this.props.member.isUoAStudent,
                currentUpi: this.props.member.upi,
                currentMembership: this.props.member.membership,
                currentPaid: this.props.member.paid,
                currentPaymentType: this.props.member.paymentType,
                currentIsReturningMember: this.props.member.isReturningMember,
                currentEmailVerified: this.props.member.emailVerified,
                currentECName: this.props.member.EmergencyContactName,
                currentECNumber: this.props.member.EmergencyContactNumber,
                currentECRelationship: this.props.member.EmergencyContactRelationship
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
    onInstagramChange = (newHandle: string) => {
        this.setState({...this.state, currentIgHandle: newHandle})
    }
    onIsUoaChange = (isUoa: 'Yes' | 'No') => {
        this.setState({...this.state, currentIsUoaStudent: isUoa})
    }
    onUpiChange = (upi: string) => {
        this.setState({...this.state, currentUpi: upi})
    }
    onMembershipChange = (membership: 'S1' | 'S2' | 'FY') => {
        let newMembership: 'S1' | 'S2' | 'FY' = membership
        this.setState({...this.state, currentMembership: newMembership})
    }
    onPaidChange = (paid: 'Yes' | 'No') => {
        this.setState({...this.state, currentPaid: paid})
    }
    onPaymentTypeChange = (payment: 'Bank Transfer' | 'Cash' | 'Other') => {
        this.setState({...this.state, currentPaymentType: payment})
    }
    onIsReturningChange = (isReturning: 'Yes' | 'No') => {
        this.setState({...this.state, currentIsReturningMember: isReturning})
    }
    onInitialExperienceChange = (experience: string) => {
        this.setState({...this.state, currentInitialExperience: experience})
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
    onRemoveClick = () => {
        this.setState({...this.state, removing: true})
        db.removeMember(this.props.member.key)
            .then(() => {
                this.setState({...this.state, removing: false})
                notification.success({message: `${this.state.currentFirstName} ${this.state.currentLastName} removed. Please also remove login credentials for ${this.state.currentEmail} in the Firebase Authentication section`})
                this.props.history.push('/admin/members')
            })
            .catch((err) => {
                this.setState({...this.state, removing: false})
                notification.error({message: err.toString()})
            })
    }
    onSaveClick = () => {
        const member: AumtMember = {
            firstName: this.state.currentFirstName,
            lastName: this.state.currentLastName,
            preferredName: this.state.currentPreferredName,
            email: this.state.currentEmail,
            instagramHandle: this.state.currentIgHandle || '',
            isUoAStudent: this.state.currentIsUoaStudent,
            upi: this.state.currentUpi || '0',
            membership: this.state.currentMembership,
            paid: this.state.currentPaid,
            isReturningMember: this.state.currentIsReturningMember,
            initialExperience: this.state.currentInitialExperience || '',
            EmergencyContactName: this.state.currentECName,
            EmergencyContactNumber: this.state.currentECNumber,
            EmergencyContactRelationship: this.state.currentECRelationship,
            emailVerified: this.state.currentEmailVerified,
            paymentType: this.state.currentPaymentType
        }
        const errorStr = Validator.createAumtMember(member)
        if (typeof(errorStr) === 'string') {
            return notification.error({message: errorStr})
        }
        if (this.props.member.email !== this.state.currentEmail) {
            notification.open({message: 'Reminder: If you change the email here, also change it in the Firebase Admin Console under the Authentication tab'})
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
        DataFormatterUtil.copyText(text)
    }
    render() {
        return (
            <div>
                <div className="membershipDescriptionContainer">
                    <div className="memberDescriptionSection">
                        <h4>Contact</h4>
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
                        <div className='memberDescriptionLine'>
                            <span className='memberDescriptionTitle'>Instagram Handle: </span>
                            <Input prefix='@' className='memberEditInput' value={this.state.currentIgHandle} onChange={e => this.onInstagramChange(e.target.value)}/>
                        </div>
                    </div>
                    <div className="memberDescriptionSection">
                        <h4>Details</h4>
                        <div className='memberDescriptionLine'>
                            <span className='memberDescriptionTitle'>UoA Student: </span>
                            <Radio.Group value={this.state.currentIsUoaStudent} onChange={e => this.onIsUoaChange(e.target.value)}>
                                <Radio.Button value="Yes">Yes</Radio.Button>
                                <Radio.Button value="No">No</Radio.Button>
                            </Radio.Group>
                        </div>
                        <div className={`memberDescriptionLine ${this.state.currentIsUoaStudent === 'Yes' ? '' : 'noHeight'}`}>
                            <span className='memberDescriptionTitle'>UPI: </span>
                            <Input className='memberEditInput' value={this.state.currentUpi} onChange={e => this.onUpiChange(e.target.value)}/>
                            <Tooltip title='Copy'><CopyOutlined onClick={e => this.copyText(this.props.member.upi)}/></Tooltip>
                        </div>
                        <div className='memberDescriptionLine'>
                            <span className='memberDescriptionTitle'>Membership: </span>
                            <Radio.Group value={this.state.currentMembership} onChange={e => this.onMembershipChange(e.target.value)}>
                                <Radio.Button value="S1">S1</Radio.Button>
                                <Radio.Button value="S2">S2</Radio.Button>
                                <Radio.Button value="FY">FY</Radio.Button>
                            </Radio.Group>
                        </div>
                        <div className='memberDescriptionLine'>
                            <span className='memberDescriptionTitle'>Paid: </span>
                            <Radio.Group value={this.state.currentPaid} onChange={e => this.onPaidChange(e.target.value)}>
                                <Radio.Button value="Yes">Yes</Radio.Button>
                                <Radio.Button value="No">No</Radio.Button>
                            </Radio.Group>
                            <Radio.Group className='memberDetailsPaymentTypeRadio' value={this.state.currentPaymentType} onChange={e => this.onPaymentTypeChange(e.target.value)}>
                                <Radio.Button value="Cash">Cash</Radio.Button>
                                <Radio.Button value="Bank Transfer">Transfer</Radio.Button>
                                <Radio.Button value="Other">Other</Radio.Button>
                            </Radio.Group>
                        </div>
                        <div className='memberDescriptionLine'>
                            <span className='memberDescriptionTitle'>Returning Member: </span>
                            <Radio.Group value={this.state.currentIsReturningMember} onChange={e => this.onIsReturningChange(e.target.value)}>
                                <Radio.Button value="Yes">Yes</Radio.Button>
                                <Radio.Button value="No">No</Radio.Button>
                            </Radio.Group>
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
                        <Button className='memberDescriptionButton' type='primary' loading={this.state.saving} onClick={this.onSaveClick}>Save {this.state.currentFirstName} {this.state.currentLastName}</Button>
                        <Popconfirm title={`Confirm delete ${this.state.currentFirstName}? RIP`} onConfirm={this.onRemoveClick}>
                            <Button className='memberDescriptionButton' type='danger' loading={this.state.removing}>Remove {this.state.currentFirstName} {this.state.currentLastName}</Button>
                        </Popconfirm>
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

export default withRouter(MemberDetails)