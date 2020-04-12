import React, {Component} from 'react'
import { RouteComponentProps, Switch, Route, withRouter, Link } from 'react-router-dom';
import { Button, Menu } from 'antd'
import { CreateTraining } from './Trainings/CreateTraining'
import { CreateEvent } from './Events/CreateEvent'
import {ManageEvents} from './Events/ManageEvents'
import './MainAdmin.css'
import { TrainingDashboard } from './Trainings/TrainingDashboard'
import { AumtEvent, AumtWeeklyTraining } from '../../types'
import db from '../../services/db'


interface MainAdminProps {
}

interface MainAdminState {}

export class MainAdmin extends Component<MainAdminProps, MainAdminState> {
    constructor(props: MainAdminProps) {
        super(props)
        this.state = { }
    }
    signMockData = () => {
        db.signMockData()
            .then(() => {
                console.log('DONE')
            })
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
                <Menu
                    style={{ width: 150, float: 'left' }}
                    defaultSelectedKeys={['trainings']}
                    >
                    <Menu.Item key="trainings">
                        <Link to='/admin'>Trainings</Link>
                    </Menu.Item>
                    <Menu.Item key="events">
                        <Link to='/admin/events'>Events</Link>
                    </Menu.Item>
                    <Menu.Item key="members">
                        <Link to='/admin/members'>Members</Link>
                    </Menu.Item>
                </Menu>
                <div className="adminContent">
                    <Switch>
                        <Route path='/admin/events'>
                            <div className="manageEventsContainer">
                                <h2 className="createTrainingTitle">Manage Events </h2>
                                <ManageEvents></ManageEvents>
                            </div>
                        </Route>
                        <Route path='/admin/members'>
                            Members
                        </Route>
                        <Route path='/admin/createtraining'>
                            <h2 className='createTrainingTitle'>Create Training</h2>
                            <CreateTraining onCreateSubmit={this.onCreateTrainingSubmit}></CreateTraining>
                        </Route>
                        <Route path='/admin/createevent'>
                            <h2 className="createTrainingTitle">Create Event</h2>
                            <CreateEvent onCreateEventSubmit={this.onCreateEventSubmit}></CreateEvent>
                        </Route>
                        <Route path='/admin'>
                            <TrainingDashboard></TrainingDashboard>
                        </Route>
                    </Switch>
                </div>
            </div>
        )
    }
}