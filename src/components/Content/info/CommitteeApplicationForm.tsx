import React, {Component} from 'react'
import { Button, Input, Form, Result, notification, Select } from 'antd'
import {FormInstance} from 'antd/lib/form'
import './CommitteeApplicationForm.css'
import { AumtCommitteeApp } from '../../../types'
import db from '../../../services/db'

interface CommitteeApplicationFormProps {}

interface CommitteeApplicationFormState {
    submitting: boolean
    submitted: boolean
    currentRole1: string
    currentRole2: string
}

const LOCAL_STORAGE_KEY = 'committeeApp'
export class CommitteeApplicationForm extends Component<CommitteeApplicationFormProps, CommitteeApplicationFormState> {
    private rolesList = ['President', 'Vice President', 'Secretary', 'Treasurer', 'Public Relations', 'Web Development', 'Events']
    private formRef = React.createRef<FormInstance>();
    private layout = {
        labelCol: { span: 8 },
        wrapperCol: { span: 16 },
    };
    private tailLayout = {
        wrapperCol: { offset: 8, span: 16 },
    };
    constructor(props: CommitteeApplicationFormProps) {
        super(props)
        this.state = {
            submitting: false,
            submitted: false,
            currentRole1: '',
            currentRole2: ''
        }
    }
    componentDidMount = () => {
        const currentApp = localStorage.getItem(LOCAL_STORAGE_KEY)
        if (currentApp) {
            this.setState({
                ...this.state,
                submitted: true
            })
        }
    }
    onRole1Select = (role: string) => {
        this.setState({...this.state, currentRole1: role})
    }
    onRole2Select = (role: string) => {
        this.setState({...this.state, currentRole2: role})
    }
    onSubmit = (vals: AumtCommitteeApp | any) => {
        const app = {
            email: vals.email,
            fullName: vals.fullName,
            phone: vals.phone || '',
            role1: vals.role1,
            whyrole1: vals.whyrole1 || '',
            role2: vals.role2 || '',
            whyrole2: vals.whyrole2 || '',
            timestampMs: new Date().getTime()
        }
        this.setState({...this.state, submitting: true})
        localStorage.setItem(LOCAL_STORAGE_KEY, 'yes')
        db.submitCommitteeApplication(app)
            .then(() => {
                this.setState({...this.state, submitting: false, submitted: true})
            })
            .catch((e) => {
                notification.error({message: 'Error submitting committee application: ' + e.toString()})
                this.setState({...this.state, submitting: false})
            })
    }
    render() {
        if (this.state.submitted) {
            return <div className='committeeApplicationsContainer'>
                <Result
                    status='success'
                    title='Your application has been recorded'
                    subTitle={'The current committee will contact you about an interview! Interviews will be held between Monday the 19th and Wednesday the 21st of October, in person at the university'}>
                </Result>
            </div>
        }
        return (
            <div className="committeeApplicationsFormContainer">
                <p>Apply below! This form will close Saturday October 17th at 9pm. </p>
                <Form layout='vertical' onFinish={this.onSubmit} ref={this.formRef}>
                    <Form.Item name='fullName' label='Full Name' rules={[{required: true, message: 'Name is required'}]}>
                        <Input/>
                    </Form.Item>
                    <Form.Item name='email' label='Email' rules={[{required: true}]}>
                        <Input/>
                    </Form.Item>
                    <Form.Item name='phone' label='Phone number'>
                        <Input type='tel'/>
                    </Form.Item>
                    <Form.Item name='role1' label='Select your preferred role' rules={[{required: true}]}>
                        <Select value={this.state.currentRole1} style={{width: 200}} onChange={this.onRole1Select}>
                            {this.rolesList.map((role, idx) => {
                                return <Select.Option key={idx} value={role}>{role}</Select.Option>
                            })}
                        </Select>
                    </Form.Item>
                    <Form.Item name='whyrole1' label='Why have you decided this role?' rules={[{required: true}]}>
                        <Input.TextArea autoSize={{maxRows: 6, minRows: 3}} placeholder='Please explain what interests you about this role and being on the committee in general.'></Input.TextArea>
                    </Form.Item>
                    <Form.Item name='role2' label='Select a backup role (optional)'>
                        <Select allowClear value={this.state.currentRole2} style={{width: 200}} onChange={this.onRole2Select}>
                            {this.rolesList.map((role: string, idx) => {
                                return <Select.Option key={idx} value={role}>{role}</Select.Option>
                            })}
                        </Select>
                    </Form.Item>
                    {this.state.currentRole2 ? 
                    <Form.Item name='whyrole2' label='Why have you decided this role? (optional)'>
                        <Input.TextArea autoSize={{maxRows: 6, minRows: 3}} placeholder='Please explain what interests you about this role and being on the committee in general.'></Input.TextArea>
                    </Form.Item>
                    : ''}
                    <Form.Item>
                        <Button type="primary" block htmlType="submit" loading={this.state.submitting}>
                            Submit
                        </Button>
                    </Form.Item>
                </Form>
            </div>
        )
    }
}