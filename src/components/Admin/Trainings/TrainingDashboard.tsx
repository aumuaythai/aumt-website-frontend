import React, {Component} from 'react'
import { Link } from 'react-router-dom'
import { Spin, Button, Menu, Dropdown, notification } from 'antd'
import { DownOutlined, PlusOutlined } from '@ant-design/icons'
import './TrainingDashboard.css'
import { WeekStats } from './Stats/WeekStats'
import { YearStats } from './Stats/YearStats'
import { ManageTrainings } from './ManageTrainings'
import { AumtWeeklyTraining } from '../../../types'
import { EditSignups } from './EditSignups'
import db from '../../../services/db'


interface TrainingDashboardProps {
    onEditTrainingRequest: (training: AumtWeeklyTraining) => void
}

interface TrainingDashboardState {
    currentForm: AumtWeeklyTraining | null
    loadingForms: boolean
    allForms: AumtWeeklyTraining[]
    dbListenerId: string
}

export class TrainingDashboard extends Component<TrainingDashboardProps, TrainingDashboardState> {
    private isFirstListen = true

    constructor(props: TrainingDashboardProps) {
        super(props)
        this.state = {
            currentForm: null,
            allForms: [],
            loadingForms: false,
            dbListenerId: ''
        }
    }
    signMockData = () => {
        db.signMockData()
            .then(() => {
                console.log('DONE')
            })
    }
    componentWillUnmount = () => {
        db.unlisten(this.state.dbListenerId)
    }
    componentDidMount = () => {
        this.setState({...this.state, loadingForms: true})
        db.getAllForms()
            .then((forms: AumtWeeklyTraining[]) => {
                if (forms.length) {
                    this.handleNewForms(forms)
                }
                this.setState({
                    ...this.state,
                    loadingForms: false,
                    dbListenerId: db.listenToTrainings(this.onDbChanges)
                })

            })
            .catch((err) => {
                notification.error({
                    message: err.toString()
                })
                this.setState({
                    ...this.state,
                    currentForm: null
                })
                this.setState({...this.state, loadingForms: false})
            })
    }
    handleNewForms = (forms: AumtWeeklyTraining[]) => {
        const sortedForms = forms.sort((a, b) => {
            return a.closes < b.closes ? 1 : -1
        })
        this.setState({
            ...this.state,
            allForms: sortedForms
        })
        const currentTime = new Date()
        let currentForm = sortedForms[sortedForms.length - 1]
        for (let i = 0; i < sortedForms.length; i ++) {
            if (sortedForms[i].opens < currentTime) {
                currentForm = sortedForms[i]
                break
            }
        }
        const currentFormInNewForms = forms.find(f => f.trainingId === this.state.currentForm?.trainingId)
        if (!currentFormInNewForms) {
            this.onFormSelect({key: currentForm.trainingId})
        } else if (currentFormInNewForms) {
            this.onFormSelect({key: currentFormInNewForms.trainingId})
        }
    }
    onDbChanges = (forms: AumtWeeklyTraining[]) => {
        if (!this.isFirstListen && forms && forms.length) {
            this.handleNewForms(forms)
        }
        this.isFirstListen = false
    }
    onClickTraining = (trainingId: string) => {
        this.onFormSelect({key: trainingId})
    }
    onFormSelect = (event: {key: string}) => {
        const selectedForm = this.state.allForms.find(f => f.trainingId === event.key)
        if (selectedForm) {
            this.setState({
                ...this.state,
                currentForm: selectedForm
            })
        } else {
            notification.error({
                message: 'No form found for selection...'
            })
        }
    }
    getFormsDropdown = () => {
        return (
            <Menu onClick={this.onFormSelect}>
                {this.state.allForms.map((form) => {
                    return (
                        <Menu.Item key={form.trainingId}>
                            {form.title}
                        </Menu.Item>
                        )
                    })
                }
            </Menu>
        )

    }
    render() {
        return (
            <div className="trainingDashboardContainer">
                <div className="weeklyStatSelectorContainer">
                        {/* <Button onClick={this.signMockData}>Mock Data</Button> */}
                        <Link to='/admin/createtraining' className='trainingDashboardCreateButton'>
                            <Button type='primary' shape='round' size='large'>
                                Create Training <PlusOutlined />
                            </Button>
                        </Link>
                        <Dropdown className='trainingDashboardFormSelector'
                            trigger={['click']}
                            overlay={this.getFormsDropdown}>
                            <Button size='large'>{this.state.currentForm && this.state.currentForm.title} <DownOutlined /></Button>
                        </Dropdown>
                        <div className="clearBoth"></div>
                    </div>
                <div className="trainingDashboardContentContainer">
                    <div className="weekStatsContainer trainingDashboardSection">
                        <h2 className="sectionHeader">Weekly Stats</h2>
                        <WeekStats loadingForms={this.state.loadingForms} form={this.state.currentForm}></WeekStats>
                    </div>
                    <div className="editMembersContainer trainingDashboardSection">
                    <h2 className="sectionHeader">Edit Members</h2>
                        {this.state.loadingForms ?
                            <div>Loading current forms <Spin /></div> :
                            this.state.currentForm ?
                            <EditSignups form={this.state.currentForm}></EditSignups> :
                            <p>No Form Selected</p>
                        }
                    </div>
                    <div className="clearBoth"></div>
                    <div className="manageTrainingsWrapper trainingDashboardSection">
                        <h2 className="sectionHeader">Manage Trainings</h2>
                        <div className="manageTrainingsComponentWrapper">
                            <ManageTrainings
                                trainings={this.state.allForms}
                                loadingTrainings={this.state.loadingForms}
                                onTrainingClick={this.onClickTraining}
                                onEditTrainingRequest={this.props.onEditTrainingRequest}
                                ></ManageTrainings>
                        </div>
                    </div>
                    <div className="yearStatsWrapper trainingDashboardSection">
                        <h2 className="sectionHeader">Yearly Stats</h2>
                        <YearStats forms={this.state.allForms} onTrainingClick={this.onClickTraining}></YearStats>
                    </div>
                    <div className="clearBoth"></div>
                </div>
            </div>
        )
    }
}