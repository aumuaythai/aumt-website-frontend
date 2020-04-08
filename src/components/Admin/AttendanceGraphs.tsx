import React, {Component} from 'react'
import './AttendanceGraphs.css'


interface AttendanceGraphsProps {
}

interface AttendanceGraphsState {
}

export class AttendanceGraphs extends Component<AttendanceGraphsProps, AttendanceGraphsState> {
    render() {
        return (
            <div className='attendanceGraphsContainer'>
                Attendance
            </div>
        )
    }
}