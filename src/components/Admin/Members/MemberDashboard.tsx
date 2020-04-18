import React, {Component} from 'react'
import { Table, notification } from 'antd'
import { SyncOutlined } from '@ant-design/icons'
import './MemberDashboard.css'
import DataFormatterUtil, {TableColumn, TableDataLine} from '../../../services/data.formatter'
import { AumtMember, AumtMembersObj } from '../../../types'
import db from '../../../services/db'
import { TableHelper } from './TableHelper'

interface MemberDashboardProps {}

interface MemberDashboardState {
    currentMembers: AumtMembersObj
    loadingMembers: boolean
    tableDataSource: TableDataLine[]
    tableColumns: TableColumn[]
}

export class MemberDashboard extends Component<MemberDashboardProps, MemberDashboardState> {
    private tableHelper: React.Ref<TableHelper>
    constructor(props: MemberDashboardProps) {
        super(props)
        this.state = {
            currentMembers: {},
            loadingMembers: false,
            tableDataSource: [],
            tableColumns: []
        }
        this.tableHelper = React.createRef()
    }
    componentDidMount = () => {
        this.setState({...this.state, loadingMembers: true})
        db.getAllMembers()
            .then((memberObj) => {
                console.log(this.tableHelper)
                if (this.tableHelper) {
                // const {lines, columns} = this.tableHelper.current.getTableFromMembers(memberObj)
                //     this.setState({
                //         ...this.state,
                //         tableDataSource: lines,
                //         tableColumns: columns
                //     })
                }
            })
            .catch((err) => {
                notification.error({
                    message: 'Could not get members: ' + err.toString()
                })
            })
            .finally(() => {
                this.setState({...this.state, loadingMembers: false})
            })
    }
    render() {
        if (this.state.loadingMembers) {
            return (<p className='retrievingMembersText'>Retrieving Members <SyncOutlined spin/></p>)
        }
        return (
            <div className='memberDashboardContainer'>
                <div className="memberTableContainer">
                    <TableHelper ref={this.tableHelper}></TableHelper>
                    <Table
                        size='small'
                        dataSource={this.state.tableDataSource}
                        columns={this.state.tableColumns}
                        bordered
                        pagination={{pageSize: 50}}
                        scroll={{ y: 540 }}></Table>
                </div>
            </div>
        )
    }
}