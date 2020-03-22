import React, {Component} from 'react'
import {Select, Button, notification, Dropdown, Menu} from 'antd'
import './EditSignups.css'
import db from '../../services/db'
import { AumtWeeklyTraining, AumtTrainingSession } from '../../types'
import { ClickParam } from 'antd/lib/menu'


interface EditSignupsProps {
    form: AumtWeeklyTraining
}

interface EditSignupsState {
    selectedMembers: {
        [sessionId: string]: string
    }
    removingInProcess: {
        [sessionId:string]: boolean
    }
    movingInProcess: {
        [sessionId: string]: boolean
    }
}

export class EditSignups extends Component<EditSignupsProps, EditSignupsState> {
    constructor(props: EditSignupsProps) {
        super(props)
        this.state = {
            selectedMembers: {},
            removingInProcess: {},
            movingInProcess: {}
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
    onMoveClick = (clickParam: ClickParam, fromSession: string) => {
        const {key} = clickParam
        const currentSelection = this.state.selectedMembers[fromSession]
        console.log('selected', currentSelection)
        this.setState({
            ...this.state,
            movingInProcess: Object.assign(this.state.movingInProcess, {
                [fromSession]: true
            })
        })
        db.moveMember(currentSelection, this.props.form.trainingId, fromSession, key)
            .then(() => {
                this.setState({
                    ...this.state,
                    movingInProcess: Object.assign(this.state.movingInProcess, {[fromSession]: false})
                })
            })
    }
    getMoveDropdown = (sessionId: string) => {
        console.log('move dropdown running for sid', sessionId)
        const availableMove = this.props.form.sessions.map((session: AumtTrainingSession) => {
            return {
                isSpaceLeft: session.limit >= 0 && Object.keys(session.members).length < session.limit,
                sessionId: session.sessionId,
                title: session.title,
                isCurrentDropdown: session.sessionId === sessionId
            }
        })
        return (
            <Menu onClick={e => this.onMoveClick(e, sessionId)}>
                {availableMove.map((moveObj) => {
                    return (
                        <Menu.Item disabled={moveObj.isCurrentDropdown || !moveObj.isSpaceLeft} key={moveObj.sessionId}>
                            {moveObj.title}{!moveObj.isSpaceLeft ? '(full)' : ''}
                        </Menu.Item>
                        )
                    })
                }
            </Menu>
        )
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
                            {/* <Button
                                loading={this.state.movingInProcess[session.sessionId]}
                                disabled={!this.state.selectedMembers[session.sessionId]}
                                onClick={e => this.onMoveClick(session.sessionId)}
                                >Move...</Button> */}
                              <Dropdown
                                disabled={!this.state.selectedMembers[session.sessionId]}
                                overlay={this.getMoveDropdown(session.sessionId)} trigger={['click']}>
                                <Button loading={this.state.movingInProcess[session.sessionId]}
                                    >Move...</Button>
                            </Dropdown>
                        </div>
                    )
                })}
            </div>
        )
    }
}