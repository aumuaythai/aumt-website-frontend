import React, {Component} from 'react'
import { Button, Menu, Dropdown, notification } from 'antd'
import { SyncOutlined, DownOutlined } from '@ant-design/icons'
import { CreateTraining } from './CreateTraining'
import './TrainingDashboard.css'
import { WeekStats } from './Stats/WeekStats'
import { YearStats } from './Stats/YearStats'
import { ManageTrainings } from './ManageTrainings'
import { AumtWeeklyTraining } from '../../../types'
import { EditSignups } from './EditSignups'
import db from '../../../services/db'


interface TrainingDashboardProps {
}

interface TrainingDashboardState {
    currentForm: AumtWeeklyTraining | null
    loadingForms: boolean
    allForms: AumtWeeklyTraining[]
    dbListenerId: string
}

export class TrainingDashboard extends Component<TrainingDashboardProps, TrainingDashboardState> {
    constructor(props: TrainingDashboardProps) {
        super(props)
        this.state = {
            currentForm: null,
            allForms: [],
            loadingForms: false,
            dbListenerId: ''
        }
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
                    dbListenerId: db.listen(this.onDbChanges)
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
            return a.closes > b.closes ? 1 : -1
        })
        this.setState({
            ...this.state,
            allForms: sortedForms
        })
        const currentTime = new Date()
        let currentForm = sortedForms[sortedForms.length - 1]
        for (let i = 0; i < sortedForms.length; i ++) {
            if (sortedForms[i].closes > currentTime) {
                currentForm = sortedForms[i]
                break
            }
        }
        this.onFormSelect({key: currentForm.trainingId})
    }
    onDbChanges = (forms: AumtWeeklyTraining[]) => {
        if (forms && forms.length) {
            this.handleNewForms(forms)
        }
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
                        <Dropdown
                            overlay={this.getFormsDropdown}>
                            <Button>{this.state.currentForm && this.state.currentForm.title} <DownOutlined /></Button>
                        </Dropdown>
                    </div>
                <div className="weekStatsContainer">
                    <h2 className="sectionHeader">Weekly Stats</h2>
                    <WeekStats loadingForms={this.state.loadingForms} form={this.state.currentForm}></WeekStats>
                </div>
                <div className="editMembersContainer">
                <h2 className="sectionHeader">Edit Members</h2>
                    {this.state.loadingForms ?
                        <p>Loading current forms <SyncOutlined spin /></p> :
                        this.state.currentForm ?
                        <EditSignups form={this.state.currentForm}></EditSignups> :
                        <p>No Form Selected</p>
                    }
                </div>
                <div className="clearBoth"></div>
                <div className="manageTrainingsWrapper">
                    <h2 className="sectionHeader">Manage Trainings</h2>
                    <div className="manageTrainingsComponentWrapper">
                        <ManageTrainings></ManageTrainings>
                    </div>
                </div>
                <div className="yearStatsWrapper">
                    <h2 className="sectionHeader">Yearly Stats</h2>
                    <YearStats></YearStats>
                </div>
                <div className="clearBoth"></div>
            </div>
        )
    }
}