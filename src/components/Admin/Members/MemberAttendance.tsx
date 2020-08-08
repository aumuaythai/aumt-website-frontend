import React, {Component} from 'react'
import { Spin, notification, Popover, Tooltip } from 'antd'
import {EditOutlined} from '@ant-design/icons'
import './MemberAttendance.css'
import { TableDataLine } from './TableHelper'
import db from '../../../services/db'
import DataFormatUtil from '../../../services/data.util'
import { AumtWeeklyTraining } from '../../../types'
import { SignupForm } from '../../Content/signups/SignupForm'

interface MemberAttendanceProps {
    member: TableDataLine
}

interface MemberAttendanceState {
    loadingAttendance: boolean
    attendance: {formTitle: string, formId: string, sessionTitle: string}[]
    forms: AumtWeeklyTraining[]
}

export class MemberAttendance extends Component<MemberAttendanceProps, MemberAttendanceState> {
    constructor(props: MemberAttendanceProps) {
        super(props)
        this.state = {
            loadingAttendance: false,
            attendance: [],
            forms: []
        }
    }
    componentDidUpdate = (prevProps: MemberAttendanceProps, prevState: MemberAttendanceState) => {
        if (this.props.member.key !== prevProps.member.key) {
            this.getAttendance()
        }
    }
    componentDidMount = () => {
        this.getAttendance()
    }
    getDisplayName = (): string | null => {
        if (this.props.member) {
            const displayName = this.props.member.firstName + 
                (this.props.member.preferredName ? ` "${this.props.member.preferredName}" ` : ' ') +
                this.props.member.lastName
            return displayName
        } else {
            return null
        }
    }
    getAttendance = (noLoad?: boolean) => {
        if (!noLoad) {
            this.setState({
                ...this.state,
                loadingAttendance: true
            })
        }
        db.getAllForms()
            .then(forms => {
                const attendance = DataFormatUtil.getAttendance(this.props.member.key, forms)
                this.setState({
                    ...this.state,
                    forms,
                    attendance
                })
            })
            .catch((err) => {
                notification.error({message: 'Error getting attendance: ' + err.toString()})
            })
            .finally(() => this.setState({...this.state, loadingAttendance: false}))
    }
    getSignupPopover = (trainingId: string) => {
        const form = this.state.forms.find(f => f.trainingId === trainingId)
        if (!form) {
            return <p>No form found for id</p>
        }
        return (
            <div className='attendanceFormPopoverContainer'>
            <SignupForm 
                title={form.title}
                id={form.trainingId}
                closes={form.closes}
                sessions={form.sessions}
                displayName={this.getDisplayName()}
                authedUserId={this.props.member.key}
                notes={form.notes}
                openToPublic={false}
                onSignupChanged={() => this.getAttendance(true)}></SignupForm>
            </div>
        )
    }
    render() {
        if (this.state.loadingAttendance) {
            return (<div>Getting Attendance <Spin/></div>)
        }
        return (
            <div className='attendanceListContainer'>
                {this.state.attendance.map((record) => {
                    return (
                        <div key={record.formTitle} className='attendanceLine'>
                            <h4 className="attendanceLineForm">{record.formTitle}</h4>
                            <p className="attendanceLineSession">
                                {record.sessionTitle || 'None'}
                                <Popover placement='rightTop' content={this.getSignupPopover(record.formId)} trigger='click'>
                                    <Tooltip title='Edit'>
                                        <EditOutlined className='attendanceSessionEdit' />
                                    </Tooltip>
                                </Popover>
                            </p>
                            <div className="clearBoth"></div>
                        </div>
                    )
                })}
            </div>
        )
    }
}