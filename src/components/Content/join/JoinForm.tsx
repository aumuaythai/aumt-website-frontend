import React, {Component} from 'react'
import {Form, Radio, Input, Button, Tooltip} from 'antd'
import { QuestionCircleOutlined } from '@ant-design/icons'
import './JoinForm.css'
import { FormInstance } from 'antd/lib/form';
import DataFormatterUtil from '../../../services/data.util'
import { AumtMember } from '../../../types';
import FirebaseUtil from '../../../services/firebase.util';

interface JoinFormProps {}

interface JoinFormState {
    currentExperienceInMuayThai: string
    submitting: boolean
}

export class JoinForm extends Component<JoinFormProps, JoinFormState> {
    private formRef = React.createRef<FormInstance>();
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
                membership: 'S2',
                initialExperience: Experience,
                instagramHandle: Insta || '',
                paymentType: Payment,
                paid: 'No',
                isReturningMember: ReturningMember,
                EmergencyContactName,
                EmergencyContactNumber,
                EmergencyContactRelationship,
                emailVerified: false,
            }
            FirebaseUtil.createUser(email, password)
                .then((userCredential) => {
                    const {user} = userCredential
                    if (user) {

                    } else {

                    }
                    console.log(user)
                })
                .catch((err) => {
                    if (err.code === 'auth/email-already-in-use') {
                    }
                })
    }
    private copyText = (text: string) => {
        DataFormatterUtil.copyText(text)
    }
    render() {
        return (
            <div className='joinFormContainer'>
                <h2>AUMT 2020 Sem 2 Club Sign-ups</h2>
                <p>Membership is $50 for the semester and includes a training session each week!
                    Please pay membership fees to the account below and add your NAME and 'AUMTS2' as the reference.</p>
                <p>06-0158-0932609-00 <Button type='link' onClick={e => this.copyText('06-0158-0932609-00')}>Copy Account Number</Button></p>
                <p>Our sign-up sheets for training will be posted to aumt.co.nz/signups, so look out for it!</p>
                <h3>DISCLAIMER:</h3>
                <p>I understand that by filling up and submitting this form, I am taking part in the club activities at my own risk and any injuries sustained to any person or any damage to any equipment during the ordinary course of training will not be the responsibility of the club. Any loss of equipment or personal belongings is under the sole responsibility of the member, and the club as well as the training facility will not be held responsible. </p>
                <div className="joinFormEntry">
                    <Form ref={this.formRef} onFinish={this.onSubmit}>
                        <Form.Item name='Disclaimer' rules={[{ required: true }]} label='Have you read and understood the above disclaimer?'>
                            <Radio.Group name="DisclaimerRadio">
                                <Radio value='Yes'>Yes</Radio>
                            </Radio.Group>
                        </Form.Item>
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
                        <Form.Item name='FacebookAccount' rules={[{ required: true }]} label='Do you have a Facebook account?'>
                            <Radio.Group name="HasFacebookRadio">
                                <Radio value={'Yes'}>Yes - like our page, Auckland University Muay Thai, for all important info and announcements</Radio>
                                <Radio value={'No'}>No</Radio>
                            </Radio.Group>
                        </Form.Item>
                        <Form.Item  name='Insta' label='What is your instagram handle?'>
                            <Input prefix='@' className='joinFormInput' placeholder='Optional, if you want the club to follow you'/>
                        </Form.Item>
                        <h3 className='formSectionHeader'>Account</h3>
                        <p>This is your account to sign in to this site for trainings and events.
                            Your email here will be used both as your username for the account and as a point of contact for club announcements and invitations.
                            You can reset your password at any time.</p>
                        <Form.Item  {...this.alignInputLayout} rules={[{ required: true }]} name='email' label='Email'>
                            <Input className='joinFormInput'/>
                        </Form.Item>
                        <Form.Item  {...this.alignInputLayout} rules={[{ required: true }]} name='password' label='Password'>
                            <Input.Password className='joinFormInput'/>
                        </Form.Item>
                        <h3 className='formSectionHeader'>Payment</h3>
                        <Form.Item name='Payment' rules={[{ required: true }]} label='Payment Type'>
                            <Radio.Group buttonStyle="solid" name="UoaStudentRadio" onChange={e => this.forceUpdate()}>
                                <Radio.Button value={'Bank Transfer'}>Bank Transfer</Radio.Button>
                                <Radio.Button value={'Cash'}>Cash</Radio.Button>
                            </Radio.Group>
                        </Form.Item>
                        <p>If paying by Bank Transfer, include your NAME and AUMTS2 as the reference. Semester 2 membership is $50. Please make your payment to the following account:</p>
                        <p>06-0158-0932609-00 <Button type='link' onClick={e => this.copyText('06-0158-0932609-00')}>Copy Account Number</Button></p>
                        <p>Once the committee receives your payment, you will be able to sign up for trainings!</p>
                        <Form.Item>
                            <Button block type="primary" htmlType="submit">
                                Submit
                            </Button>
                        </Form.Item>
                    </Form>
                </div>
            </div>
        )
    }
}