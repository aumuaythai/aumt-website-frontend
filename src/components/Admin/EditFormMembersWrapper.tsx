import React, {Component} from 'react'
import {Select} from 'antd'
import { EditSignups } from './EditSignups'
import './EditSignups.css'
import db from '../../services/db'
import { AumtWeeklyTraining } from '../../types'


interface EditFormMembersWrapperProps {
}

interface EditFormMembersWrapperState {
    trainingForms: AumtWeeklyTraining[]
}

export class EditFormMembersWrapper extends Component<EditFormMembersWrapperProps, EditFormMembersWrapperState> {
    constructor(props: EditFormMembersWrapperProps) {
        super(props)
        this.state = {
            trainingForms: []
        }
    }
    componentDidMount = () => {
        // get db members and structure
        db.getOpenForms()
            .then((forms: AumtWeeklyTraining[]) => {
                forms[0].sessions[0].members = {
                    'Bella2304980193840n': 'Bella Parker',
                    'Fynn2304980193840n': 'Fynn Valencia',
                    'Duke2304980193840n': 'Duke Hussain',
                    'Irving2304980193840n': 'Irving Peters',
                    'Neve2304980193840n': 'Neve Stein',
                    'Lauryn2304980193840n': 'Lauryn Hardin',
                    'Isma2304980193840n': 'Isma Mcguire',
                    'Brittney2304980193840n': 'Brittney Thorpe',
                    'Lyla2304980193840n': 'Lyla-Rose ONeill',
                    'Ayra2304980193840n': 'Ayra Kendall',
                    'Kingsley2304980193840n': 'Kingsley Reader',
                    'Anisah2304980193840n': 'Anisah Barajas',
                    'Pierce2304980193840n': 'Pierce Millar',
                    'Amos2304980193840n': 'Amos Reeves',
                    'Corrie2304980193840n': 'Corrie Cash',
                    'Roosevelt2304980193840n': 'Roosevelt Brookes',
                    'Michele2304980193840n': 'Michele Murillo',
                    'Szymon2304980193840n': 'Szymon Wooten',
                    'Miranda2304980193840n': 'Miranda Monaghan',
                    'Humaira2304980193840n': 'Humaira Zamora',
                    'Wasim2304980193840n': 'Wasim Joyner',
                    'Julien2304980193840n': 'Julien Carney',
                    'Hari2304980193840n': 'Hari Rowland',
                    'Trent2304980193840n': 'Trent Charlton',
                    'Christos2304980193840n': 'Christos Roche',
                    'Matteo2304980193840n': 'Matteo Ortega',
                    'Kia2304980193840n': 'Kia Brady',
                    'Anand2304980193840n': 'Anand Dixon',
                    'Nettie2304980193840n': 'Nettie Walker',
                    'Hira2304980193840n': 'Hira Armitage',
                }
                this.setState({
                    trainingForms: forms
                })
            })
    }
    render() {
        return (
            <div>
                {this.state.trainingForms.map((form) => {
                    return (
                        <EditSignups key={form.trainingId} form={form}></EditSignups>
                    )
                })}
            </div>
        )
    }
}