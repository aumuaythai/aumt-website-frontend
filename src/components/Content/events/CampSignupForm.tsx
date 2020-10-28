import React, {Component} from 'react'
import { Form, Input, InputNumber, Radio, Button, Select, notification } from 'antd'
import { FormInstance } from 'antd/lib/form';
import './CampSignupForm.css'
import { AumtCampSignupData } from '../../../types'



interface CampSignupFormProps {
    includeNameAndEmail: boolean
    submitting: boolean
    isWaitlist: boolean
    isCamp: boolean
    onSubmit: (obj: AumtCampSignupData) => void
}

interface CampSignupFormState {
    currentStay: string
}

export class CampSignupForm extends Component<CampSignupFormProps, CampSignupFormState> {
    private formRef = React.createRef<FormInstance>();
    constructor(props: CampSignupFormProps) {
        super(props)
        this.state = {
            currentStay: ''
        }
    }
    onSubmit = (vals: any) => {
        const daysStaying = vals.daysStaying === 'Other' ? this.state.currentStay : vals.daysStaying
        if (!daysStaying) {
            return notification.error({message: 'Please specify your planned length of stay'})
        }
        const submitObj: AumtCampSignupData = {
            name: vals.name || '',
            email: vals.email || '',
            phoneNumber: vals.phoneNumber || '',
            ecName: vals.ecName || '',
            ecPhoneNumber: vals.ecPhoneNumber || '',
            ecRelation: vals.ecRelation || '',
            dietaryRequirements: vals.dietaryRequirements || '',
            medicalInfo: vals.medicalInfo || '',
            hasFirstAid: vals.hasFirstAid || false,
            daysStaying: daysStaying,
            driverLicenseClass: vals.license || '',
            insuranceDescription: vals.insuranceDescription || '',
            carModel: vals.carModel || '',
            seatsInCar: vals.seatsInCar || -1,
        }
        this.props.onSubmit(submitObj)
    }
    onLengthStayChange = (stay: string) => {
        this.setState({
            ...this.state,
            currentStay: stay
        })
    }
    render() {
        return (
            <div className='campSignupFormContainer'>
                <Form onFinish={this.onSubmit} ref={this.formRef}>
                    <h4 className='eventSignupFormSectionHead'>Contact</h4>
                        {this.props.includeNameAndEmail ? 
                        <div>
                            <Form.Item label='Full name' name='name' rules={[{required: true}]}>
                                <Input/>
                            </Form.Item>
                            <Form.Item label='Email' name='email' rules={[{required: true}]}>
                                <Input/>
                            </Form.Item>
                        </div>
                        : ''}
                    {this.props.isCamp ?
                        <div>
                            <Form.Item label='Phone Number' name='phoneNumber' rules={[{required: true}]}>
                                <Input/>
                            </Form.Item>
                            <h4 className='eventSignupFormSectionHead'>Emergency Contact</h4>
                            <Form.Item label='Name' name='ecName' rules={[{required: true, message: 'Emergency Contact Name Required'}]}>
                                <Input/>
                            </Form.Item>
                            <Form.Item label='Phone' name='ecPhoneNumber' rules={[{required: true, message: 'Emergency Contact Phone Required'}]}>
                                <Input/>
                            </Form.Item>
                            <Form.Item label='Relationship' name='ecRelation' rules={[{required: true, message: 'Emergency Contact Relationship Required'}]}>
                                <Input/>
                            </Form.Item>
                            <h4 className='eventSignupFormSectionHead'>Requirements</h4>
                            <Form.Item label='Dietary Requirements (optional)' name='dietaryRequirements'>
                                <Input placeholder='Allergies, vegetarian, etc'/>
                            </Form.Item>
                            <Form.Item label='Medical Info (optional)' name='medicalInfo'>
                                <Input placeholder='Allergies, injuries, conditions, etc'/>
                            </Form.Item>
                            <Form.Item label='Do you have a First Aid Certificate?' name='hasFirstAid'>
                                <Radio.Group name="FirstAidRadio">
                                    <Radio.Button value={true}>Yes</Radio.Button>
                                    <Radio.Button value={false}>No</Radio.Button>
                                </Radio.Group>
                            </Form.Item>
                            <Form.Item label='Planned Length of Stay' name='daysStaying' rules={[{required: true, message: 'Length of Stay Required'}]}>
                                <Radio.Group name='lengthOfStayRadio'>
                                    <Radio value="4 days (27th-30th)">4 days (27th-30th)</Radio>
                                    <Radio value="3 days (27th-29th)">3 days (27th-29th)</Radio>
                                    <Radio value="3 days (28th-30th)">3 days (28th-30th)</Radio>
                                    <Radio value="Other">Other
                                        <Input onChange={e => this.onLengthStayChange(e.target.value)} placeholder='Please specify' style={{width: 150}}/>
                                    </Radio>
                                </Radio.Group>
                            </Form.Item>
                            <h4 className='eventSignupFormSectionHead'>Driving (optional)</h4>
                            <p>If selected as a driver, you won't need to pay for fuel - we will reimburse any fuel costs.</p>
                            <Form.Item name='license' label='License Class'>
                                <Radio.Group name="PaymentRadio" onChange={e => this.forceUpdate()}>
                                    <Radio.Button value={'Full 2+ years'}>Full 2+ years</Radio.Button>
                                    <Radio.Button value={'Full <2 years'}>Full &lt;2 years</Radio.Button>
                                    <Radio.Button value={'Restricted'}>Restricted</Radio.Button>
                                    <Radio.Button value={'Other'}>Other/None</Radio.Button>
                                </Radio.Group>
                            </Form.Item>
                            {this.formRef?.current?.getFieldValue('license') && this.formRef?.current?.getFieldValue('license')  !== 'Other' ?
                                <div>
                                    <p className='eventFormMockLabel'>Do you own a car you would be willing to drive down?</p>
                                    <Form.Item name='ownsCar'>
                                        <Radio.Group name='ownsCarRadio' onChange={e => this.forceUpdate()}> 
                                            <Radio.Button value={true}>Yes</Radio.Button>
                                            <Radio.Button value={false}>No</Radio.Button>
                                        </Radio.Group>
                                    </Form.Item>
                                    {this.formRef?.current?.getFieldValue('ownsCar') ? 
                                    <div>
                                        <Form.Item label='How Many Seats (including driver)?' name='seatsInCar' rules={[{required: true}]}>
                                            <InputNumber min={1}/>
                                        </Form.Item>
                                        <Form.Item label="What is your car's year and model?" name='carModel' rules={[{required: true}]}>
                                            <Input placeholder='E.g. 2004 Nissan March'/>
                                        </Form.Item>
                                        <Form.Item label="Describe your insurance" name='insuranceDescription' rules={[{required: true}]}>
                                            <Input/>
                                        </Form.Item>
                                    </div>
                                    : ''}
                                </div>
                            : ''}
                        </div>
                    : ''}
                    <Button
                        loading={this.props.submitting}
                        htmlType='submit'
                        type='primary'
                        block
                        className='reserveEventSpotButton'
                    >{this.props.isWaitlist ? 'Join Waitlist' : 'Reserve a Spot'}</Button>
                </Form>
            </div>
        )
    }
}