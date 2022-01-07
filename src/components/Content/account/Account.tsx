import React, { Component } from 'react'

import { AumtMember } from '../../../types';

import { Button, Input, notification, List, Radio } from 'antd';
import { FormOutlined } from '@ant-design/icons'

import './Account.css'

import dataUtil from '../../../services/data.util'
import FirebaseUtil from '../../../services/firebase.util'
import db from '../../../services/db'
import Validator from '../../../services/validator'

interface AccountProps {
    authedUser: AumtMember
    authedUserId: string
    loadingAuthedUser: boolean
    clubSignupStatus: 'open' | 'closed' | 'loading'
    clubSignupSem: 'S1' | 'S2' | 'loading' | 'SS'
};

interface AccountState {
    currentFirstName: string
    currentLastName: string
    currentPreferredName: string
    currentEmail: string
    currentIsUoaStudent: 'Yes' | 'No'
    currentUpi: string
    currentStudentId: string
    currentMembership: 'S1' | 'FY' | 'S2' | 'SS'
    currentPaid: 'Yes' | 'No',
    currentNotes: string
    currentPaymentType: 'Bank Transfer' | 'Cash' | 'Other'
    currentIsReturningMember: 'Yes' | 'No'
    currentInterestedInCamp: 'Yes' | 'No'
    currentInitialExperience: string
    currentECName: string
    currentECNumber: string
    currentECRelationship: string
    saving: boolean
}

export class Account extends Component<AccountProps, AccountState> {
    constructor(props: AccountProps) {
        super(props)
        this.state = {
            currentFirstName: props.authedUser.firstName,
            currentLastName: props.authedUser.lastName,
            currentPreferredName: props.authedUser.preferredName,
            currentEmail: props.authedUser.email,
            currentIsUoaStudent: props.authedUser.isUoAStudent,
            currentUpi: props.authedUser.upi,
            currentStudentId: props.authedUser.studentId,
            currentMembership: props.authedUser.membership,
            currentPaid: props.authedUser.paid,
            currentNotes: props.authedUser.notes,
            currentPaymentType: props.authedUser.paymentType,
            currentIsReturningMember: props.authedUser.isReturningMember,
            currentInterestedInCamp: props.authedUser.interestedInCamp,
            currentInitialExperience: props.authedUser.initialExperience,
            currentECName: props.authedUser.EmergencyContactName,
            currentECNumber: props.authedUser.EmergencyContactNumber,
            currentECRelationship: props.authedUser.EmergencyContactRelationship,
            saving: false,
        }
    }

    componentDidUpdate = (prevProps: AccountProps) => {
        if (this.props !== prevProps) {
            this.setState({
                ...this.state,
                currentFirstName: this.props.authedUser.firstName,
                currentLastName: this.props.authedUser.lastName,
                currentPreferredName: this.props.authedUser.preferredName,
                currentEmail: this.props.authedUser.email,
                currentInitialExperience: this.props.authedUser.initialExperience,
                currentIsUoaStudent: this.props.authedUser.isUoAStudent,
                currentUpi: this.props.authedUser.upi,
                currentStudentId: this.props.authedUser.studentId,
                currentMembership: this.props.authedUser.membership,
                currentPaid: this.props.authedUser.paid,
                currentNotes: this.props.authedUser.notes,
                currentPaymentType: this.props.authedUser.paymentType,
                currentIsReturningMember: this.props.authedUser.isReturningMember,
                currentInterestedInCamp: this.props.authedUser.interestedInCamp,
                currentECName: this.props.authedUser.EmergencyContactName,
                currentECNumber: this.props.authedUser.EmergencyContactNumber,
                currentECRelationship: this.props.authedUser.EmergencyContactRelationship
            })
        }
    }

