import React, {Component} from 'react'
import {Select, Button, Statistic, notification, Input, Dropdown, Menu, Row, Col} from 'antd'
// import { PlusOutlined } from '@ant-design/icons'
import './EditSignups.css'
import db from '../../../services/db'
import { AumtWeeklyTraining, AumtTrainingSession } from '../../../types'
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
    addedMember: {
        [sessionId: string]: string
    }
    addingInProcess: {
        [sessionId: string]: boolean
    }
}

export class EditSignups extends Component<EditSignupsProps, EditSignupsState> {
    constructor(props: EditSignupsProps) {
        super(props)
        this.state = {
            selectedMembers: {},
            removingInProcess: {},
            movingInProcess: {},
            addedMember: {},
            addingInProcess: {}
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
    memberSort = (uidA: string, uidB: string, session: AumtTrainingSession): number => {
        return session.members[uidA].name > session.members[uidB].name ? 1 : -1
    }
    generateMockUid = () => {
        let alphabet = '1234567890qwertyuiopasdfghjklzxcvbnm'
        let uid = ''
        for (let i = 0; i < 16; i++) {
            uid += alphabet[Math.floor(Math.random() * alphabet.length)]
        }
        return uid
    }
    onRemoveClick = (sessionId: string) => {
        const uidToRemove = this.state.selectedMembers[sessionId]
        if (uidToRemove) {
            this.setState({
                ...this.state,
                removingInProcess: Object.assign(this.state.removingInProcess, {[sessionId]: true})
            })
            db.removeMemberFromForm2(uidToRemove, this.props.form.trainingId, sessionId)
                .then(() => {
                    delete this.state.selectedMembers[sessionId]
                    this.setState({
                        ...this.state,
                        removingInProcess: Object.assign(this.state.removingInProcess, {[sessionId]: false})
                    })
                })
                .catch((err) => {
                    notification.error({
                        message: 'Error removing member: ' + err.toString()
                    })
                    this.setState({
                        ...this.state,
                        removingInProcess: Object.assign(this.state.removingInProcess, {[sessionId]: false})
                    })
                })
        }
    }
    setAddMember = (sessionId: string, name: string) => {
        this.setState({
            ...this.state,
            addedMember: {...this.state.addedMember, [sessionId]: name}
        })
    }
    addToSession = (sessionId: string) => {
        const name = this.state.addedMember[sessionId]
        if (name) {
            this.setState({...this.state, addingInProcess: {...this.state.addingInProcess, [sessionId]: true}})
            db.signUserUp2(this.generateMockUid(), name, new Date(), this.props.form.trainingId, sessionId, '', '')
                .then(() => {
                    notification.success({message: 'Successfully signed up ' + name})
                })
                .catch((err) => {
                    notification.error({message: 'Error adding to session: ' + err.toString()})
                })
                .finally(() => {
                    this.setState({...this.state, addingInProcess: {...this.state.addingInProcess, [sessionId]: false}})
                })
        }
    }
    onMoveClick = (clickParam: ClickParam, fromSession: string) => {
        const {key} = clickParam
        const currentUserIdSelected = this.state.selectedMembers[fromSession]
        const session = this.props.form.sessions[fromSession]
        const displayName = session &&
            session.members[currentUserIdSelected] &&
            session.members[currentUserIdSelected].name
        const timeAdded = session &&
            session.members[currentUserIdSelected] &&
            session.members[currentUserIdSelected].timeAdded
        if (!displayName || !timeAdded) {
            return notification.error({
                message: 'No user found for user id ' + currentUserIdSelected + ' in session'
            })
        }
        this.setState({
            ...this.state,
            movingInProcess: Object.assign(this.state.movingInProcess, {
                [fromSession]: true
            })
        })
        db.moveMember(currentUserIdSelected, displayName, timeAdded, this.props.form.trainingId, fromSession, key)
            .then(() => {
                delete this.state.selectedMembers[fromSession]
                this.setState({
                    ...this.state,
                    movingInProcess: Object.assign(this.state.movingInProcess, {[fromSession]: false})
                })
            })
            .catch((err: Error) => {
                this.setState({
                    ...this.state,
                    movingInProcess: Object.assign(this.state.movingInProcess, {[fromSession]: false})
                })
                notification.error({
                    message: err
                })
            })
    }
    getMoveDropdown = (sessionId: string) => {
        const availableMove = Object.values(this.props.form.sessions)
            .sort((a, b) => a.position - b.position)
            .map((session) => {
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
                {Object.values(this.props.form.sessions)
                    .sort((a, b) => a.position - b.position)
                    .map((session) => {
                    return (
                        <div key={session.sessionId} className="sessionSelectContainer">
                            <Row>
                            <Col span={7} className="editSignupsTitleAndSelect">
                                <div className="weekStatsDisplayWrapper">
                                    <div key={session.sessionId} className="weekStatEachContainer">
                                        <Statistic title={session.title} value={Object.keys(session.members).length} suffix={`/ ${session.limit}`} />
                                    </div>
                                </div>
                            </Col>
                            <Col span={17}>
                                <Select
                                    showSearch={window.innerWidth > 600}
                                    className='memberSelect'
                                    placeholder="Select a person"
                                    optionFilterProp="children"
                                    onChange={e => this.onSelectChange(e, session.sessionId)}
                                    >
                                        {Object.keys(session.members).sort((a, b) => this.memberSort(a, b, session)).map((member) => {
                                                return (
                                                <Select.Option key={member} value={member}>{session.members[member].name}{member.indexOf('NONMEMBER') > -1 ? ' (non-member)': ''}</Select.Option>
                                                )
                                        })}
                                </Select>
                                <div className="editSignupsOptionButtons">
                                    <Input onChange={e => this.setAddMember(session.sessionId, e.target.value)} className='editSignupsAddMemberInput'/>
                                    <Button onClick={e => this.addToSession(session.sessionId)} loading={this.state.addingInProcess[session.sessionId]}>Add</Button>
                                    <Dropdown
                                        disabled={!this.state.selectedMembers[session.sessionId]}
                                        overlay={this.getMoveDropdown(session.sessionId)}
                                        trigger={['click']}>
                                        <Button loading={this.state.movingInProcess[session.sessionId]}
                                            >Move...</Button>
                                    </Dropdown>
                                    <Button
                                        loading={this.state.removingInProcess[session.sessionId]}
                                        disabled={!this.state.selectedMembers[session.sessionId]}
                                        type='danger'
                                        onClick={e => this.onRemoveClick(session.sessionId)}
                                        >Remove</Button>
                                </div>
                            </Col>
                            </Row>
                        </div>
                    )
                })}
            </div>
        )
    }
}