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
import db from '../../../../services/db'
import { AumtWeeklyTraining } from '../../../../types'
import { notification } from 'antd'
import moment from 'moment'
import GraphUtil from '../../../../services/graph.util'
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
                        week: form.trainingId,
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
        const currentForm = this.state.allForms.find(f => f.trainingId === props.label)
        if (!currentForm) {
            return (<div></div>)
        }
        const tooltipValues = currentForm.sessions.reduce((vals, session) => {
            const members = Object.keys(session.members).length
            vals[session.sessionId] = members
            vals['total'] += members
            return vals
        }, {total: 0} as Record<string, number>)
        return (
            <div className='yearStatsTooltip'>
                <div className="yearStatsTooltipTitle">
                    {currentForm.title}
                </div>
                <div className="yearStatsTooltipRow">
                    <div className="yearStatsTooltipName">
                            TOTAL
                    </div>
                    <div className="yearStatsTooltipVal">
                        {tooltipValues['total']}
                    </div>
                    <div className="clearBoth"></div>
                </div>
                {currentForm.sessions.map((session) => {
                    return (
                        <div key={session.sessionId} className="yearStatsTooltipRow">
                            <div className="yearStatsTooltipName">
                                {session.title}
                            </div>
                            <div className="yearStatsTooltipVal">
                                {tooltipValues[session.sessionId]}
                            </div>
                            <div className="clearBoth"></div>
                        </div>
                    )
                })}
            </div>
        )
    }
    render() {
        return (
            <div className='yearStatsContainer'>
                    <ResponsiveContainer width = '100%' height = {300} >
                        <LineChart data={this.state.currentGraphData}>
                            <XAxis
                                dataKey = 'week'
                                tickFormatter={(tick) => tick.substring(0, 5)}
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