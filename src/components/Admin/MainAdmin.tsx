import React, {Component} from 'react'
import { Switch, Route, Link } from 'react-router-dom';
import { Menu, Button } from 'antd'
import { PlusOutlined, ArrowLeftOutlined } from '@ant-design/icons'
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
                                <div className="mainAdminEventsHeader">
                                    <h2 className="createEventTitle manageEventTitle">Manage Events</h2>
                                    <Link to='/admin/createevent' className='mainAdminCreateEventButton'>
                                        <Button type='primary' size='large' shape='round'>Create Event <PlusOutlined /></Button>
                                    </Link>
                                    <div className="clearBoth"></div>
                                </div>
                                <ManageEvents></ManageEvents>
                            </div>
                        </Route>
                        <Route path='/admin/members'>
                            Members
                        </Route>
                        <Route path='/admin/createtraining'>
                            <div className="mainAdminCreateFormContainer">
                                <h2 className='createTrainingTitle'>
                                    <Link className='mainAdminCreateBack' to='/admin'>
                                        <ArrowLeftOutlined />
                                    </Link>
                                    Create Training</h2>
                                <CreateTraining onCreateSubmit={this.onCreateTrainingSubmit}></CreateTraining>
                            </div>
                        </Route>
                        <Route path='/admin/createevent'>
                            <div className="mainAdminCreateFormContainer">
                                <h2 className="createTrainingTitle">
                                    <Link className='mainAdminCreateBack' to='/admin/events'>
                                        <ArrowLeftOutlined />
                                    </Link>
                                    Create Event</h2>
                                <CreateEvent onCreateEventSubmit={this.onCreateEventSubmit}></CreateEvent>
                            </div>
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