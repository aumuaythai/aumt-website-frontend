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
    onSubmit: (obj: {dietaryRequirements: string, medicalInfo: string, seatsInCar: number, license: LicenseClasses, name: string, email: string}) => void
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
                        {this.props.includeNameAndEmail ? 
                        <div>
                            <Form.Item label='Full name' name='name'>
                                <Input/>
                            </Form.Item>
                            <Form.Item label='Email' name='email'>
                                <Input/>
                            </Form.Item>
                        </div>
                        : ''}
                    {this.props.isCamp ?
                        <div>
                            <Form.Item label='Dietary Requirements (optional)' name='dietaryRequirements'>
                                <Input placeholder='Allergies, vegetarian, etc'/>
                            </Form.Item>
                            <Form.Item label='Medical Info (optional)' name='medicalInfo'>
                                <Input placeholder='Injuries, conditions, etc'/>
                            </Form.Item>
                            <p className='eventFormMockLabel'>Driving (optional)</p>
                            <p>If selected as a driver, you'll receive a $20 discount and fuel reimbursement.</p>
                            <Form.Item name='license' label='License Class'>
                                <Radio.Group name="PaymentRadio" onChange={e => this.forceUpdate()}>
                                    <Radio.Button value={'Full 2+ years'}>Full 2+ years</Radio.Button>
                                    <Radio.Button value={'Full <2 years'}>Full &lt;2 years</Radio.Button>
                                    <Radio.Button value={'Restricted'}>Restricted</Radio.Button>
                                </Radio.Group>
                            </Form.Item>
                            {this.formRef?.current?.getFieldValue('license') ?
                                <div>
                                    <p className='eventFormMockLabel'>Do you own a car you would be willing to drive down?</p>
                                    <Form.Item name='ownsCar'>
                                        <Radio.Group name='ownsCarRadio' onChange={e => this.forceUpdate()}> 
                                            <Radio.Button value={true}>Yes</Radio.Button>
                                            <Radio.Button value={false}>No</Radio.Button>
                                        </Radio.Group>
                                    </Form.Item>
                                    {this.formRef?.current.getFieldValue('ownsCar') ? 
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