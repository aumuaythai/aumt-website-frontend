import React, {Component} from 'react'
import {Form, Radio, Input, Button, Tooltip, message, notification, Alert} from 'antd'
import { QuestionCircleOutlined } from '@ant-design/icons'
import './JoinForm.css'
import { FormInstance } from 'antd/lib/form';
import DataFormatterUtil from '../../../services/data.util'
import { AumtMember } from '../../../types';
import FirebaseUtil from '../../../services/firebase.util';
import db from '../../../services/db';

interface JoinFormProps {
    isAdmin: boolean
    clubSignupSem: 'S1' | 'S2' | null
}

interface JoinFormState {
    currentExperienceInMuayThai: string
    submitting: boolean
}

export class JoinForm extends Component<JoinFormProps, JoinFormState> {
    private formRef = React.createRef<FormInstance>();
    private currentYear = new Date().getFullYear()
    private verticalRadioStyle = {
        display: 'block'
    }
    private alignInputLayout = {
        labelCol: {span: 7},
        wrapperCol: {span: 17}
    }
    constructor(props: JoinFormProps) {
        super(props)
        this.state = {
            currentExperienceInMuayThai: '',
            submitting: false
        }
    }
    private onSubmitFail = (obj: any) => {
        const {errorFields} = obj
        if (errorFields && errorFields.length) {
            notification.error({message: obj.errorFields[0].errors[0], duration: 1.5})
        }
    }
    private onSubmit = (values: any) => {
        const {
            UoaStudent,
            ReturningMember,
            FirstName,
            LastName,
            PreferredName,
            Experience,
            EmergencyContactName,
            EmergencyContactNumber,
            EmergencyContactRelationship,
            Insta,
            Paid,
            Membership,
            upi,
            email,
            password,
            Payment
        } = values
            const member: AumtMember = {
                firstName: FirstName,
                lastName: LastName,
                preferredName: PreferredName || '',
                email: email,
                isUoAStudent: UoaStudent,
                upi: upi || '0',
                membership: Membership ? Membership : 'S2',
                initialExperience: Experience,
                instagramHandle: Insta || '',
                paymentType: Payment,
                paid: Paid || 'No',
                isReturningMember: ReturningMember,
                EmergencyContactName,
                EmergencyContactNumber,
                EmergencyContactRelationship,
                emailVerified: false,
            }
            this.setState({
                ...this.state,
                submitting: true
            })
            const key = 'submitFormMessage'
            message.loading({content: 'Creating User', key})
            FirebaseUtil.createUser(email, password)
                .then((userCredential) => {
                    const {user} = userCredential
                    if (!user) {
                        throw new Error('No user returned from Firebase create')
                    }
                    return user.uid
                })
                .then((uid: string) => {
                    message.loading({content: 'Adding to Club', key})
                    return db.setMember(uid, member)
                })
                .then(() => {
                    message.success({content: 'You are now part of the club!', key, duration: 5})
                })
                .catch((err) => {
                    if (err.code === 'auth/email-already-in-use') {
                        return message.error({content: 'Email already in use. Contact the AUMT committee ', key, duration: 5})
                    }
                    return message.error({content: err.toString(), key, duration: 5})
                })
                .finally(() => {
                    this.setState({
                        ...this.state,
                        submitting: false
                    })
                })
    }
    private copyText = (text: string) => {
        DataFormatterUtil.copyText(text)
    }
    render() {
        return (
            <div className='joinFormContainer'>
                {!this.props.isAdmin ?
                <div>
                    <h2>AUMT {this.currentYear} {this.props.clubSignupSem === 'S2' ? 'Sem 2 ' : ''}Club Sign-ups</h2>
                    <p>Membership is $50 for the semester{this.props.clubSignupSem === 'S1' ? ' or $90 for the year ': ''} and includes a training session each week!
                        Please pay membership fees to the account below and add your NAME and 
                        {this.props.clubSignupSem === 'S1' ? ` 'AUMTS1' (for one semester) or AUMTFY (for one year) ` : ' AUMTS2 '}
                         as the reference.</p>
                    <p>06-0158-0932609-00 <Button type='link' onClick={e => this.copyText('06-0158-0932609-00')}>Copy Account Number</Button></p>
                    <p>Our sign-up sheets for training will be posted to aumt.co.nz/signups, so look out for it!</p>
                    <h3>DISCLAIMER:</h3>
                    <p>I understand that by filling up and submitting this form, I am taking part in the club activities at my own risk and any injuries sustained to any person or any damage to any equipment during the ordinary course of training will not be the responsibility of the club. Any loss of equipment or personal belongings is under the sole responsibility of the member, and the club as well as the training facility will not be held responsible. </p>
                </div>
                :
                <div>
                    <Alert type='warning' message='NOTE TO ADMIN' description='Adding a member here will only add them to the database and not give them a login (email and password). You must also create an account for them at the Firebase console in the Authentication section'></Alert>
                </div>
                }
                <div className="joinFormEntry">
                    <Form scrollToFirstError ref={this.formRef} onFinishFailed={this.onSubmitFail} onFinish={this.onSubmit}>
                        {!this.props.isAdmin ? 
                        <Form.Item name='Disclaimer' rules={[{ required: true }]} label='Have you read and understood the above disclaimer?'>
                            <Radio.Group name="DisclaimerRadio">
                                <Radio value='Yes'>Yes</Radio>
                            </Radio.Group>
                        </Form.Item>
                        : ''}
                        <Form.Item name='UoaStudent' rules={[{ required: true }]} label='Are you a current UoA student? '>
                            <Radio.Group buttonStyle="solid" name="UoaStudentRadio" onChange={e => this.forceUpdate()}>
                                <Radio.Button value={'Yes'}>Yes</Radio.Button>
                                <Radio.Button value={'No'}>No</Radio.Button>
                            </Radio.Group>
                        </Form.Item>
                        {this.formRef.current?.getFieldValue('UoaStudent') !== 'No' ? 
                           <Form.Item  {...this.alignInputLayout} name='upi' label={
                            <span>
                                UPI&nbsp;
                                <Tooltip title="This is the part before your university email (e.g. jdoe295)">
                                    <QuestionCircleOutlined />
                                </Tooltip>
                            </span>
                           } rules={[{ required: true}]}>
                               <Input className='joinFormInput'/>
                           </Form.Item>
                           : ''}
                        <Form.Item name='ReturningMember' rules={[{ required: true }]} label='Are you a returning AUMT member? '>
                            <Radio.Group buttonStyle="solid" name="ReturningMemberRadio">
                                <Radio.Button value={'Yes'}>Yes</Radio.Button>
                                <Radio.Button value={'No'}>No</Radio.Button>
                            </Radio.Group>
                        </Form.Item>
                        <Form.Item  {...this.alignInputLayout} name='FirstName' rules={[{ required: true }]} label='First Name '>
                            <Input className='joinFormInput'/>
                        </Form.Item>
                        <Form.Item  {...this.alignInputLayout} name='LastName' rules={[{ required: true }]} label='Last Name '>
                            <Input className='joinFormInput'/>
                        </Form.Item>
                        <Form.Item  {...this.alignInputLayout} name='PreferredName' label='Preferred Name'>
                            <Input className='joinFormInput' placeholder='If different from first name'/>
                        </Form.Item>
                        <Form.Item rules={[{ required: true }]} name='Experience' label='Experience in Muay Thai'>
                            <Radio.Group name="ExperienceRadio" onChange={v => this.setState({...this.state,currentExperienceInMuayThai: v.target.value})}>
                                <Radio style={this.verticalRadioStyle} value={'None'}>None</Radio>
                                <Radio style={this.verticalRadioStyle} value={'Beginner/Intermediate'}>Beginner/Intermediate</Radio>
                                <Radio style={this.verticalRadioStyle} value={'Advanced'}>Advanced</Radio>
                                <Radio style={this.verticalRadioStyle} value={'Other'}>
                                    Other...
                                    {this.state.currentExperienceInMuayThai === 'Other' ? <Input className='joinFormInput' style={{ width: 100, marginLeft: 10 }}/> : ''}
                                </Radio>
                                
                            </Radio.Group>
                        </Form.Item>
                        <h3 className='formSectionHeader'>Emergency Contact Details</h3>
                        <Form.Item  {...this.alignInputLayout} rules={[{ required: true }]} name='EmergencyContactName' label='Name'>
                            <Input className='joinFormInput'/>
                        </Form.Item>
                        <Form.Item  {...this.alignInputLayout} rules={[{ required: true }]} name='EmergencyContactNumber' label='Phone Number'>
                            <Input className='joinFormInput'/>
                        </Form.Item>
                        <Form.Item  {...this.alignInputLayout} rules={[{ required: true }]} name='EmergencyContactRelationship' label='Relationship'>
                            <Input className='joinFormInput'/>
                        </Form.Item>
                        <h3 className='formSectionHeader'>Socials</h3>
                        <p>Like our facebook page, Auckland University Muay Thai, for all important info and announcements.</p>
                        <Form.Item name='FacebookAccount' rules={[{ required: true }]} label='Do you have a Facebook account?'>
                            <Radio.Group name="HasFacebookRadio">
                                <Radio value={'Yes'}>Yes - like our page</Radio>
                                <Radio value={'No'}>No</Radio>
                            </Radio.Group>
                        </Form.Item>
                        <Form.Item  name='Insta' label='What is your instagram handle?'>
                            <Input prefix='@' className='joinFormInput' placeholder='Optional, if you want the club to follow you'/>
                        </Form.Item>
                        {!this.props.isAdmin ? 
                        <div>
                            <h3 className='formSectionHeader'>Account</h3>
                            <p>This is your account to sign in to this site for trainings and events.
                                Your email here will be used both as your username for the account and as a point of contact for club announcements and invitations.
                                You can reset your password at any time.</p>
                        </div>
                        : ''}
                        <Form.Item  {...this.alignInputLayout} rules={[{ required: true }]} name='email' label='Email'>
                            <Input className='joinFormInput'/>
                        </Form.Item>
                        {!this.props.isAdmin ?
                        <Form.Item {...this.alignInputLayout} rules={[{ required: true }]} name='password' label='Password'>
                            <Input.Password className='joinFormInput'/>
                        </Form.Item>
                        : ''}
                        <h3 className='formSectionHeader'>Payment</h3>
                        {(this.props.clubSignupSem === 'S1' || this.props.isAdmin) ? 
                        <Form.Item name='Membership' rules={[{ required: true }]} label='Membership Duration'>
                            <Radio.Group buttonStyle="solid" name="MembershipRadio">
                                <Radio.Button value={'S1'}>Semester 1</Radio.Button>
                                {this.props.isAdmin ? 
                                <Radio.Button value='S2'>Semester 2</Radio.Button>
                                : ''}
                                <Radio.Button value={'FY'}>Full Year</Radio.Button>
                            </Radio.Group>
                        </Form.Item>
                        : ''}
                        <Form.Item name='Payment' rules={[{ required: true }]} label='Payment Type'>
                            <Radio.Group buttonStyle="solid" name="PaymentRadio">
                                <Radio.Button value={'Bank Transfer'}>Bank Transfer</Radio.Button>
                                <Radio.Button value={'Cash'}>Cash</Radio.Button>
                            </Radio.Group>
                        </Form.Item>
                        {this.props.isAdmin ?
                        <Form.Item name='Paid' rules={[{ required: true }]} label='Paid?'>
                            <Radio.Group buttonStyle="solid" name="PaidRadio">
                                <Radio.Button value={'Yes'}>Yes</Radio.Button>
                                <Radio.Button value={'No'}>No</Radio.Button>
                            </Radio.Group>
                        </Form.Item>
                        : ''}
                        {!this.props.isAdmin ?
                        <div>
                            <p>If paying by Bank Transfer, include your NAME and
                                {this.props.clubSignupSem === 'S1' ? ` 'AUMTS1' (for one semester) or AUMTFY (for one year) ` : ' AUMTS2 '}
                                as the reference.
                                Membership is $50 {this.props.clubSignupSem === 'S1' ? ' for one semester or $90 for the year': ' for Semester 2'}.
                                Please make your payment to the following account:</p>
                            <p>06-0158-0932609-00 <Button type='link' onClick={e => this.copyText('06-0158-0932609-00')}>Copy Account Number</Button></p>
                            <p>Once the committee receives your payment, you will be able to sign up for trainings!</p>
                        </div>
                        : ''}
                        <Form.Item>
                            <Button loading={this.state.submitting} block type="primary" htmlType="submit">
                                Submit
                            </Button>
                        </Form.Item>
                    </Form>
                </div>
            </div>
        )
    }
}