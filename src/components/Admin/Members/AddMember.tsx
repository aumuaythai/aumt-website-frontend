import React, {Component} from 'react'
import { Button, Input, Select, notification } from 'antd'
import { AumtMember } from '../../../types'
import db from '../../../services/db'
import './AddMember.css'

interface AddMemberProps {}

interface AddMemberState {
    currentFirstName: string
    currentLastName: string
    currentPreferredName: string
    currentEmail: string
    currentIsUoaStudent: 'Yes' | 'No'
    currentInitialExperience: string
    currentUpi: string
    currentMembership: 'S1' | 'FY' | 'S2'
    currentIsReturningMember: 'Yes' | 'No'
    currentECName: string
    currentECNumber: string
    currentECRelationship: string
    saving: boolean
}

export class AddMember extends Component<AddMemberProps, AddMemberState> {
    constructor(props: AddMemberProps) {
        super(props)
        this.state = {
            currentFirstName: '',
            currentLastName: '',
            currentPreferredName: '',
            currentEmail: '',
            currentIsUoaStudent: 'Yes',
            currentUpi: '',
            currentInitialExperience: '',
            currentMembership: 'S1',
            currentIsReturningMember: 'No',
            currentECName: '',
            currentECNumber: '',
            currentECRelationship: '',
            saving: false
        }
    }
    generateMemberId = () => {
        const alphabet = '1234567890qwertyuiopasdfghjklzxcvbnm'
        let id = ''
        for (let i = 0; i < 28; i ++) {
            id += alphabet[Math.floor(Math.random() * alphabet.length)]
        }
        return id
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
    onMembershipChange = (membership: 'S1' | 'S2' | 'FY') => {
        let newMembership: 'S1' | 'S2' | 'FY' = membership
        this.setState({...this.state, currentMembership: newMembership})
    }
    onInitialExperienceChange = (experience: string) => {
        this.setState({...this.state, currentInitialExperience: experience})
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
            upi: this.state.currentUpi || '0',
            membership: this.state.currentMembership,
            initialExperience: this.state.currentInitialExperience,
            paid: 'No',
            instagramHandle: '',
            paymentType: 'Cash',
            isReturningMember: this.state.currentIsReturningMember,
            EmergencyContactName: this.state.currentECName,
            EmergencyContactNumber: this.state.currentECNumber,
            EmergencyContactRelationship: this.state.currentECRelationship,
            emailVerified: false,
        }
        if (!member.firstName || !member.lastName) {
            return notification.error({message: 'First and Last Name Required'})
        } else if (!member.email) {
            return notification.error({message: 'Email Required'})
        } else if (!member.isReturningMember) {
            return notification.error({message: 'You must specify if you are a returning member'})
        } else if (!member.isUoAStudent) {
            return notification.error({message: 'You must specify if you are a student'})
        } else if (!member.EmergencyContactName || !member.EmergencyContactNumber || !member.EmergencyContactRelationship) {
            return notification.error({message: 'All Emergency Contact Details are Required'})
        }
        this.setState({
            ...this.state,
            saving: true
        })
        db.setMember(this.generateMemberId(), member)
            .then(() => {
                notification.success({message: 'Saved'})
            })
            .catch((err) => {
                notification.error({message: err.toString()})
            })
            .finally(() => {
                this.setState({
                    ...this.state,
                    saving: false
                })
            })
    }
    render() {
        return (
            <div className='addMemberFormContainer'>
                <div className="addMemberSection">
                    <h3 className='addMemberSectionHeader'>Your Details</h3>
                    <div className='addMemberLine shortMemberLine'>
                        <span className='addMemberFieldTitle'>First Name<span className='requiredDot'>*</span>: </span>
                        <Input className='addMemberFieldInput' value={this.state.currentFirstName} onChange={e => this.onFirstNameChange(e.target.value)}/>
                    </div>
                    <div className='addMemberLine shortMemberLine'>
                        <span className='addMemberFieldTitle'>Last Name<span className='requiredDot'>*</span>: </span>
                        <Input className='addMemberFieldInput' value={this.state.currentLastName} onChange={e => this.onLastNameChange(e.target.value)}/>
                    </div>
                    <div className='addMemberLine shortMemberLine'>
                        <span className='addMemberFieldTitle'>Preferred Name (if different from First Name): </span>
                        <Input className='addMemberFieldInput' value={this.state.currentPreferredName} onChange={e => this.onPreferredNameChange(e.target.value)}/>
                    </div>
                    <div className='addMemberLine shortMemberLine'>
                        <span className='addMemberFieldTitle'>Email<span className='requiredDot'>*</span>: </span>
                        <Input className='addMemberFieldInput longAddMemberFieldInput' value={this.state.currentEmail} onChange={e => this.onEmailChange(e.target.value)}/>
                    </div>
                </div>
                <div className="addMemberSection">
                    <div className='addMemberLine'>
                        <span className='addMemberFieldTitle'>Are you a Student at the University of Auckland?<span className='requiredDot'>*</span> </span>
                        <Select value={this.state.currentIsUoaStudent} onChange={this.onIsUoaChange} style={{ width: 120 }}>
                            <Select.Option value="Yes">Yes</Select.Option>
                            <Select.Option value="No">No</Select.Option>
                        </Select>
                    </div>
                    <div className={`memberDescriptionLine ${this.state.currentIsUoaStudent === 'Yes' ? '' : 'noHeight'}`}>
                        <span className='addMemberFieldTitle'>UPI<span className='requiredDot'>*</span>: </span>
                        <Input className='addMemberFieldInput' value={this.state.currentUpi} onChange={e => this.onUpiChange(e.target.value)}/>
                    </div>
                    <div className='addMemberLine'>
                        <span className='addMemberFieldTitle'>Select Membership Duration<span className='requiredDot'>*</span>: </span>
                        <Select value={this.state.currentMembership} onChange={this.onMembershipChange} style={{ width: 220 }}>
                            <Select.Option value="S1">Semester 1</Select.Option>
                            <Select.Option value="S2">Semester 2</Select.Option>
                            <Select.Option value="FY">Full Year</Select.Option>
                        </Select>
                    </div>
                    <div className='addMemberLine'>
                        <span className='addMemberFieldTitle'>Are you a Returning Member?<span className='requiredDot'>*</span></span>
                        <Select value={this.state.currentIsReturningMember} onChange={this.onIsReturningChange} style={{ width: 120 }}>
                            <Select.Option value="Yes">Yes</Select.Option>
                            <Select.Option value="No">No</Select.Option>
                        </Select>
                    </div>
                </div>
                <div className="addMemberSection">
                    <h3 className='addMemberSectionHeader'>Emergency Contact Details</h3>
                    <div className='addMemberLine shortMemberLine'>
                        <span className='addMemberFieldTitle'>Name<span className='requiredDot'>*</span>: </span>
                        <Input className='addMemberFieldInput' value={this.state.currentECName} onChange={e => this.onECNameChange(e.target.value)}/>
                    </div>
                    <div className='addMemberLine shortMemberLine'>
                        <span className='addMemberFieldTitle'>Number<span className='requiredDot'>*</span>: </span>
                        <Input className='addMemberFieldInput' value={this.state.currentECNumber} onChange={e => this.onECNumberChange(e.target.value)}/>
                    </div>
                    <div className='addMemberLine shortMemberLine'>
                        <span className='addMemberFieldTitle'>Relation<span className='requiredDot'>*</span>: </span>
                        <Input className='addMemberFieldInput' value={this.state.currentECRelationship} onChange={e => this.onECRelationChange(e.target.value)}/>
                    </div>
                    <div className="clearBoth"></div>
                </div>
                <div className="addMemberSection">
                    <Button type='primary' loading={this.state.saving} onClick={this.onSaveClick}>Save</Button>
                </div>
            </div>
        )
    }
}