import React, {Component} from 'react'
import { Button } from 'antd'
import { CreateTraining } from './Trainings/CreateTraining'
import { CreateEvent } from './Events/CreateEvent'
import {ManageEvents} from './Events/ManageEvents'
import './MainAdmin.css'
import { EditFormMembersWrapper } from './Trainings/EditFormMembersWrapper'
import { WeekStats } from './Trainings/Stats/WeekStats'
import { YearStats } from './Trainings/Stats/YearStats'
import { AumtEvent, AumtWeeklyTraining } from '../../types'
import db from '../../services/db'
import { ManageTrainings } from './Trainings/ManageTrainings'


interface MainAdminProps {
}

interface MainAdminState {
    creatingTraining: boolean
    managingTrainings: boolean
    editingMembers: boolean
    creatingEvent: boolean
    managingEvents: boolean
    viewingWeekStats: boolean
    viewingYearStats: boolean
}

export class MainAdmin extends Component<MainAdminProps, MainAdminState> {
    constructor(props: MainAdminProps) {
        super(props)
        this.state = {
            creatingTraining: false,
            managingTrainings: false,
            editingMembers: false,
            creatingEvent: false,
            managingEvents: false,
            viewingWeekStats: false,
            viewingYearStats: false
        }
    }
    signMockData = () => {
        db.signMockData()
            .then(() => {
                console.log('DONE')
            })
    }
    toggleCreatingTraining = () => {
        this.setState({
            ...this.state,
            creatingTraining: !this.state.creatingTraining
        })
    }
    toggleManageTrainings = () => {
        this.setState({
            ...this.state,
            managingTrainings: !this.state.managingTrainings
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
    toggleWeekStats = () => {
        this.setState({
            ...this.state,
            viewingWeekStats: !this.state.viewingWeekStats
        })
    }
    toggleYearStats = () => {
        this.setState({
            ...this.state,
            viewingYearStats: !this.state.viewingYearStats
        })
    }
    onRefreshSignedUpMembers = () => {
        if (this.state.editingMembers) {
            this.toggleEditingMembers()
            setTimeout(this.toggleEditingMembers)
        }
    }

    onCreateTrainingSubmit = (trainingData: AumtWeeklyTraining): Promise<void> => {
        return db.submitNewForm(trainingData)
    }

    onCreateEventSubmit = (eventData: AumtEvent): Promise<void> => {
        return db.submitEvent(eventData)
    }

    render() {
        return (
            <div className='adminContainer'>
                <Button onClick={this.signMockData}>Mock Signups</Button>
                <h3>Signup Forms</h3>
                <div className='adminSection'>
                    <Button onClick={this.toggleCreatingTraining}>
                        {this.state.creatingTraining ? 'Hide Signup Creation' : 'Create Signup Form'}
                    </Button>
                    {this.state.creatingTraining ? <CreateTraining onCreateSubmit={this.onCreateTrainingSubmit}></CreateTraining> : ''}
                </div>
                <div className='adminSection'>
                    <Button onClick={this.toggleManageTrainings}>
                        {this.state.managingTrainings ? 'Hide Manage Trainings' : 'Manage Trainings'}
                    </Button>
                    {this.state.managingTrainings ? <ManageTrainings></ManageTrainings> : ''}
                </div>
                <div className='adminSection'>
                    <Button onClick={this.toggleEditingMembers}>
                        Edit Signed Up Members
                    </Button>
                    {this.state.editingMembers ? <EditFormMembersWrapper requestRefresh={this.onRefreshSignedUpMembers}></EditFormMembersWrapper> : ''}
                </div>
                <h3>Events</h3>
                <div className='adminSection'>
                    <Button onClick={this.toggleCreatingEvent}>
                        {this.state.creatingEvent ? 'Hide Event Creation' : 'Create Event'}
                    </Button>
                    {this.state.creatingEvent ? <CreateEvent onCreateEventSubmit={this.onCreateEventSubmit}></CreateEvent> : ''}
                </div>
                <div className='adminSection'>
                    <Button onClick={this.toggleManageEvents}>
                        {this.state.managingEvents ? 'Hide Event Manage' : 'Manage Events'}
                    </Button>
                {this.state.managingEvents ? <ManageEvents></ManageEvents> : ''}
                </div>
                <h3>Stats</h3>
                <div className="adminSection">
                    <Button onClick={this.toggleWeekStats}>
                        {this.state.viewingWeekStats ? 'Hide Week Stats' : 'Week Stats'}
                    </Button>
                    {this.state.viewingWeekStats ? <WeekStats></WeekStats> : ''}
                </div>
                <div className="adminSection">
                    <Button onClick={this.toggleYearStats}>
                        {this.state.viewingYearStats ? 'Hide Year Stats' : 'Year Stats'}
                    </Button>
                    {this.state.viewingYearStats ? <YearStats></YearStats>: ''}
                </div>
            </div>
        )
    }
}