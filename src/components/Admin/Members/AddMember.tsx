import React, {Component} from 'react'
import { Button, Input, Select, Tooltip } from 'antd'
import './AddMember.css'

interface AddMemberProps {}

interface AddMemberState {
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
            currentMembership: null,
            currentIsReturningMember: 'No',
            currentECName: '',
            currentECNumber: '',
            currentECRelationship: ''
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
    render() {
        return (
            <div>
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
                    </div>
                    <div className='memberDescriptionLine'>
                        <span className='memberDescriptionTitle'>Relation: </span>
                        <Input className='memberEditInput' value={this.state.currentECRelationship} onChange={e => this.onECRelationChange(e.target.value)}/>
                    </div>
                </div>
                {/* <div className="memberDescriptionSection">
                    <Button type='primary' loading={this.state.saving} onClick={this.onSaveClick}>Save</Button>
                </div> */}
            </div>
        )
    }
}