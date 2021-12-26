import React, { Component } from 'react'
import { FormInstance } from 'antd/lib/form';

import { AumtMember } from '../../../types';

import { Button, Form } from 'antd';

import './Account.css'

import dataUtil from '../../../services/data.util'

interface AccountProps {
    authedUser: AumtMember | null
    authedUserId: string
    loadingAuthedUser: boolean
    clubSignupStatus: 'open' | 'closed' | 'loading'
    clubSignupSem: 'S1' | 'S2' | 'loading' | 'SS'
};

interface AccountState {}

export class Account extends Component<AccountProps, AccountState> {
    private formRef = React.createRef<FormInstance>();

    copyText = (text: string) => {
        dataUtil.copyText(text)
    }

    onSubmitFail = () => {

    }

    onSubmit = () => {

    }

    render() {
        if (this.props.authedUser) {
            return (
            <div className="accountContainer">
                <Form scrollToFirstError ref={this.formRef} onFinishFailed={this.onSubmitFail} onFinish={this.onSubmit}></Form>
                <h1>My Account</h1>
                <h4>Here you can update your personal details and membership</h4>

                <h1>My Membership</h1>
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
                
                {this.props.authedUser.paid === 'No' ? <p>
                    If paying by Bank Transfer, include your 'NAME' and
                    {this.props.clubSignupSem === 'S1' ? ` 'AUMTS1' (for one semester) or AUMTFY (for one year) ` : ''}
                    {this.props.clubSignupSem === 'S2' ? ` 'AUMTS2' (for one semester) ` : ''}
                    {this.props.clubSignupSem === 'SS' ? ` 'AUMTSS' (for summer school) ` : ''}
                    as the reference.
                    Membership is 
                    {this.props.clubSignupSem === 'S1' ? ' $50 for the semester or $90 for the year ': ''}
                    {this.props.clubSignupSem === 'S2' ? ' $50 for the semester ': ''}
                    {this.props.clubSignupSem === 'SS' ? ' $30 for summer school ': ''}
                    and should be paid with your full name as the reference to: 06-0158-0932609-00
                    <Button type='link' onClick={e => this.copyText('06-0158-0932609-00')}>Copy Account Number</Button>
                </p>: null}
                
            </div>
        )} else {
            return (<h1>Account Page</h1>)
        }

    }
    
}
