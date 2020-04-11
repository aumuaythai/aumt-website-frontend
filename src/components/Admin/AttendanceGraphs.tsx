import React, {Component} from 'react'
import { Dropdown, Button, Menu } from 'antd'
import { SyncOutlined, DownOutlined } from '@ant-design/icons'
import {
    CartesianGrid,
    Legend,
    ResponsiveContainer,
    Scatter,
    Tooltip,
    XAxis,
    YAxis,
    Area,
    AreaChart,
  } from 'recharts'

import './AttendanceGraphs.css'
import db from '../../services/db'
import { AumtWeeklyTraining } from '../../types'
import { notification } from 'antd'
import moment from 'moment'
import GraphUtil from '../../services/graph.util'
import { TrainingGraphTooltip, GraphSessionMap } from './TrainingGraphTooltip'


interface AttendanceGraphsProps {
}

interface AttendanceGraphsState {
    currentForm: AumtWeeklyTraining | null
    allForms: AumtWeeklyTraining[]
    currentSessionMap: GraphSessionMap
    loadingForms: boolean
    currentGraphData: any
}

export class AttendanceGraphs extends Component<AttendanceGraphsProps, AttendanceGraphsState> {
    constructor(props: AttendanceGraphsProps) {
        super(props)
        this.state = {
            currentForm: null,
            allForms: [],
            loadingForms: false,
            currentGraphData: {},
            currentSessionMap: {}
        }
    }
    componentDidMount() {
        this.setState({...this.state, loadingForms: true})
        db.getAllForms()
            .then((forms: AumtWeeklyTraining[]) => {
                if (forms.length) {
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
                this.setState({...this.state, loadingForms: false})
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

    onFormSelect = (event: {key: string}) => {
        const selectedForm = this.state.allForms.find(f => f.trainingId === event.key)
        if (selectedForm) {
            const data = GraphUtil.getDataFromForm(selectedForm)
            const currentSessionMap: GraphSessionMap  = {}
            selectedForm.sessions.forEach((session) => {
                currentSessionMap[session.sessionId] = {
                    title: session.title,
                    color: this.getRandomHex()
                }
            })
            this.setState({
                ...this.state,
                currentForm: selectedForm,
                currentGraphData: data,
                currentSessionMap: currentSessionMap
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
        if (this.state.loadingForms) {
            return (<p>Retrieving stats <SyncOutlined spin/></p>)
        }
        if (this.state.allForms.length === 0) {
            return (
                <p>No forms in db</p>
            )
        }
        return (
            <div className='attendanceGraphsContainer'>
                <div className="attendanceGraphHeader">
                    <Dropdown
                        overlay={this.getFormsDropdown}>
                        <Button>{this.state.currentForm && this.state.currentForm.title} <DownOutlined /></Button>
                    </Dropdown>
                </div>
                <div className="attendanceGraphWrapper">
                    <ResponsiveContainer width = '95%' height = {300} >
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
                            this.state.currentForm && this.state.currentForm.sessions.reverse().map((session) => {
                                return (
                                    <Area
                                        key={session.sessionId}
                                        stackId='1'
                                        dataKey={session.sessionId}
                                        fill={this.state.currentSessionMap[session.sessionId].color}
                                        stroke={this.state.currentSessionMap[session.sessionId].color}/>
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