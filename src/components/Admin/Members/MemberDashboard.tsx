import React, {Component} from 'react'
import { Table, notification, Button } from 'antd'
import { SyncOutlined, PlusOutlined } from '@ant-design/icons'
import './MemberDashboard.css'
import {TableColumn, TableDataLine} from './TableHelper'
import { AumtMembersObj } from '../../../types'
import db from '../../../services/db'
import { TableHelper } from './TableHelper'

interface MemberDashboardProps {}

interface MemberDashboardState {
    currentMembers: AumtMembersObj
    loadingMembers: boolean
    tableDataSource: TableDataLine[]
    tableColumns: TableColumn[]
    selectedMember: TableDataLine | null
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
            tableColumns: [],
            selectedMember: null
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
    onMemberSelect = (member: TableDataLine) => {
        this.setState({
            ...this.state,
            selectedMember: member
        })
    }
    render() {
        return (
            <div className='memberDashboardContainer'>
                <TableHelper onMemberSelect={this.onMemberSelect} ref={this.tableHelperChange}></TableHelper>
                {this.state.loadingMembers ? 
                <p className='retrievingMembersText'>Retrieving Members <SyncOutlined spin/></p> :
                this.helper ? (
                <div className="memberDisplaySection">
                    <div className="memberDashboardHeader">
                        <h2 className='memberDashboardTitle'>AUMT Members</h2>
                        <div className="memberDashboardHeaderButtons">
                            <Button className='memberDashboardHeaderButton' disabled={true}>Remove</Button>
                            <Button className='memberDashboardHeaderButton' type='primary' shape='round' size='large'>
                                Add Member <PlusOutlined />
                            </Button>
                        </div>
                        <div className="clearBoth"></div>
                    </div>
                    <Table
                        size='small'
                        dataSource={this.state.tableDataSource}
                        columns={this.state.tableColumns}
                        bordered
                        onRow={this.helper.onRow}
                        onChange={this.helper.onTableChange}
                        footer={this.helper.getFooter}
                        pagination={{defaultPageSize: 50, showSizeChanger: true, pageSizeOptions: ['20', '50','200']}}
                        scroll={{ y: 440 }}></Table>
                </div>
                ) : ''}
            </div>
        )
    }
}