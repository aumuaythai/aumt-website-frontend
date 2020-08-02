import React, { Component } from 'react'
import {Button, Popover, Alert, Select} from 'antd'
import './FirstTimeLogin.css'
import FirebaseUtil from '../../services/firebase.util'
import { AumtMember, AumtMembersObjWithCollated } from '../../types'
import db from '../../services/db'
import { ResetPasswordLink } from '../Header/ResetLink'
import dataUtil from '../../services/data.util'

export interface FirstTimeLoginProps {

}
export interface FirstTimeLoginState {
    selectedMember: AumtMember | null
    authing: boolean
    errorMessage: string
    successMessage: string
    signedMembers: AumtMembersObjWithCollated
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
        // db.getS22020UnverifiedMembers()
        //     .then(dataUtil.getCollatedMembersObj)
        //     .then((members) => {
        //         this.setState({
        //             ...this.state,
        //             signedMembers: members
        //         })
        //     })
    }
    memberSort = (uidA: string, uidB: string): number => {
        const nameA = this.state.signedMembers[uidA].collated
        const nameB = this.state.signedMembers[uidB].collated
        return nameA > nameB ? 1 : -1
    }
    onNameSelected = (name: string, oProps: any) => {
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
                <p className='joinedMemberText'>We've created accounts for everyone who signed up in Sem 1 2020 and still has an active membership.
                    All you need to do is <ResetPasswordLink text=' reset your password '></ResetPasswordLink> to confirm your membership for Sem 2!</p>
                    {/* <Select
                        showSearch={window.innerWidth > 600}
                        className='firstTimeLoginSelect'
                        placeholder='Select Your Name'
                        onChange={this.onNameSelected}
                    >
                        {Object.keys(this.state.signedMembers).sort((a, b) => this.memberSort(a, b)).map((uid: string) => {
                            const member = this.state.signedMembers[uid]
                            return <Select.Option key={uid} value={member.collated}>
                                {member.collated}
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
                </div> */}
            </div>
        )
    }
}

