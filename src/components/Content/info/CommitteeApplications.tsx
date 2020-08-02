import React, {Component} from 'react'
import { Button, Input, Form, Result, notification } from 'antd'
import {FormInstance} from 'antd/lib/form'
import './CommitteeApplications.css'
import { AumtCommitteeApp } from '../../../types'
import db from '../../../services/db'

interface CommitteeApplicationsProps {}

interface CommitteeApplicationsState {
    submitting: boolean
    submitted: boolean
}

const LOCAL_STORAGE_KEY = 'committeeApp'
export class CommitteeApplications extends Component<CommitteeApplicationsProps, CommitteeApplicationsState> {
    private formRef = React.createRef<FormInstance>();
    private layout = {
        labelCol: { span: 8 },
        wrapperCol: { span: 16 },
    };
    private tailLayout = {
        wrapperCol: { offset: 8, span: 16 },
    };
    constructor(props: CommitteeApplicationsProps) {
        super(props)
        this.state = {
            submitting: false,
            submitted: false
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
    onSubmit = (vals: AumtCommitteeApp | any) => {
        const app = {
            email: vals.email,
            fullName: vals.fullName,
            phone: vals.phone || '',
            skills: vals.skills
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
                    subTitle={'The current committee will contact you about an interview! Right now interviews are planned to take place Wednesday the 12th to Friday the 14th'}>
                </Result>
            </div>
        }
        return (
            <div className='committeeApplicationsContainer'>
                <h1>Applications</h1>
                <div className="committeeApplicationsFormContainer">
                    <p>Apply to be a member of the AUMT Committee here! This form will close Sunday August 9th. </p>
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
                        <Form.Item name='skills' label='What can you bring to the AUMT Committee?' rules={[{required: true}]}>
                            <Input.TextArea autoSize={{maxRows: 6, minRows: 3}} placeholder='Please list any skills or abilities you are looking to contribute'></Input.TextArea>
                        </Form.Item>
                        <Form.Item>
                            <Button type="primary" block htmlType="submit" loading={this.state.submitting}>
                            Submit
                            </Button>
                        </Form.Item>
                    </Form>
                </div>
            </div>
        )
    }
}