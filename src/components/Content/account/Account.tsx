import React, { Component } from 'react'

import { AumtMember, ClubConfig } from '../../../types';

import { Button, Input, notification, List, Radio, Spin } from 'antd';

import './Account.css'

import dataUtil from '../../../services/data.util'
import FirebaseUtil from '../../../services/firebase.util'
import db from '../../../services/db'
import Validator from '../../../services/validator'
import PaymentInstructions from '../../utility/PaymentInstructions';

interface AccountProps {
    authedUser: AumtMember
    authedUserId: string
    loadingAuthedUser: boolean
    clubSignupStatus: 'open' | 'closed' | 'loading'
    clubSignupSem: 'S1' | 'S2' | 'loading' | 'SS'
    clubConfig: ClubConfig | null
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
    editPersonal: boolean
    editUniversity: boolean
    editMembership: boolean
    editEC: boolean
}

export class Account extends Component<AccountProps, AccountState> {

    private originalState: AccountState;

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
            editPersonal: false,
            editUniversity: false,
            editMembership: false,
            editEC: false
        };

        this.originalState = {...this.state};
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
        this.setState({ ...this.state, currentMembership: newMembership, currentPaid: 'No' })
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

        /**
         * Additional backup check if the user has changed membership
         * we make damn sure they are set to 'not paid'.
         */ 
        if (this.state.currentMembership !== this.originalState.currentMembership) {
            this.setState({ ...this.state, currentPaid: 'No' });
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
                this.setState({ ...this.state, editPersonal: false, editMembership: false, editEC: false, editUniversity: false })
                this.originalState = { ...this.state };
                notification.success({ message: 'Details updated' })
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

    editPersonalChange = (toggle: boolean) => {
        this.setState({ ...this.state, editPersonal: toggle })
        if (!toggle) this.setState({ ...this.originalState })
    }

    editMembershipChange = (toggle: boolean) => {
        this.setState({ ...this.state, editMembership: toggle })
        if (!toggle) this.setState({ ...this.originalState })
    }

    editECChange = (toggle: boolean) => {
        this.setState({ ...this.state, editEC: toggle })
        if (!toggle) this.setState({ ...this.originalState })
    }

    editUniversityChange = (toggle: boolean) => {
        this.setState({ ...this.state, editUniversity: toggle })
        if (!toggle) this.setState({ ...this.originalState })
    }

    render() {
        if (this.props.authedUser) {
            return (
            <div className="accountContainer">

                <h1>Account Settings</h1>
                <p>
                    Here you can edit and update your details by clicking on the 'Edit' button for each section. 
                    In the membership section you can change your membership at the beginning of a new semester 
                    when signups for it opens.
                </p>
                
                <List header="Membership" footer={
                    <div className='listFooter'>
                        {this.state.editMembership ? 
                        <>
                            <Button danger type="primary" onClick={e => this.editMembershipChange(false)}>
                                Cancel
                            </Button>
                            {this.state.saving ? 
                            <Spin /> : 
                            <Button type="primary" onClick={this.onSaveClick}>
                                Save
                            </Button>}
                        </> : 
                        <Button onClick={e => this.editMembershipChange(true)}>
                            Edit
                        </Button>}
                    </div>
                } bordered className='listContainer'>
                    <List.Item>
                        <span>Current:
                            <b>
                                {this.state.currentMembership === 'S1' ? ' Semester 1' : ''}
                                {this.state.currentMembership === 'S2' ? ' Semester 2' : ''}
                                {this.state.currentMembership === 'SS' ? ' Summer School' : ''}
                                {this.state.currentMembership === 'FY' ? ' Full Year (Sem 1 and Sem 2)' : ''}
                            </b>
                        </span>
                    </List.Item>
                    <List.Item>
                        <span>Status: <b>{this.state.currentPaid === "Yes" ? "Paid" : "Not paid"}</b></span>
                    </List.Item>
                    <List.Item>
                        <span>Update membership options:</span>
                        <Radio.Group buttonStyle="solid" disabled={!this.state.editMembership} value={this.state.currentMembership} onChange={e => this.onMembershipChange(e.target.value)}>
                            {this.props.clubSignupSem === 'SS' ? 
                            <Radio.Button value="SS">Summer School</Radio.Button> : null}
                            {this.props.clubSignupSem === 'S1' ? 
                            <>
                                <Radio.Button value="FY">Full Year</Radio.Button>
                                <Radio.Button value="S1">Semester 1</Radio.Button>
                            </> : null}
                            {this.props.clubSignupSem === 'S2' ? 
                            <Radio.Button value="S2">Semester 2</Radio.Button> : null}
                        </Radio.Group>
                    </List.Item>
                    <List.Item>
                        <span>Payment Type</span>
                        <Radio.Group buttonStyle="solid" disabled={!this.state.editMembership} value={this.state.currentPaymentType} onChange={e => this.onPaymentTypeChange(e.target.value)}>
                            <Radio.Button value="Bank Transfer">Bank Transfer</Radio.Button>
                            <Radio.Button value="Cash">Cash</Radio.Button>
                            <Radio.Button value="Other">Other</Radio.Button>
                        </Radio.Group>
                    </List.Item>
                    {this.state.currentPaid === "No" ?
                    <List.Item>
                        <PaymentInstructions membershipType={this.state.currentMembership} paymentType={this.state.currentPaymentType} clubConfig={this.props.clubConfig} />
                    </List.Item> : null}
                </List>

                <List header="Personal" footer={
                    <div className='listFooter'>
                        {this.state.editPersonal ? 
                        <>
                            <Button type="primary" danger onClick={e => this.editPersonalChange(false)}>
                                Cancel
                            </Button>
                            {this.state.saving ? 
                            <Spin /> : 
                            <Button type="primary" onClick={this.onSaveClick}>
                                Save
                            </Button>}
                        </> : 
                        <Button onClick={e => this.editPersonalChange(true)}>
                            Edit
                        </Button>}
                    </div>
                } bordered className="listContainer">
                    <List.Item>
                        <span>First:</span>
                        <Input disabled={!this.state.editPersonal} className='memberEditInput' value={this.state.currentFirstName} onChange={e => this.onFirstNameChange(e.target.value)} />
                    </List.Item>
                    <List.Item>
                        <span>Last:</span>
                        <Input disabled={!this.state.editPersonal} className='memberEditInput' value={this.state.currentLastName} onChange={e => this.onLastNameChange(e.target.value)} />
                    </List.Item>
                    <List.Item>
                        <span>Preferred:</span>
                        <Input disabled={!this.state.editPersonal} className='memberEditInput' value={this.state.currentPreferredName} onChange={e => this.onPreferredNameChange(e.target.value)} />
                    </List.Item>
                    <List.Item>
                        <span>Email: {this.state.currentEmail}</span>
                    </List.Item>
                </List>

                <List header="University" footer={
                    <div className='listFooter'>
                        {this.state.editUniversity ? 
                        <>
                            <Button type="primary" danger onClick={e => this.editUniversityChange(false)}>
                                Cancel
                            </Button>
                            {this.state.saving ? 
                            <Spin /> : 
                            <Button type="primary" onClick={this.onSaveClick}>
                                Save
                            </Button>}
                        </> : 
                        <Button onClick={e => this.editUniversityChange(true)}>
                            Edit
                        </Button>}
                    </div>
                } bordered className="listContainer">
                    <List.Item>
                        <span>UoA Student:</span>
                        <Radio.Group disabled={!this.state.editUniversity} value={this.state.currentIsUoaStudent} onChange={e => this.onIsUoaChange(e.target.value)}>
                            <Radio.Button value="Yes">Yes</Radio.Button>
                            <Radio.Button value="No">No</Radio.Button>
                        </Radio.Group>
                    </List.Item>
                    {this.state.currentIsUoaStudent === "Yes" ? 
                        (<>
                            <List.Item>
                                <span>UPI:</span>
                                <Input disabled={!this.state.editUniversity} className='memberEditInput' value={this.state.currentUpi} onChange={e => this.onUpiChange(e.target.value)} />
                            </List.Item>
                            <List.Item>
                                <span>Student Id:</span>
                                <Input disabled={!this.state.editUniversity} className='memberEditInput' value={this.state.currentStudentId} onChange={e => this.onStudentIdChange(e.target.value)} />
                            </List.Item>
                        </>) : null}
                </List>

                <List header="Emergency Contact" footer={
                    <div className='listFooter'>
                        {this.state.editEC ? 
                        <>
                            <Button type="primary" danger onClick={e => this.editECChange(false)}>
                                Cancel
                            </Button>
                            {this.state.saving ? 
                            <Spin /> : 
                            <Button type="primary" onClick={this.onSaveClick}>
                                Save
                            </Button>}
                        </> : 
                        <Button onClick={e => this.editECChange(true)}>
                            Edit
                        </Button>}
                    </div>
                } bordered className='listContainer'>
                    <List.Item>
                        <span>Name: </span> 
                        <Input disabled={!this.state.editEC} className='memberEditInput' value={this.state.currentECName} onChange={e => this.onECNameChange(e.target.value)} />
                    </List.Item>
                    <List.Item>
                        <span>Number: </span>
                        <Input disabled={!this.state.editEC} className='memberEditInput' value={this.state.currentECNumber} onChange={e => this.onECNumberChange(e.target.value)} />
                    </List.Item>
                    <List.Item>
                        <span>Relationship: </span>
                        <Input disabled={!this.state.editEC} className='memberEditInput' value={this.state.currentECRelationship} onChange={e => this.onECRelationChange(e.target.value)} />
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
