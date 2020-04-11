import React, {Component} from 'react'
import moment from 'moment'
import './TrainingGraphTooltip.css'
import db from '../../services/db'
import { AumtWeeklyTraining } from '../../types'
import { notification } from 'antd'

export type GraphSessionMap = Record<string, {title: string, color: string}>


interface TrainingGraphTooltipProps {
    data: {
        label: number
        payload: {
            fill: string,
            stroke: string,
            fillOpacity: number
            dataKey: string
            name: string
            color: string
            value: number
        }[]
    }
    sessionMap: GraphSessionMap
}

interface TrainingGraphTooltipState {
}

export class TrainingGraphTooltip extends Component<TrainingGraphTooltipProps, TrainingGraphTooltipState> {
    constructor(props: TrainingGraphTooltipProps) {
        super(props)
    }
    render() {
        if (!this.props.data || !this.props.data.payload) {
            return <div></div>
        }
        const d = new Date(this.props.data.label)
        return (
            <div className='trainingTooltipContainer'>
                <div className="tooltipTimePeriod">
                    {moment(d).format('dddd, MMM DD ha')}
                </div>
                <div className="tooltipValues">
                    {this.props.data.payload.reverse().map((sessionObj) => {
                        return (
                            <div key={sessionObj.name} className="tooltipValue">
                                <div className="tooltipSessionName" style={{'color': this.props.sessionMap[sessionObj.name].color}}>
                                    {this.props.sessionMap[sessionObj.name].title}:
                                </div>
                                <div className="tooltipSessionVal">
                                    {sessionObj.value}
                                </div>
                                <div className="clearBoth"></div>
                            </div>
                        )
                    })}
                </div>
            </div>
        )
    }
}