    onFirstNameChange = (newName: string) => {
        this.setState({ ...this.state, currentFirstName: newName })
    }
    onLastNameChange = (newName: string) => {
        this.setState({ ...this.state, currentLastName: newName })
    }
    onPreferredNameChange = (newName: string) => {
        this.setState({ ...this.state, currentPreferredName: newName })
    }
    onEmailChange = (newEmail: string) => {
        this.setState({ ...this.state, currentEmail: newEmail })
    }
    onIsUoaChange = (isUoa: 'Yes' | 'No') => {
        this.setState({ ...this.state, currentIsUoaStudent: isUoa })
    }
    onUpiChange = (upi: string) => {
        this.setState({ ...this.state, currentUpi: upi })
    }
    onStudentIdChange = (newId: string) => {
        this.setState({ ...this.state, currentStudentId: newId })
    }  
    onMembershipChange = (membership: 'S1' | 'S2' | 'FY' | 'SS') => {
        let newMembership: 'S1' | 'S2' | 'FY' | 'SS' = membership
        this.setState({ ...this.state, currentMembership: newMembership })
    }
    onInterestedInCampChange = (interested: 'Yes' | 'No') => {
        this.setState({ ...this.state, currentInterestedInCamp: interested })
    }
    onPaidChange = (paid: 'Yes' | 'No') => {
        this.setState({ ...this.state, currentPaid: paid })
    }
    onNotesChange = (notes: string) => {
        this.setState({ ...this.state, currentNotes: notes })
    }
    onPaymentTypeChange = (payment: 'Bank Transfer' | 'Cash' | 'Other') => {
        this.setState({ ...this.state, currentPaymentType: payment })
    }
    onIsReturningChange = (isReturning: 'Yes' | 'No') => {
        this.setState({ ...this.state, currentIsReturningMember: isReturning })
    }
    onInitialExperienceChange = (experience: string) => {
        this.setState({ ...this.state, currentInitialExperience: experience })
    }
    onECNameChange = (name: string) => {
        this.setState({ ...this.state, currentECName: name })
    }
    onECNumberChange = (number: string) => {
        this.setState({ ...this.state, currentECNumber: number })
    }
    onECRelationChange = (relation: string) => {
        this.setState({ ...this.state, currentECRelationship: relation })
    }

    onSaveClick = () => {
        const member: AumtMember = {
            firstName: this.state.currentFirstName,
            lastName: this.state.currentLastName,
            preferredName: this.state.currentPreferredName,
            email: this.state.currentEmail,
            isUoAStudent: this.state.currentIsUoaStudent,
            upi: this.state.currentUpi || '0',
            studentId: this.state.currentStudentId || '0',
            membership: this.state.currentMembership,
            paid: this.state.currentPaid,
            notes: this.state.currentNotes,
            isReturningMember: this.state.currentIsReturningMember,
            interestedInCamp: this.state.currentInterestedInCamp,
            initialExperience: this.state.currentInitialExperience || '',
            EmergencyContactName: this.state.currentECName,
            EmergencyContactNumber: this.state.currentECNumber,
            EmergencyContactRelationship: this.state.currentECRelationship,
            timeJoinedMs: this.props.authedUser.timeJoinedMs,
            paymentType: this.state.currentPaymentType
        }
        
        const errorStr = Validator.createAumtMember(member)
        if (typeof (errorStr) === 'string') {
            return notification.error({ message: errorStr })
        }
        if (this.props.authedUser.email !== this.state.currentEmail) {
            notification.open({ message: 'Reminder: If you change the email here, also change it in Firebase by using the Admin SDK (see firebase user management guide)' })
        }
        
        this.setState({ ...this.state, saving: true })
        
        db.setMember(this.props.authedUserId, member)
            .then(() => {
                this.setState({ ...this.state, saving: false })
                notification.success({ message: 'Saved' })
            })
            .catch((err) => {
                notification.error({ message: 'Could not save member' + err.toString() })
            })
    }

    copyText = (text: string) => {
        dataUtil.copyText(text)
    }

    onSignOutClick = () => {
        FirebaseUtil.signOut()
            .catch((err) => {
                notification.error({message: 'Error signing out: ' + err.toString()})
            })
    }

