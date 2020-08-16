import React, {Component} from 'react'
import { Table, Tooltip, notification, Button, Select, Tag } from 'antd'
import { FormOutlined, CopyOutlined, ArrowRightOutlined, ArrowLeftOutlined } from '@ant-design/icons'
import { TableCurrentDataSource } from 'antd/lib/table/interface';
import './EventSignupTable.css'
import { AumtEventSignupData, AumtEventSignup, LicenseClasses } from '../../../types'
import moment from 'moment'
import { ColumnsType } from 'antd/lib/table'
import db from '../../../services/db'
import dataUtil from '../../../services/data.util'
import { spawn } from 'child_process'


type TableRow = AumtEventSignupData & {key: string, displayTime: string}

interface EventSignupTableProps {
    signupData: AumtEventSignup
    urlPath: string
    eventId: string
    isWaitlist: boolean
    isCamp: boolean
    limit: number | null
}

interface EventSignupTableState {
    rows: TableRow[]
    selectedRows: TableRow[]
    columns: ColumnsType<TableRow>
    tableLoading: boolean
    selectedSignup: TableRow | null
}

export class EventSignupTable extends Component<EventSignupTableProps, EventSignupTableState> {
    private keyNameMap: Record<keyof TableRow, string> = {
        confirmed: 'Paid?',
        displayName: 'Name',
        key: 'Firebase UID',
        timeSignedUpMs: 'Time Signed Up (ms)',
        displayTime: 'Time Signed Up',
        email: 'Email',
        dietaryRequirements: 'Dietary',
        medicalInfo: 'Medical',
        driverLicenseClass: 'License',
        seatsInCar: 'Seats'
    }
    constructor(props: EventSignupTableProps) {
        super(props)
        this.state = {
            rows: [],
            selectedRows: [],
            columns: [],
            tableLoading: false,
            selectedSignup: null
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

    updateConfirmed = (row: TableRow | null, newConfirmed: boolean) => {
        if (!row) {
            return
        }
        db.confirmMemberEventSignup(this.props.eventId, row.key, newConfirmed, this.props.isWaitlist)
            .then(() => {
                notification.success({message: `Updated confirmed for ${row.displayName} to ${newConfirmed ? 'Yes' : 'No'}`})
            })
            .catch((err) => {
                notification.error({message: `Error confirming signup: ${err.toString()}`})
            })
    }
    deleteMember = (key: string) => {
        if (!key) return
        db.removeMemberFromEvent(key, this.props.eventId, this.props.isWaitlist)
            .then(() => {
                notification.success({message: `Removed from ${this.props.isWaitlist ? 'waitlist' : 'signups'}`})
            })
            .catch((err) => {
                notification.error({message: `Error removing from event: ${err.toString()}`})
            })
    }
    onMoveClick = (key: string) => {
        if (!key) return
        this.setState({...this.state, tableLoading: true})
        const data = this.props.signupData[key]
        db.signUpToEvent(this.props.eventId, key, data, !this.props.isWaitlist)
            .then(() => {
                return db.removeMemberFromEvent(key, this.props.eventId, this.props.isWaitlist)
            })
            .then(() => {
                notification.success({message: `Successfully moved to ${this.props.isWaitlist ? 'signups' : 'waitlist'}`})
            })
            .catch((err) => {
                notification.error({message: `Error moving member: ${err.toString()}`})
            })
            .finally(() => {
                this.setState({...this.state, tableLoading: false})
            })
    }
    onSelectSignup = (key: string) => {
        const member = this.state.rows.find(r => r.key === key)
        if (member) {
            this.setState({
                ...this.state,
                selectedSignup: member
            })
        }
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
        const selectedMember = rows.find(r => r.key === this.state.selectedSignup?.key)
        this.setState({
            ...this.state,
            rows,
            columns: this.getColumns(),
            selectedSignup: selectedMember || null
        })
    }
    getColumns = () => {
        const columns: ColumnsType<TableRow> = [
            {
                title: 'Name',
                dataIndex: 'displayName',
            },
            {
                title: 'Email',
                dataIndex: 'email'
            },
            {
                title: 'Paid',
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
                        {text}
                         <Tooltip title={`Change to ${newConfirmed}`}>
                            <span className="noLinkA rightTableText" onClick={e => e.stopPropagation()}>
                                <FormOutlined onClick={e => this.updateConfirmed(record, newConfirmed === 'Yes')}/>
                            </span>
                        </Tooltip>
                    </span>
                }
            },
            {
                title: 'Dietary Reqs',
                dataIndex: 'dietaryRequirements'
            },
            {
                title: 'Medical Info',
                dataIndex: 'medicalInfo'
            },
            {
                title: 'License',
                dataIndex: 'driverLicenseClass',
                filters: [{text: 'Full 2+ years', value: 'Full 2+ years'},
                        {text: 'Full <2 years', value: 'Full <2 years'},
                        {text: 'Restricted', value: 'Restricted'},
                        {text: 'None/Other', value: 'Other'}],
                onFilter: (value: string | number | boolean, record: TableRow) => {
                    return value === record.driverLicenseClass
                },
                render: (val: LicenseClasses, record: TableRow) => {
                    return <span>{(val === 'Other' || !val) ? 'None/Other' : val}</span>
                }
            },
            {
                title: 'Owns Car',
                dataIndex: 'seatsInCar',
                render: (val: number, record: TableRow) => {
                    return val && val > -1 ? <span>Yes, {val} seats</span> : 'No'
                },
                filters: [{text: 'Yes', value: true},
                            {text: 'No', value: false}],
                onFilter: (value: boolean | string | number, record: TableRow) => {
                    console.log(value, record.seatsInCar)
                    return !(record.seatsInCar == -1) === value
                }
            },
            {
                title: 'Time',
                dataIndex: 'displayTime',
                defaultSortOrder: 'ascend' as any,
                sorter: (a: TableRow, b: TableRow) => b.timeSignedUpMs - a.timeSignedUpMs,
            },
            {
                title: 'Action',
                render: (val: boolean, record: TableRow) => {
                    return <span>
                        {this.props.isWaitlist ? 
                        <Button onClick={e => this.onMoveClick(record.key)}>Move<ArrowLeftOutlined/></Button>
                        : <Button onClick={e => this.onMoveClick(record.key)}><ArrowRightOutlined/>Move</Button>}
                        <Button type='link' onClick={e => this.deleteMember(record.key)}>Delete</Button>
                    </span>
                }
            }
        ].filter(r => this.props.isCamp ? r : ['dietaryRequirements', 'driverLicenseClass', 'seatsInCar'].indexOf(r.dataIndex || '') === -1)
        return columns
    }
    getFooter = (totalDisplayed: number) => {
        return <div>
            <Button className='eventSignupTableFooterDownloadButton' type='link' onClick={this.copyEmails}>Copy Emails</Button>
            <Button className='eventSignupTableFooterDownloadButton' type='link' onClick={this.downloadCsv}>Download .csv</Button>
            <p className='eventSignupsTableFooterText'>Total: {totalDisplayed} / Limit: {this.props.limit || 'None'}</p>
        </div>
    }
    copyText = (text: string | undefined) => {
        if (text) dataUtil.copyText(text)
    }
    onMemberSelect = (member: TableRow) => {
        this.setState({...this.state, selectedSignup: member})
    }
    sortTableKeys = (a: keyof TableRow, b: keyof TableRow) => {
        const keyMap: Record<keyof TableRow, number> = {
            displayName: 100,
            email: 90,
            confirmed: 80,
            displayTime: 50,
            dietaryRequirements: 40,
            medicalInfo: 35,
            driverLicenseClass: 30,
            seatsInCar: 20,
            timeSignedUpMs: 10,
            key: 5
        }
        return keyMap[a] > keyMap[b] ? -1 : 1
    }
    copyEmails = () => {
        dataUtil.copyText(Object.keys(this.props.signupData)
            .filter(key => {
                if (this.state.selectedRows.length) {
                    return this.state.selectedRows.find(r => r.key === key)
                }
                return true
            })
            .map(key => this.props.signupData[key].email)
            .join('\n'))
    }
    downloadCsv = () => {
        let header = false
        let csvStr = ''
        const fileName = `${this.props.urlPath}_${this.props.isWaitlist ? 'waitlist' : 'signups'}.csv`
        const csvRows = this.state.selectedRows.length ? this.state.selectedRows : this.state.rows
        csvRows
            .sort((a, b) => a.timeSignedUpMs - b.timeSignedUpMs)
            .forEach((row) => {
                if (!header) {
                    header = true
                    csvStr  += (Object.keys(row) as (keyof TableRow)[])
                        .sort(this.sortTableKeys)
                        .map(k => this.keyNameMap[k])
                        .join(',') + '\n'
                }
                csvStr += (Object.keys(row) as (keyof TableRow)[])
                    .sort(this.sortTableKeys)
                    .map((key) => row[key])
                    .join(',') + '\n'
            })
        dataUtil.downloadCsv(fileName, csvStr)
    }
    onTableChange = (pagination: any, filter: Record<keyof TableRow, React.ReactText[] | null>, sorter: any, dataSource: TableCurrentDataSource<TableRow>, ...extra: any) => {
            this.setState({
                ...this.state,
                selectedRows: dataSource.currentDataSource,
            })
    }
    render() {
        if (window.innerWidth < 600) {
            const curSelected = this.state.selectedSignup
            return <div>
                <Select
                className='eventSignupSelect'
                placeholder='Select Member'
                onChange={this.onSelectSignup}
                >
                    {this.state.rows.sort((a, b) => a.timeSignedUpMs - b.timeSignedUpMs).map((signup: TableRow) => {
                            return <Select.Option key={signup.key} value={signup.key}>
                                <div className='eventSignupSelectName'>{signup.displayName}</div>
                                <div className='eventSignupSelectTime'>{signup.displayTime}</div>
                                {signup.confirmed ? 
                                    <Tag className='eventSignupSelectPaidTag' color='success'>Paid</Tag>
                                    : ''}
                                </Select.Option>
                        })}
                </Select>
                {curSelected ?
                <div className="eventSignupMemberInfo">
                    <p>Email: {curSelected.email} <CopyOutlined onClick={e => this.copyText(curSelected?.email)}/></p>
                    <p>Paid: {curSelected.confirmed ? 'Yes' : 'No'}
                        <Button 
                        type='link'
                        onClick={e => this.updateConfirmed(curSelected, !curSelected?.confirmed)}>
                            Change
                            </Button>
                        </p>
                    <p>Dietary Reqs: {curSelected.dietaryRequirements || 'None'}</p>
                    <p>License: {curSelected.driverLicenseClass || 'None'}</p>
                    <p>Owns a Car?, Seats: {(curSelected.seatsInCar && curSelected.seatsInCar > -1) ? `Yes, ${curSelected.seatsInCar}` : 'No'}</p>
                    <Button
                        onClick={e => this.onMoveClick(curSelected?.key || '')}
                        disabled={!curSelected}>
                        Move to {this.props.isWaitlist ? ' signups' : ' waitlist'}</Button>
                    <Button
                        onClick={e => this.deleteMember(curSelected?.key || '')}
                        disabled={!curSelected} type='link'>Delete</Button>
                </div>
                : ''}
            </div>
        }
        return <div>
            <Table
                size='small'
                pagination={{
                    defaultPageSize: 10,
                    showSizeChanger: true,
                    pageSizeOptions: ['10', '20', '50'],
                    showTotal: this.getFooter
                }}
                onChange={this.onTableChange}
                bordered
                loading={this.state.tableLoading}
                columns={this.getColumns()}
                dataSource={this.state.rows}
                scroll={{ y: 400 }}
            ></Table>
        </div>
    }
}