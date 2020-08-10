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

import { Radio } from 'antd'

import './YearStats.css'
import { AumtWeeklyTraining } from '../../../../types'


interface YearStatsProps {
    onTrainingClick: (trainingId: string) => void;
    forms: AumtWeeklyTraining[]
}

interface YearStatsState {
    currentGraphData: {week: string, total: number, totalPercent: number}[]
    showPercent: boolean
}

export class YearStats extends Component<YearStatsProps, YearStatsState> {
    constructor(props: YearStatsProps) {
        super(props)
        this.state = {
            currentGraphData: [],
            showPercent: false
        }
    }
    componentDidUpdate(prevProps: YearStatsProps, prevState: YearStatsState) {
        if (this.props !== prevProps && this.props.forms) {
            const now = new Date()
            const graphData = this.props.forms
                .filter(f => f.opens < now)
                .map((form) => {
                    const total = Object.values(form.sessions).reduce((sum, cur) => {
                        return sum + Object.keys(cur.members).length
                    }, 0)
                    const limit = Object.values(form.sessions).reduce((sum, cur) => sum + cur.limit, 0)
                    return {
                        week: form.trainingId,
                        total,
                        totalPercent: 100 * total / limit
                    }
                })
            this.setState({
                ...this.state,
                currentGraphData: graphData.slice().reverse()
            })
        }
    }
    setShowPercent = (percent: boolean) => {
        this.setState({...this.state, showPercent: percent})
    }
    onFormClick = (data: {payload: {week: string}}) => {
        this.props.onTrainingClick(data.payload.week)
    }
    customTooltip = (props: any) => {
        const currentForm = this.props.forms.find(f => f.trainingId === props.label)
        if (!currentForm) {
            return (<div></div>)
        }
        const tooltipValues = Object.values(currentForm.sessions).reduce((vals, session) => {
            const members = Object.keys(session.members).length
            vals[session.sessionId] = members
            vals['total'] += members
            vals['limit'] += session.limit
            return vals
        }, {total: 0, limit: 0} as Record<string, number>)
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
                        {this.state.showPercent ?
                            `${Math.round(tooltipValues['total'] * 100 / tooltipValues['limit'])}% (${tooltipValues['total']} / ${tooltipValues.limit})` :
                            tooltipValues['total']}
                    </div>
                    <div className="clearBoth"></div>
                </div>
                {Object.values(currentForm.sessions).sort((a, b) => a.position - b.position).map((session) => {
                    return (
                        <div key={session.sessionId} className="yearStatsTooltipRow">
                            <div className="yearStatsTooltipName">
                                {session.title}
                            </div>
                            <div className="yearStatsTooltipVal">
                                {this.state.showPercent ? `${tooltipValues[session.sessionId]} / ${session.limit}`: tooltipValues[session.sessionId]}
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
                <Radio.Group className='yearStatsTotalOrPercent' value={this.state.showPercent} onChange={e => this.setShowPercent(e.target.value)}>
                    <Radio.Button value={false}>Total</Radio.Button>
                    <Radio.Button value={true}>Percent</Radio.Button>
                </Radio.Group>
                <ResponsiveContainer width = '100%' height = '100%' >
                    <LineChart data={this.state.currentGraphData}>
                        <XAxis
                            dataKey = 'week'
                            tickFormatter={(tick) => tick.substring(0, 6)}
                            domain = {['auto', 'auto']}
                            name = 'Week'
                        />
                        <CartesianGrid horizontal={true} vertical={false}/>
                            <Tooltip content={this.customTooltip}/>
                        <YAxis/>
                    <Line dataKey={this.state.showPercent ? 'totalPercent' : 'total'} activeDot={{onClick: (p: {payload: {week: string}})=> this.onFormClick(p) }}/>
                    </LineChart>
                </ResponsiveContainer>
            </div>
        )
    }
}