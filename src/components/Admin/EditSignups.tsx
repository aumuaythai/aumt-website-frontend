import React, {Component} from 'react'
import {Select, Button, notification} from 'antd'
import './EditSignups.css'
import db from '../../services/db'
import { AumtWeeklyTraining } from '../../types'


interface EditSignupsProps {
    form: AumtWeeklyTraining
}

interface EditSignupsState {
    selectedMembers: {
        [sessionId: string]: string
    }
    removingInProcess: {
        [sessionId:string]: boolean
    };
}

export class EditSignups extends Component<EditSignupsProps, EditSignupsState> {
    constructor(props: EditSignupsProps) {
        super(props)
        this.state = {
            selectedMembers: {},
            removingInProcess: {}
        }
    }
    onSelectChange = (member: any, sessionId: string) => {
        this.setState({
            ...this.state,
            selectedMembers: Object.assign(this.state.selectedMembers, {
                [sessionId]: member
            })
        })
    }
    onRemoveClick = (sessionId: string) => {
        const uidToRemove = this.state.selectedMembers[sessionId]
        console.log('removing uid', uidToRemove, sessionId)
        if (uidToRemove) {
            this.setState({
                ...this.state,
                removingInProcess: Object.assign(this.state.removingInProcess, {[sessionId]: true})
            })
            db.removeMemberFromForm(uidToRemove, this.props.form.trainingId, sessionId)
                .then(() => {
                    const session = this.props.form.sessions.find(s => s.sessionId === sessionId)
                    if (session) {
                        session.members[uidToRemove] = '<Removed>'
                    } 
                })
                .catch((err) => {
                    notification.error({
                        message: 'Error removing member: ' + err.toString()
                    })
                })
                .finally(() => {
                    this.setState({
                        ...this.state,
                        removingInProcess: Object.assign(this.state.removingInProcess, {[sessionId]: false})
                    })
                })
        }
    }
    render() {
        return (
            <div className='editSignedUpMembersContainer'>
                {this.props.form.sessions.map((session, i) => {
                    return (
                        <div key={session.sessionId} className="sessionSelectContainer">
                            <span>{session.title}: </span>
                            <Select
                                showSearch
                                className='memberSelect'
                                placeholder="Select a person"
                                optionFilterProp="children"
                                onChange={e => this.onSelectChange(e, session.sessionId)}
                                // onSearch={onSearch} */}
                                // {/* filterOption={(input: string, option: any) =>
                                //     option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                                // } */}
                                >
                                    {Object.keys(session.members).map((member) => {
                                            return (
                                                <Select.Option key={member} value={member}>{session.members[member]}</Select.Option>
                                            )
                                    })}
                            </Select>
                            <Button
                                loading={this.state.removingInProcess[session.sessionId]}
                                disabled={!this.state.selectedMembers[session.sessionId]}
                                type='danger'
                                onClick={e => this.onRemoveClick(session.sessionId)}
                                >Remove</Button>
                            {/* <Button disabled={!this.state.selectedMembers[session.sessionId]}>Move...</Button> */}
                        </div>
                    )
                })}
            </div>
        )
    }
}