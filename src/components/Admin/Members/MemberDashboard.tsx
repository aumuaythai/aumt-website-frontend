import React, {Component} from 'react'
import { Switch, Route, Link, withRouter, RouteComponentProps } from 'react-router-dom';
import { Table, notification, Button } from 'antd'
import { SyncOutlined, PlusOutlined, CloseCircleOutlined } from '@ant-design/icons'
import './MemberDashboard.css'
import {TableColumn, TableDataLine} from './TableHelper'
import { MemberDetails } from './MemberDetails'
import { AumtMembersObj } from '../../../types'
import db from '../../../services/db'
import { TableHelper } from './TableHelper'

interface MemberDashboardProps extends RouteComponentProps {}

interface MemberDashboardState {
    currentMembers: AumtMembersObj
    loadingMembers: boolean
    tableDataSource: TableDataLine[]
    tableColumns: TableColumn[]
    selectedMember: TableDataLine | null
}

class MemberDashboard extends Component<MemberDashboardProps, MemberDashboardState> {
    private helper: TableHelper| null = null
    private emptyHelper: boolean = true
    private shortTableColumns = ['Name', 'Email', 'Membership', 'UoA', 'Paid']
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
        this.props.history.push(`/admin/members/${member.key}`)
    }
    exitSelectedMember = () => {
        this.setState({
            ...this.state,
            selectedMember: null
        })
        this.props.history.push('/admin/members')
    }
    exitAddMember = () => {
        this.props.history.push('/admin/members')
    }
    get longTable() {
        return window.location.pathname === '/admin/members'
    }
    render() {
        return (
            <div className='memberDashboardContainer'>
                <TableHelper onMemberSelect={this.onMemberSelect} ref={this.tableHelperChange}></TableHelper>
                {this.state.loadingMembers ? 
                <p className='retrievingMembersText'>Retrieving Members <SyncOutlined spin/></p> :
                this.helper ? (
                    <div className={`memberDisplaySection ${this.longTable ? '' : 'memberDisplaySectionNarrow'}`}>
                        <div className="memberDashboardHeader">
                            <h2 className='memberDashboardTitle'>AUMT Members</h2>
                            <div className="memberDashboardHeaderButtons">
                                <Button className='memberDashboardHeaderButton' disabled={true}>Remove</Button>
                                <Link to='/admin/members/add'>
                                    <Button className='memberDashboardHeaderButton' type='primary' shape='round' size='large'>
                                        Add Member <PlusOutlined />
                                    </Button>
                                </Link>
                            </div>
                            <div className="clearBoth"></div>
                        </div>
                        <Table
                            size='small'
                            dataSource={this.state.tableDataSource}
                            columns={this.state.tableColumns.filter(c => this.longTable ? c : this.shortTableColumns.indexOf(c.title) > -1)}
                            bordered
                            onRow={this.helper.onRow}
                            onChange={this.helper.onTableChange}
                            footer={this.helper.getFooter}
                            pagination={{defaultPageSize: 50, showSizeChanger: true, pageSizeOptions: ['20', '50','200']}}
                            scroll={{ y: 640 }}></Table>
                    </div>
                ) : ''}
                <Switch>
                    <Route path='/admin/members/add'>
                        <div className="memberDetailsSection">
                            <h2 className="memberDetailsTitle">Add Member</h2>
                            <div className="memberDetailsCloseIcon"><CloseCircleOutlined onClick={this.exitAddMember} /></div>
                            <div className="clearBoth"></div>
                        </div>
                    </Route>
                    <Route path='/admin/members/editmember/:memberid'>
                            Edit Edit Edit
                    </Route>
                    <Route path='/admin/members/:id'>
                        {this.state.selectedMember ? 
                        <div className="memberDetailsSection">
                            <h2 className="memberDetailsTitle">{this.state.selectedMember.tableName}</h2>
                            <div className="memberDetailsCloseIcon"><CloseCircleOutlined onClick={this.exitSelectedMember} /></div>
                            <div className="clearBoth"></div>
                            <MemberDetails member={this.state.selectedMember}></MemberDetails>
                        </div>
                        : 'no selected member :((('}
                    </Route>
                </Switch>
            </div>
        )
    }
}

export default withRouter(MemberDashboard)