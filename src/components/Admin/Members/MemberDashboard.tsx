import React, {Component} from 'react'
import { Table, notification } from 'antd'
import { SyncOutlined } from '@ant-design/icons'
import './MemberDashboard.css'
import {TableColumn, TableDataLine} from './TableHelper'
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
    private helper: TableHelper| null = null
    private emptyHelper: boolean = true
    constructor(props: MemberDashboardProps) {
        super(props)
        this.state = {
            currentMembers: {},
            loadingMembers: false,
            tableDataSource: [],
            tableColumns: []
        }
    }
    tableHelperChange = (helper: TableHelper) => {
        if (this.emptyHelper && helper) {
            this.helper = helper
            this.emptyHelper = false
            this.getMembers()
        }
    }
    getMembers = () => {
        this.setState({...this.state, loadingMembers: true})
        db.getAllMembers()
            .then((memberObj) => {
                if (this.helper) {
                const {lines, columns} = this.helper.getTableFromMembers(memberObj)
                    this.setState({
                        ...this.state,
                        tableDataSource: lines,
                        tableColumns: columns
                    })
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
        return (
            <div className='memberDashboardContainer'>
                <TableHelper ref={this.tableHelperChange}></TableHelper>
                {this.state.loadingMembers ? 
                <p className='retrievingMembersText'>Retrieving Members <SyncOutlined spin/></p> : (
                <div className="memberTableContainer">
                    <Table
                        size='small'
                        dataSource={this.state.tableDataSource}
                        columns={this.state.tableColumns}
                        bordered
                        pagination={{pageSize: 50}}
                        scroll={{ y: 540 }}></Table>
                </div>
                )}
            </div>
        )
    }
}