    render() {
        if (this.props.authedUser) {
            return (
            <div className="accountContainer">

                <h1>Account Settings</h1>
                <p>Here you can edit and update you details. You can also upgrade your membership between semesters.</p>
                
                <List header="Membership" bordered className='listContainer'>
                    <List.Item>
                        <span>Type: </span>
                        <Radio.Group value={this.state.currentMembership} onChange={e => this.onMembershipChange(e.target.value)}>
                            <Radio.Button value="S1">Semester 1</Radio.Button>
                            <Radio.Button value="S2">Semester 2</Radio.Button>
                            <Radio.Button value="FY">Full Year</Radio.Button>
                            <Radio.Button value="SS">Summer School</Radio.Button>
                        </Radio.Group>
                    </List.Item>
                    <List.Item>
                        <span>Status: {this.state.currentPaid === "Yes" ? "Paid" : "Not paid"}</span>
                    </List.Item>
                </List>

                <List header="Personal" bordered className="listContainer">
                    <List.Item>
                        <span>First:</span>
                        <Input disabled className='memberEditInput' value={this.state.currentFirstName} onChange={e => this.onFirstNameChange(e.target.value)} />
                        <FormOutlined />
                    </List.Item>
                    <List.Item>
                        <span>Last:</span>
                        <Input className='memberEditInput' value={this.state.currentLastName} onChange={e => this.onLastNameChange(e.target.value)} />
                    </List.Item>
                    <List.Item>
                        <span>Preferred:</span>
                        <Input className='memberEditInput' value={this.state.currentPreferredName} onChange={e => this.onPreferredNameChange(e.target.value)} />
                    </List.Item>
                    <List.Item>
                        <span>Email:</span>
                        <Input className='memberEditInput' value={this.state.currentEmail} onChange={e => this.onEmailChange(e.target.value)} />
                    </List.Item>
                </List>

                <List header="University" bordered className="listContainer">
                    <List.Item>
                        <span>UoA Student:</span>
                        <Radio.Group value={this.state.currentIsUoaStudent} onChange={e => this.onIsUoaChange(e.target.value)}>
                            <Radio.Button value="Yes">Yes</Radio.Button>
                            <Radio.Button value="No">No</Radio.Button>
                        </Radio.Group>
                    </List.Item>
                    {this.state.currentIsUoaStudent === "Yes" ? 
                        (<>
                            <List.Item>
                                <span>UPI:</span>
                                <Input className='memberEditInput' value={this.state.currentUpi} onChange={e => this.onUpiChange(e.target.value)} />
                            </List.Item>
                            <List.Item>
                                <span>Student Id:</span>
                                <Input className='memberEditInput' value={this.state.currentStudentId} onChange={e => this.onStudentIdChange(e.target.value)} />
                            </List.Item>
                        </>) : null}
                </List>

                <List header="Emergency Contact" bordered className='listContainer'>
                    <List.Item>
                        <span>Name: </span> 
                        <Input className='memberEditInput' value={this.state.currentECName} onChange={e => this.onECNameChange(e.target.value)} />
                    </List.Item>
                    <List.Item>
                        <span>Number: {this.state.currentPaid}</span>
                        <Input className='memberEditInput' value={this.state.currentECNumber} onChange={e => this.onECNumberChange(e.target.value)} />
                    </List.Item>
                    <List.Item>
                        <span>Relationship</span>
                        <Input className='memberEditInput' value={this.state.currentECRelationship} onChange={e => this.onECRelationChange(e.target.value)} />
                    </List.Item>
                </List>

                <p style={{textAlign: "center"}}>
                    Click here to
                    <Button type='link' className='joinResultSignOut' onClick={this.onSignOutClick}>
                        Log out 
                    </Button> 
                </p>
                
            </div>
        )} else {
            return (<h1>Account Page</h1>)
        }

    }
    
}
