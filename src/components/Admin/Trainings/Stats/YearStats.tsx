import React, {Component} from 'react'
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
    onFormClick = (data: {payload: {week: string}}) => {
        console.log(data.payload.week)
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
                <h2 className='yearStatTitle'>Year Stats</h2>
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
                    <Line dataKey='total' activeDot={{onClick: (p: {payload: {week: string}})=> this.onFormClick(p) }}/>
                    </LineChart>
                </ResponsiveContainer>
            </div>
        )
    }
}