import React, {Component} from 'react'
import { Form, Input, InputNumber, Radio, Button } from 'antd'
import { FormInstance } from 'antd/lib/form';
import './CampSignupForm.css'
import { LicenseClasses } from '../../../types'



interface CampSignupFormProps {
    includeNameAndEmail: boolean
    submitting: boolean
    isWaitlist: boolean
    isCamp: boolean
    onSubmit: (obj: {ecName: string, ecPhoneNumber: string, ecRelation: string, phoneNumber: string, dietaryRequirements: string, medicalInfo: string, seatsInCar: number, license: LicenseClasses, name: string, email: string}) => void
}

interface CampSignupFormState {
}

export class CampSignupForm extends Component<CampSignupFormProps, CampSignupFormState> {
    private formRef = React.createRef<FormInstance>();
    constructor(props: CampSignupFormProps) {
        super(props)
        this.state = {}
    }
    onSubmit = (vals: any) => {
        const submitObj = {
            phoneNumber: vals.phoneNumber || '',
            ecName: vals.ecName,
            ecPhoneNumber: vals.ecPhoneNumber,
            ecRelation: vals.ecRelation,
            dietaryRequirements: vals.dietaryRequirements || '',
            medicalInfo: vals.medicalInfo || '',
            seatsInCar: vals.seatsInCar || -1,
            license: vals.license || '',
            name: vals.name || '',
            email: vals.email || ''
        }
        this.props.onSubmit(submitObj)
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
                                <Input placeholder='Injuries, conditions, etc'/>
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
                                        <Form.Item label='How Many Seats (including driver)?' name='seatsInCar' rules={[{required: true}]}>
                                            <InputNumber min={1}/>
                                        </Form.Item>
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