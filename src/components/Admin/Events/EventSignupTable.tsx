import React, {Component} from 'react'
import { Table, Tooltip, notification } from 'antd'
import { FormOutlined } from '@ant-design/icons'
import './EventSignupTable.css'
import { AumtEventSignupData, AumtEventSignup } from '../../../types'
import moment from 'moment'
import { ColumnsType } from 'antd/lib/table'
import db from '../../../services/db'


type TableRow = AumtEventSignupData & {key: string, displayTime: string}

interface EventSignupTableProps {
    signupData: AumtEventSignup
    eventId: string
}

interface EventSignupTableState {
    rows: TableRow[]
    columns: ColumnsType<TableRow>
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

    updateConfirmed = (row: TableRow, newConfirmed: boolean) => {
        db.confirmMemberEventSignup(this.props.eventId, row.key, newConfirmed)
            .then(() => {
                notification.success({message: `Updated confirmed for ${row.displayName} to ${newConfirmed ? 'Yes' : 'No'}`})
            })
            .catch((err) => {
                notification.error({message: `Error confirming signup: ${err.toString()}`})
            })
    }
    handleNewData = (signupData: AumtEventSignup) => {
        const rows = Object.keys(signupData)
            .map((uid: string) => {
                const signup = signupData[uid]
                return Object.assign(signup,
                    {
                        key: uid,
                        displayTime: moment(new Date(signup.timeSignedUpMs)).format('MMM DD HH:mm')
                    })
            })
        this.setState({
            ...this.state,
            rows,
            columns: this.getColumns()
        })
    }
    getColumns = () => {
        const columns: ColumnsType<TableRow> = [
            {
                title: 'Name',
                dataIndex: 'displayName',
            },
            {
                title: 'Confirmed',
                dataIndex: 'confirmed',
                filters: [{text: 'Yes', value: true}, 
                    {text: 'No', value: false}],
                onFilter: (value: string | number | boolean, record: TableRow) => {
                    return value === record.confirmed
                },
                render: (val: boolean, record: TableRow) => {
                    const text = val ? 'Yes' : 'No'
                    const newConfirmed = text === 'Yes'  ? 'No' : 'Yes'
                    return <span>
                        {text} <Tooltip title={`Change to ${newConfirmed}`}>
                            <span className="noLinkA rightTableText" onClick={e => e.stopPropagation()}>
                                <FormOutlined onClick={e => this.updateConfirmed(record, newConfirmed === 'Yes')}/>
                            </span>
                        </Tooltip>
                    </span>
                }
            },
            {
                title: 'Time',
                dataIndex: 'displayTime',
                defaultSortOrder: 'ascend',
                sorter: (a: TableRow, b: TableRow) => a.timeSignedUpMs - b.timeSignedUpMs,
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
                columns={this.getColumns()}
                dataSource={this.state.rows}
            ></Table>
        </div>
    }
}