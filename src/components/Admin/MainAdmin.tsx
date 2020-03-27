import React, {Component} from 'react'
import { Button } from 'antd'
import { CreateTraining } from './CreateTraining'
import { CreateEvent } from './CreateEvent'
import {ManageEvents} from './ManageEvents'
import './MainAdmin.css'
import { EditFormMembersWrapper } from './EditFormMembersWrapper'
import { AumtEvent } from '../../types'
import db from '../../services/db'


interface MainAdminProps {
}

interface MainAdminState {
    creatingTraining: boolean
    editingMembers: boolean
    creatingEvent: boolean
    managingEvents: boolean
}

export class MainAdmin extends Component<MainAdminProps, MainAdminState> {
    constructor(props: MainAdminProps) {
        super(props)
        this.state = {
            creatingTraining: false,
            editingMembers: false,
            creatingEvent: false,
            managingEvents: true
        }
    }
    toggleCreatingTraining = () => {
        this.setState({
            ...this.state,
            creatingTraining: !this.state.creatingTraining
        })
    }
    toggleEditingMembers = () => {
        this.setState({
            ...this.state,
            editingMembers: !this.state.editingMembers
        })
    }
    toggleCreatingEvent = () => {
        this.setState({
            ...this.state,
            creatingEvent: !this.state.creatingEvent
        })
    }
    toggleManageEvents = () => {
        this.setState({
            ...this.state,
            managingEvents: !this.state.managingEvents
        })
    }
    onRefreshSignedUpMembers = () => {
        if (this.state.editingMembers) {
            this.toggleEditingMembers()
            setTimeout(this.toggleEditingMembers)
        }
    }

    onCreateEventSubmit = (eventData: AumtEvent): Promise<void> => {
        return db.submitEvent(eventData)
    }

    render() {
        return (
            <div className='adminContainer'>
                <h3>Signup Forms</h3>
                <div className="createSignupAdminContainer">
                    <Button onClick={this.toggleCreatingTraining}>
                        {this.state.creatingTraining ? 'Hide Signup Creation' : 'Create Signup Form'}
                    </Button>
                </div>
                {this.state.creatingTraining ? <CreateTraining></CreateTraining> : ''}
                <Button onClick={this.toggleEditingMembers}>Edit Signed Up Members</Button>
                {this.state.editingMembers ? <EditFormMembersWrapper requestRefresh={this.onRefreshSignedUpMembers}></EditFormMembersWrapper> : ''}
                <h3>Events</h3>
                <div className="createEventAdminContainer">
                    <Button onClick={this.toggleCreatingEvent}>
                        {this.state.creatingEvent ? 'Hide Event Creation' : 'Create Event'}
                    </Button>
                </div>
                {this.state.creatingEvent ? <CreateEvent onCreateEventSubmit={this.onCreateEventSubmit}></CreateEvent> : ''}
                <div className="manageEventAdminContainer">
                    <Button onClick={this.toggleManageEvents}>
                        {this.state.managingEvents ? 'Hide Event Manage' : 'Manage Events'}
                    </Button>
                </div>
                {this.state.managingEvents ? <ManageEvents></ManageEvents> : ''}
            </div>
        )
    }
}