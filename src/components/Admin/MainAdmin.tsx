import React, {Component} from 'react'
import { Switch, Route, Link, withRouter, RouteComponentProps } from 'react-router-dom';
import { Menu, Button } from 'antd'
import { PlusOutlined, ArrowLeftOutlined } from '@ant-design/icons'
import CreateTraining from './Trainings/CreateTraining'
import CreateEvent from './Events/CreateEvent'
import {ManageEvents} from './Events/ManageEvents'
import './MainAdmin.css'
import { TrainingDashboard } from './Trainings/TrainingDashboard'
import MemberDashboard from './Members/MemberDashboard'
import { AumtEvent, AumtWeeklyTraining } from '../../types'
import db from '../../services/db'


interface MainAdminProps extends RouteComponentProps {
}

interface MainAdminState {
    editingTrainingData: AumtWeeklyTraining | null
    editingEventData: AumtEvent | null
}

class MainAdmin extends Component<MainAdminProps, MainAdminState> {
    constructor(props: MainAdminProps) {
        super(props)
        this.state = {
            editingTrainingData: null,
            editingEventData: null
        }
    }

    onEditTrainingRequest = (data: AumtWeeklyTraining) => {
        this.setState({...this.state, editingTrainingData: data}, () => {
            this.props.history.push(`/admin/edittraining/${data.trainingId}`)
        })
    }
    onEditEventRequest = (data: AumtEvent) => {
        this.setState({...this.state, editingEventData: data}, () => {
            this.props.history.push(`/admin/editevent/${data.id}`)
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
                                <div className="mainAdminEventsHeader">
                                    <h2 className="createEventTitle manageEventTitle">Manage Events</h2>
                                    <Link to='/admin/createevent' className='mainAdminCreateEventButton'>
                                        <Button type='primary' size='large' shape='round'>Create Event <PlusOutlined /></Button>
                                    </Link>
                                    <div className="clearBoth"></div>
                                </div>
                                <ManageEvents onEditEventRequest={this.onEditEventRequest}></ManageEvents>
                            </div>
                        </Route>
                        <Route path='/admin/members'>
                            <MemberDashboard></MemberDashboard>
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
                        <Route path='/admin/edittraining/:trainingid'>
                            <div className="mainAdminCreateFormContainer">
                                {this.state.editingTrainingData ?
                                <div>
                                    <h2 className='createTrainingTitle'>
                                        <Link className='mainAdminCreateBack' to='/admin'>
                                            <ArrowLeftOutlined />
                                        </Link>
                                        Edit {this.state.editingTrainingData.title} </h2>
                                    <CreateTraining
                                        defaultValues={this.state.editingTrainingData}
                                        onCreateSubmit={this.onCreateTrainingSubmit}></CreateTraining>
                                </div>:
                                        ''}
                            </div>
                        </Route>
                        <Route path='/admin/editevent/:eventId'>
                            <div className="mainAdminCreateFormContainer">
                                {this.state.editingEventData ?
                                <div>
                                    <h2 className='createTrainingTitle'>
                                        <Link className='mainAdminCreateBack' to='/admin/events'>
                                            <ArrowLeftOutlined />
                                        </Link>
                                    Edit {this.state.editingEventData.title} </h2>
                                    <CreateEvent
                                        defaultValues={this.state.editingEventData}
                                        onCreateEventSubmit={this.onCreateEventSubmit}></CreateEvent>
                                </div>:
                                        ''}
                            </div>
                        </Route>
                        <Route path='/admin'>
                            <TrainingDashboard onEditTrainingRequest={this.onEditTrainingRequest}></TrainingDashboard>
                        </Route>
                    </Switch>
                </div>
            </div>
        )
    }
}

export default withRouter(MainAdmin)