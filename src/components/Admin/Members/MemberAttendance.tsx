import React, {Component} from 'react'
import { notification } from 'antd'
import {SyncOutlined} from '@ant-design/icons'
import './MemberAttendance.css'
import { TableDataLine } from './TableHelper'
import db from '../../../services/db'
import DataFormatter from '../../../services/data.formatter'

interface MemberAttendanceProps {
    member: TableDataLine
}

interface MemberAttendanceState {
    loadingAttendance: boolean
    attendance: {formTitle: string, sessionTitle: string}[]
}

export class MemberAttendance extends Component<MemberAttendanceProps, MemberAttendanceState> {
    constructor(props: MemberAttendanceProps) {
        super(props)
        this.state = {
            loadingAttendance: false,
            attendance: []
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
    getAttendance = () => {
        this.setState({
            ...this.state,
            loadingAttendance: true
        })
        db.getAllForms()
            .then(forms => {
                const now = new Date()
                const openForms = forms.filter(f => f.opens < now)
                const attendance = DataFormatter.getAttendance(this.props.member.key, openForms)
                this.setState({
                    ...this.state,
                    attendance
                })
            })
            .catch((err) => {
                notification.error({message: 'Error getting attendance: ' + err.toString()})
            })
            .finally(() => this.setState({...this.state, loadingAttendance: false}))
    }
    render() {
        if (this.state.loadingAttendance) {
            return (<p>Getting Attendance <SyncOutlined spin/></p>)
        }
        return (
            <div className='attendanceListContainer'>
                {this.state.attendance.map((record) => {
                    return (
                        <div key={record.formTitle} className='attendanceLine'>
                            <h4 className="attendanceLineForm">{record.formTitle}</h4>
                            <p className="attendanceLineSession">{record.sessionTitle}</p>
                            <div className="clearBoth"></div>
                        </div>
                    )
                })}
            </div>
        )
    }
}