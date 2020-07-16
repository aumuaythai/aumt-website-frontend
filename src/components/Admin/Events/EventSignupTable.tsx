import React, {Component} from 'react'
import { Link, withRouter, RouteComponentProps } from 'react-router-dom'
import { Spin, Button, notification, Table } from 'antd'
import { PlusOutlined, ArrowLeftOutlined } from '@ant-design/icons'
import './EventSignupTable.css'
import { AumtEvent, AumtEventSignupData, AumtEventSignupObject, AumtEventSignup } from '../../../types'
import db from '../../../services/db'
import AdminStore from '../AdminStore'
import moment from 'moment'


interface EventSignupTableProps {
    signupData: AumtEventSignup
}

interface EventSignupTableState {
    rows: (AumtEventSignupData & {key: string, displayTime: string}) []
    columns: {title: string, dataIndex: string}[]
}

export class EventSignupTable extends Component<EventSignupTableProps, EventSignupTableState> {
    constructor(props: EventSignupTableProps) {
        super(props)
        this.state = {
            rows: [],
            columns: []
        }
    }
    componentDidMount = () => {
        this.setState({
            ...this.state,
            columns: this.getColumns()
        }, () => {
            this.handleNewData(this.props.signupData)
        })
    }
    componentDidUpdate = (prevProps: EventSignupTableProps, prevState: EventSignupTableState) => {
        if (prevProps.signupData !== this.props.signupData) {
            this.handleNewData(Object.assign({}, this.props.signupData))
        }
    }
    handleNewData = (signupData: AumtEventSignup) => {
        const rows = Object.keys(signupData)
            .map((uid: string) => {
                const signup = signupData[uid]
                return Object.assign(signup,
                    {
                        key: uid,
                        displayTime: moment(new Date(signup.timeSignedUpMs)).format('dd MMM hh:mm')
                    })
            })
        this.setState({
            ...this.state,
            rows
        })
    }
    getColumns = () => {
        const columns = [
            {
                title: 'Name',
                dataIndex: 'displayName',
            },
            {
                title: 'Confirmed',
                dataIndex: 'confirmed'
            },
            {
                title: 'Time',
                dataIndex: 'displayTime'
            }
        ]
        return columns
    }
    render() {
        return <div>
            <Table
                size='small'
                pagination={false}
                bordered
                columns={this.state.columns}
                dataSource={this.state.rows}
            ></Table>
        </div>
    }
}