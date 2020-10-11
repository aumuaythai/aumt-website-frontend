import React, {Component} from 'react'
import { Card, Spin, notification, Tooltip } from 'antd'
import {CopyOutlined} from '@ant-design/icons'
import './CommitteeApps.css'
import { AumtCommitteeApp } from '../../../types'
import db from '../../../services/db'
import dataUtil from '../../../services/data.util'


interface CommitteeAppsProps {}

interface CommitteeAppsState {
    apps: AumtCommitteeApp[]
    loadingForms: boolean
}

export class CommitteeApps extends Component<CommitteeAppsProps, CommitteeAppsState> {
    constructor(props: CommitteeAppsProps) {
        super(props)
        this.state = {
            apps: [],
            loadingForms: false
        }
    }
    componentDidMount = () => {
        this.setState({
            ...this.state,
            loadingForms: true
        })
        db.getCommitteeApplications()
            .then((apps) => {
                this.setState({
                    ...this.state,
                    loadingForms: false,
                    apps
                })
            })
            .catch((err) => {
                notification.error({message: 'Could not retrieve applications: ' + err.toString()})
                this.setState({...this.state, loadingForms: false})
            })
    }
    copyText = (text: string) => {
        dataUtil.copyText(text)
    }
    render() {
        if (this.state.loadingForms) {
            return (<div className='retrievingAppsText'>Retrieving Applications <Spin/></div>)
        }
        if (!this.state.apps.length) {
            return <div className="retrievingAppsText">No Applications</div>
        }
        return (
            <div className="committeeAppsDisplayContainer">
                {this.state.apps.map((app) => {
                    return <div className='committeeApplicationContainer' key={app.timestampMs}>
                        <Card title={app.fullName}>
                            <p>Email: {app.email} <Tooltip title='Copy'>
                                <span><CopyOutlined onClick={e => this.copyText(app.email)}/></span>
                            </Tooltip></p>
                            <p>Phone Number: {app.phone || 'Not Provided'}</p>
                            <div className="committeeAppSkillsContainer">
                                <div className="committeeAppRoleResponseDisplay">
                                    <h3>Role 1: {app.role1}</h3>
                                    <p>{app.whyrole1}</p>
                                </div>
                                {app.role2 ? 
                                <div className="committeeAppRoleResponseDisplay">
                                    <h3>Role 2: {app.role2}</h3>
                                    <p>{app.whyrole2}</p>
                                </div>
                                : 
                                <h3>Role 2: None</h3>
                                }
                            </div>
                        </Card>
                    </div>
                })}
            </div>
        )
    }
}