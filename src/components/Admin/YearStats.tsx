import React, {Component} from 'react'
import { Dropdown, Button, Menu, Statistic } from 'antd'
import { SyncOutlined, DownOutlined } from '@ant-design/icons'
import {
    CartesianGrid,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis,
    Line,
    LineChart,
  } from 'recharts'

import './YearStats.css'
import db from '../../services/db'
import { AumtWeeklyTraining } from '../../types'
import { notification } from 'antd'
import moment from 'moment'
import GraphUtil from '../../services/graph.util'
import { TrainingGraphTooltip, GraphSessionMap } from './TrainingGraphTooltip'


interface YearStatsProps {
}

interface YearStatsState {
    allForms: AumtWeeklyTraining[]
    loadingForms: boolean
    currentGraphData: {week: string, total: number}[]
}

export class YearStats extends Component<YearStatsProps, YearStatsState> {
    constructor(props: YearStatsProps) {
        super(props)
        this.state = {
            loadingForms: false,
            allForms: [],
            currentGraphData: []
        }
    }
    componentDidMount() {
        this.setState({
            ...this.state,
            loadingForms: true
        })
        db.getAllForms()
            .then((forms: AumtWeeklyTraining[]) => {
                const graphData = forms.map((form) => {
                    return {
                        week: form.title,
                        total: form.sessions.reduce((sum, cur) => {
                            return sum + Object.keys(cur.members).length
                        }, 0)
                    }
                })
                this.setState({
                    ...this.state,
                    allForms: forms,
                    currentGraphData: graphData,
                    loadingForms: false
                })
            })
            .catch((err) => {
                notification.error({
                    message: err.toString()
                })
                this.setState({
                    ...this.state,
                    loadingForms: false
                })
            })
    }
    customTooltip = (props: any) => {
        return (
            <div className='yearStatsTooltip'>{props.label}</div>
        )
    }
    render() {
        return (
            <div className='yearStatsContainer'>
                    <ResponsiveContainer width = '100%' height = {300} >
                        <LineChart data={this.state.currentGraphData}>
                            <XAxis
                                dataKey = 'week'
                                tick={false}
                                domain = {['auto', 'auto']}
                                name = 'Week'
                            />
                            <CartesianGrid horizontal={true} vertical={false}/>
                                <Tooltip content={this.customTooltip}/>
                            <YAxis/>
                        {
                            this.state.allForms && this.state.allForms.map((form) => {
                                return (
                                    <Line
                                        key={form.trainingId}
                                        dataKey='total'
                                        />
                                    )
                            })
                        }
                        </LineChart>
                    </ResponsiveContainer>
            </div>
        )
    }
}