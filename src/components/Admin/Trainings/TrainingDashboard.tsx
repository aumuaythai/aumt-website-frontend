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
}

export class TrainingDashboard extends Component<TrainingDashboardProps, TrainingDashboardState> {
    requestRefresh = () => {

    }
    render() {
        return (
            <div className="trainingDashboardContainer">
                <WeekStats></WeekStats>
                <div className="editMembersContainer">
                    <EditFormMembersWrapper requestRefresh={this.requestRefresh}></EditFormMembersWrapper>
                </div>
                <div className="manageTrainingsContainer">
                    <ManageTrainings></ManageTrainings>
                </div>
                <div className="yearStatsContainer">
                <YearStats></YearStats>
                </div>
            </div>
        )
    }
}