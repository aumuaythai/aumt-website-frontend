import React, {Component} from 'react'
import { Button } from 'antd'
import { CreateTraining } from './CreateTraining'
import { CreateEvent } from './CreateEvent'
import './MainAdmin.css'
import { EditFormMembersWrapper } from './EditFormMembersWrapper'


interface MainAdminProps {
}

interface MainAdminState {
    creatingTraining: boolean
    editingMembers: boolean
    creatingEvent: boolean
}

export class MainAdmin extends Component<MainAdminProps, MainAdminState> {
    constructor(props: MainAdminProps) {
        super(props)
        this.state = {
            creatingTraining: false,
            editingMembers: false,
            creatingEvent: true,
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
    onRefreshSignedUpMembers = () => {
        if (this.state.editingMembers) {
            this.toggleEditingMembers()
            setTimeout(this.toggleEditingMembers,0)
        }
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
                {/* <Button onClick={this.onRefreshSignedUpMembers}>Refresh</Button> */}
                {this.state.editingMembers ? <EditFormMembersWrapper requestRefresh={this.onRefreshSignedUpMembers}></EditFormMembersWrapper> : ''}
                <h3>Events</h3>
                <div className="createEventAdminContainer">
                    <Button onClick={this.toggleCreatingEvent}>
                        {this.state.creatingEvent ? 'Hide Event Creation' : 'Create Event'}
                    </Button>
                </div>
                {this.state.creatingEvent ? <CreateEvent></CreateEvent> : ''}
            </div>
        )
    }
}