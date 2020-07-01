import React, { Component } from 'react'
import {Button, Popover, Alert, Select} from 'antd'
import './FirstTimeLogin.css'
import FirebaseUtil from '../../services/firebase.util'
import { AumtMember, AumtMembersObj } from '../../types'
import db from '../../services/db'

export interface FirstTimeLoginProps {

}
export interface FirstTimeLoginState {
    selectedMember: AumtMember | null
    authing: boolean
    errorMessage: string
    successMessage: string
    signedMembers: AumtMembersObj
}


export class FirstTimeLogin extends Component<FirstTimeLoginProps, FirstTimeLoginState> {
    private notOnListInfo = (
        <div className='notOnListPopover'>
            <p>
                Only members with active Semester 2 or Full Year memberships have accounts.
                This includes Semester One members who chose to defer their memberships.
            </p>
            <p>
                If you should be on the list or if you have any questions, message the committee!
            </p>
        </div>
    )
    constructor(props: FirstTimeLoginProps) {
        super(props)
        this.state = {
            selectedMember: null,
            authing: false,
            errorMessage: '',
            successMessage: '',
            signedMembers: {}
        }
    }
    componentDidMount = () => {
        db.getS22020Members()
            .then((members) => {
                this.setState({
                    ...this.state,
                    signedMembers: members
                })
            })
    }
    memberSort = (uidA: string, uidB: string): number => {
        const nameA = this.getMemberDisplayName(this.state.signedMembers[uidA])
        const nameB = this.getMemberDisplayName(this.state.signedMembers[uidB])
        return nameA > nameB ? 1 : -1
    }
    onNameSelected = (name: string, oProps: any) => {
        console.log('select', name, oProps.key)
        const {key} = oProps
        const selectedMember = this.state.signedMembers[key]
        if (selectedMember) {
            this.setState({
                ...this.state,
                selectedMember
            })
        } else {
            console.error('no member for key', key, name)
        }
    }
    getMemberDisplayName = (member: AumtMember) => {
        return `${member.preferredName || member.firstName} ${member.lastName}`
    }
    verifyJoinedEmail = () => {
        this.setState({
            ...this.state,
            authing: true,
            errorMessage: '',
            successMessage: ''
        })
        if (!this.state.selectedMember) {
            return
        }
        const {email} = this.state.selectedMember
        FirebaseUtil.sendPasswordResetEmail(email)
            .then(() => {
                this.setState({
                    ...this.state,
                    authing: false,
                    errorMessage: '',
                    successMessage: `Email sent to ${email}. Follow the link in the email to confirm your account - then you can sign in!`
                })
                document.getElementById('errorElementContainer')?.scrollIntoView()
            })
            .catch((err) => {
                this.setState({
                    ...this.state,
                    errorMessage: `Unable to send reset email. Contact the committee.`
                })
                document.getElementById('errorElementContainer')?.scrollIntoView()
                console.log(err)
            })
    }
    render() {
        return (
            <div className="firstTimeLoginContainer">
                <h3 className='firstTimeLoginHeader'>Already joined in Sem 1?</h3>
                <p className='joinedMemberText'>We created accounts for everyone who signed up in semester 1 2020.
                    All you need to do is choose a password to confirm your membership for Sem 2!</p>
                    <Select
                        showSearch
                        className='firstTimeLoginSelect'
                        placeholder='Select Your Name'
                        onChange={this.onNameSelected}
                    >
                        {Object.keys(this.state.signedMembers).sort((a, b) => this.memberSort(a, b)).map((uid: string) => {
                            const member = this.state.signedMembers[uid]
                            const displayName = this.getMemberDisplayName(member)
                            return <Select.Option key={uid} value={displayName}>
                                {displayName}
                            </Select.Option>
                        })}
                    </Select>
                <Button
                    onClick={this.verifyJoinedEmail}
                    disabled={!this.state.selectedMember}
                    loading={this.state.authing}>Create Password</Button>
                <Popover placement='topRight' content={this.notOnListInfo} trigger='click'>
                    <Button className='notOnListButton' type='link'>Not on the list?</Button>
                </Popover>
                <div className="clearBoth"></div>
                <div id="errorElementContainer">
                {this.state.errorMessage ? 
                    <Alert className='joinedEmailError' type='error' message={this.state.errorMessage}></Alert>
                    :
                this.state.successMessage ? 
                    <Alert className='joinedEmailError' type='success' message={this.state.successMessage}></Alert>
                : ''}
                </div>
            </div>
        )
    }
}

