import React, {Component} from 'react'
import { Spin } from 'antd'
import {
    CartesianGrid,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis,
    Area,
    AreaChart,
  } from 'recharts'

import './WeekStats.css'
import { AumtWeeklyTraining } from '../../../../types'
import moment from 'moment'
import DataFormatUtil, {MemberPoint} from '../../../../services/data.util'
import { TrainingGraphTooltip, GraphSessionMap } from './TrainingGraphTooltip'


interface WeekStatsProps {
    loadingForms: boolean,
    form: AumtWeeklyTraining | null
}

interface WeekStatsState {
    currentSessionMap: GraphSessionMap
    currentGraphData: MemberPoint[]
}

export class WeekStats extends Component<WeekStatsProps, WeekStatsState> {
    constructor(props: WeekStatsProps) {
        super(props)
        this.state = {
            currentGraphData: [],
            currentSessionMap: {}
        }
    }
    componentDidMount() {
    }

    componentDidUpdate(prevProps: WeekStatsProps, prevState: WeekStatsState) {
        if (this.props !== prevProps && this.props.form) {
            const data = DataFormatUtil.getDataFromForm(this.props.form)
            const currentSessionMap: GraphSessionMap  = {}
            Object.keys(this.props.form.sessions).forEach((sessionId) => {
                const session = this.props.form?.sessions[sessionId]
                if (session) {
                    currentSessionMap[session.sessionId] = {
                        title: session.title,
                        color: this.getRandomHex()
                    }
                }
            })
            this.setState({
                ...this.state,
                currentGraphData: data,
                currentSessionMap: currentSessionMap
            })
        }
    }

    CustomTooltip = (props: any) => {
        return <TrainingGraphTooltip sessionMap={this.state.currentSessionMap} data={props}></TrainingGraphTooltip>
      };

    getRandomHex = () => {
        const vals = '0123456789ABCD'
        let hex = '#'
        for (let i = 0; i < 6; i ++) {
            hex += vals[Math.floor(Math.random() * vals.length)]
        }
        return hex
    }

    render() {
        if (this.props.loadingForms) {
            return (<div>Retrieving stats <Spin/></div>)
        }
        if (!this.props.form) {
            return (
                <p>No forms in db</p>
            )
        }
        return (
            <div className='weekStatsComponentContainer'>
                <div className="clearBoth"></div>
                <div className="WeekStatGraphWrapper">
                    <ResponsiveContainer width = '100%' height = '100%' >
                        <AreaChart data={this.state.currentGraphData}>
                            <XAxis
                                dataKey = 'time'
                                domain = {['auto', 'auto']}
                                name = 'Time'
                                tickFormatter = {(unixTime: number) => moment(unixTime).format('DD/MM')}
                                type = 'number'
                            />
                            <CartesianGrid horizontal={true} vertical={false}/>
                            <Tooltip content={this.CustomTooltip}/>
                            <YAxis/>
                        {
                            Object.values(this.props.form.sessions)
                                .sort((a, b) => a.position - b.position)
                                .slice()
                                .reverse()
                                .map((session) => {
                                const sessionObj = this.state.currentSessionMap[session.sessionId]
                                if (!sessionObj) {
                                    return <div key={session.sessionId}></div>
                                }
                                return (
                                    <Area
                                        key={session.sessionId}
                                        stackId='1'
                                        dataKey={session.sessionId}
                                        fill={sessionObj.color}
                                        stroke={sessionObj.color}/>
                                    )
                            })
                        }
                        </AreaChart>
                    </ResponsiveContainer>
                </div>
            </div>
        )
    }
}