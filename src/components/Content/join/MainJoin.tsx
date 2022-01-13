import React, {Component} from 'react'
import { Link } from 'react-router-dom'
import { Result, Button, notification, Spin } from 'antd'
import { JoinForm } from './JoinForm'
import './MainJoin.css'
import { AumtMember, ClubConfig } from '../../../types'
import FirebaseUtil from '../../../services/firebase.util'
import dataUtil from '../../../services/data.util'

interface MainJoinProps {
    authedUser: AumtMember | null
    authedUserId: string
    loadingAuthedUser: boolean
    clubConfig: ClubConfig | null
}

interface MainJoinState {}

export class MainJoin extends Component<MainJoinProps, MainJoinState> {

    onSignOutClick = () => {
        FirebaseUtil.signOut()
            .catch((err) => {
                notification.error({message: 'Error signing out: ' + err.toString()})
            })
    }

    copyText = (text: string) => {
        dataUtil.copyText(text)
    }

    getExtraResultContent = () => {
        const clubSignupSem = this.props.clubConfig?.clubSignupSem;
        const summerSchoolFee = this.props.clubConfig?.summerSchoolFee;
        const semesterOneFee = this.props.clubConfig?.semesterOneFee;
        const semesterTwoFee = this.props.clubConfig?.semesterTwoFee;
        const fullYearFee = this.props.clubConfig?.fullYearFee;
        const bankAccountNumber = this.props.clubConfig?.bankAccountNumber;

        const lines: JSX.Element[] = []
        if (this.props.authedUser?.paid === 'No') {
            lines.push(
                <div>
                <h1>However, membership payment pending</h1>
                <p className='joinAccountLine'>
                    If paying by Bank Transfer, include your 'NAME' and
                    {clubSignupSem === 'S1' ? ` 'AUMTS1' (for one semester) or AUMTFY (for one year) ` : ''}
                    {clubSignupSem === 'S2' ? ` 'AUMTS2' (for one semester) ` : ''}
                    {clubSignupSem === 'SS' ? ` 'AUMTSS' (for summer school) ` : ''}
                    as the reference.
                    Membership is 
                    {clubSignupSem === 'S1' ? ` $${semesterOneFee} for the semester or $${fullYearFee} for the year `: ''}
                    {clubSignupSem === 'S2' ? ` $${semesterTwoFee} for the semester `: ''}
                    {clubSignupSem === 'SS' ? ` $${summerSchoolFee} for summer school ` : ''}
                    and should be paid with your full name as the reference to: {bankAccountNumber}
                    <Button type='link' onClick={e => this.copyText(`${bankAccountNumber}`)}>Copy Account Number</Button>
                </p>
                </div>
            )
        } else {
            lines.push(
                <div>
                    <h1>Our records show you have paid</h1>
                    <p className='joinAccountLine'>
                        You can now signup to our <a href="/signups">weekly training</a> sessions.
                    </p>
                </div>
            )
        }

        if (this.props.clubConfig?.clubSignupStatus === 'open') {
            lines.push(
                <p key='1'>
                    <Button type='link' className='joinResultSignOut' onClick={this.onSignOutClick}>
                        Log out 
                    </Button>
                    and return to the signup page, or 
                    <Link to='/'>
                        <Button className='joinResultSignOut' type='link'>visit home page</Button>
                    </Link>
                </p>
            )
        } 
        
        return lines
    }
    render() {
        if (this.props.clubConfig === null || this.props.loadingAuthedUser) return <Spin/>
        
        if (this.props.authedUser) {
            return (
                <div>
                    <Result
                        className='joinResult'
                        status='success'
                        title='You are a member of AUMT!'
                        extra={this.getExtraResultContent()}/>
                    <h1>Your Current Membership</h1>
                    <p>
                        Membership coverage: 
                        <b>
                            {this.props.authedUser.membership === 'S1' ? ' Semester 1 ': ''}
                            {this.props.authedUser.membership === 'S2' ? ' Semester 2 ': ''}
                            {this.props.authedUser.membership === 'SS' ? ' Summer School ': ''}
                            {this.props.authedUser.membership === 'FY' ? ' Full Year (Semester 1 and 2)': ''}
                        </b>
                    </p>
                    <p>
                        Status:
                        <b>{this.props.authedUser.paid === 'Yes' ? ' Paid ': ' Not Paid '}</b>
                    </p>
                </div>
                
            )
        } 
        
        if (this.props.clubConfig.clubSignupStatus === 'closed') {
            return (
                <div>
                    Signups are closed until the next semester starts. Follow us on
                        <a href="https://www.instagram.com/aumuaythai/" target='_blank' rel="noopener noreferrer"> Instagram </a>
                        or 
                        <a href="https://www.facebook.com/aumuaythai/"> Facebook </a>
                        for announcements.
                </div>
            )
        }

        return (
            <div>
                <JoinForm clubConfig={this.props.clubConfig} isAdmin={false}></JoinForm>
            </div>
        )
    }
}