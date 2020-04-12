import React, {Component} from 'react'
import { Button, Menu } from 'antd'
import { CreateTraining } from './CreateTraining'
import './TrainingDashboard.css'
import { EditFormMembersWrapper } from './EditFormMembersWrapper'
import { WeekStats } from './Stats/WeekStats'
import { YearStats } from './Stats/YearStats'
import { ManageTrainings } from './ManageTrainings'


interface TrainingDashboardProps {
}

interface TrainingDashboardState {
    refreshingMemberEdit: boolean
}

export class TrainingDashboard extends Component<TrainingDashboardProps, TrainingDashboardState> {
    constructor(props: TrainingDashboardProps) {
        super(props)
        this.state = {
            refreshingMemberEdit: false
        }
    }
    requestRefresh = () => {

    }
    render() {
        return (
            <div className="trainingDashboardContainer">
                <div className="weekStatsContainer">
                    <h2 className="sectionHeader">Weekly Stats</h2>
                    <WeekStats></WeekStats>
                </div>
                <div className="editMembersContainer">
                <h2 className="sectionHeader">Edit Members</h2>
                    <EditFormMembersWrapper requestRefresh={this.requestRefresh}></EditFormMembersWrapper>
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
            </div>
        )
    }
}