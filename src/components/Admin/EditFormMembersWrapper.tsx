import React, {Component} from 'react'
import {Select} from 'antd'
import {SyncOutlined} from '@ant-design/icons'
import { EditSignups } from './EditSignups'
import './EditSignups.css'
import db from '../../services/db'
import { AumtWeeklyTraining } from '../../types'


interface EditFormMembersWrapperProps {
}

interface EditFormMembersWrapperState {
    trainingForms: AumtWeeklyTraining[]
    message: string
}

export class EditFormMembersWrapper extends Component<EditFormMembersWrapperProps, EditFormMembersWrapperState> {
    constructor(props: EditFormMembersWrapperProps) {
        super(props)
        this.state = {
            trainingForms: [],
            message: ''
        }
    }
    componentDidMount = () => {
        // get db members and structure
        db.getOpenForms()
            .then((forms: AumtWeeklyTraining[]) => {
                this.setState({
                    message: !(forms && forms.length) ? 'No active forms available now' : '',
                    trainingForms: forms
                })
            })
    }
    render() {
        if (this.state.message) {
            return <p>{this.state.message}</p>
        }
        if (!this.state.trainingForms.length) {
            return <p>Loading current forms <SyncOutlined spin /></p>
        }
        return (
            <div>
                {this.state.trainingForms.map((form) => {
                    return (
                        <EditSignups key={form.trainingId} form={form}></EditSignups>
                    )
                })}
            </div>
        )
    }
}