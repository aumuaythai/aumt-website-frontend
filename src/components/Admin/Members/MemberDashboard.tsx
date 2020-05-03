import React, {Component} from 'react'
import { Switch, Route, Link, withRouter, RouteComponentProps } from 'react-router-dom';
import { Spin, Table, notification, Button, Select, Switch as AntSwitch, Radio } from 'antd'
import { PlusOutlined, CloseCircleOutlined } from '@ant-design/icons'
import './MemberDashboard.css'
import {TableColumn, TableDataLine} from './TableHelper'
import MemberDetails from './MemberDetails'
import { JoinForm } from '../../Content/join/JoinForm'
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
    memberInDropdown: TableDataLine | null
    dbListenerId: string
    currentClubFormOpen: boolean
    clubFormLoading: boolean
    clubSignupSem: '' | 'S1' | 'S2'
    loadingSignupSem: boolean
}

class MemberDashboard extends Component<MemberDashboardProps, MemberDashboardState> {
    private helper: TableHelper| null = null
    private emptyHelper: boolean = true
    private shortTableColumns = ['Name', 'Email', 'Membership', 'UoA', 'Paid']
    private firstListen = true
    constructor(props: MemberDashboardProps) {
        super(props)
        this.state = {
            currentMembers: {},
            loadingMembers: false,
            tableDataSource: [],
            tableColumns: [],
            selectedMember: null,
            memberInDropdown: null,
            dbListenerId: '',
            currentClubFormOpen: false,
            clubFormLoading: true,
            clubSignupSem: '',
            loadingSignupSem: true,
        }
    }
    componentDidMount = () => {
        db.getClubConfig()
            .then((clubConfig) => {
                this.setState({
                    ...this.state,
                    clubFormLoading: false,
                    currentClubFormOpen: clubConfig.clubSignupStatus === 'open',
                    clubSignupSem: clubConfig.clubSignupSem,
                    loadingSignupSem: false
                })
            })
    }
    componentWillUnmount = () => {
        db.unlisten(this.state.dbListenerId)
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
                this.setTableData(memberObj)
                this.setState({
                    ...this.state,
                    dbListenerId: db.listenToMembers(this.onDbChange)
                })
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
    onDbChange = (memberObj: AumtMembersObj) => {
        if (!this.firstListen) {
            this.setTableData(memberObj)
            if (this.state.selectedMember) {
                const changedMember = this.state.tableDataSource.find(line => line.key === this.state.selectedMember?.key)
                if (changedMember) {
                    this.setState({
                        ...this.state,
                        selectedMember: changedMember
                    })
                }
            }
        }
        this.firstListen = false
    }
    onSignupSemChange = (sem: 'S1' | 'S2') => {
        this.setState({
            ...this.state,
            loadingSignupSem: true,
        })
        db.setClubSignupSem(sem)
            .then(() => {
                this.setState({
                    ...this.state,
                    clubSignupSem: sem,
                    loadingSignupSem: false ,
                })
            })
            .catch((err) => {
                this.setState({
                    ...this.state,
                    loadingSignupSem: false,
                })
                notification.error({message: 'Could not set signup Semester: ' + err.toString()})
            })
    }
    onClubFormOpenChange = (open: boolean) => {
        this.setState({
            ...this.state,
            clubFormLoading: true
        })
        db.setClubJoinForm(open)
            .then(() => {
                this.setState({
                    ...this.state,
                    clubFormLoading: false,
                    currentClubFormOpen: open
                })
            })
            .catch((err) => {
                this.setState({
                    ...this.state, clubFormLoading: false
                })
                notification.error({message: `Could not ${open ? 'open' : 'close'} club form: ${err.toString()}`})
            })
    }
    setTableData = (memberObj: AumtMembersObj) => {
        if (this.helper) {
            const {lines, columns} = this.helper.getTableFromMembers(memberObj)
            this.setState({
                ...this.state,
                tableDataSource: lines,
                tableColumns: columns
            })
        }
    }
    onMemberSelect = (member: TableDataLine) => {
        this.setState({
            ...this.state,
            selectedMember: member
        })
        this.props.history.push(`/admin/members/${member.key}`)
    }
    onMemberSelectMobile = (uid: string) => {
        const member = this.state.tableDataSource.find(l => l.key === uid)
        if (member) {
            this.setState({
                ...this.state,
                memberInDropdown: member
            })
        }
    }
    goToSelectedMember = () => {
        if (this.state.memberInDropdown) {
            this.onMemberSelect(this.state.memberInDropdown)
        }
    }
    sortLines = (a: TableDataLine, b: TableDataLine) => {
        return a.tableName < b.tableName ? -1 : 1
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
                    <div className='retrievingMembersText'>Retrieving Members <Spin/></div> :
                    this.helper ? (
                        <div className={`memberDisplaySection ${this.longTable ? '' : 'memberDisplaySectionNarrow'}`}>
                            <div className="memberDashboardHeader">
                                <h2 className='memberDashboardTitle'>AUMT Members</h2>
                                <div className="memberDashboardHeaderButtons">
                                    <div className="memberDashboardGlobalConfigOptionsContainer">
                                        Signup Sem:
                                        <div className="signupSemChangeContainer">
                                            {this.state.loadingSignupSem ? 
                                            <Spin/>
                                            : 
                                            <Radio.Group value={this.state.clubSignupSem} onChange={e => this.onSignupSemChange(e.target.value) }>
                                                <Radio.Button value='S1'>Sem 1</Radio.Button>
                                                <Radio.Button value='S2'>Sem 2</Radio.Button>
                                            </Radio.Group>
                                            }
                                        </div>
                                    </div>
                                    <div className="memberDashboardGlobalConfigOptionsContainer">
                                        Join Form: <AntSwitch
                                            className='memberDashboardClubOpenSwitch'
                                            checked={this.state.currentClubFormOpen}
                                            loading={this.state.clubFormLoading}
                                            onChange={e => this.onClubFormOpenChange(e)}
                                            checkedChildren="open"
                                            unCheckedChildren="closed"></AntSwitch>
                                    </div>
                                    <Link to='/admin/members/add'>
                                        <Button className='memberDashboardHeaderButton' type='primary' shape='round' size='large'>
                                            Add Member <PlusOutlined />
                                        </Button>
                                    </Link>
                                </div>
                                <div className="clearBoth"></div>
                            </div>
                            {window.innerWidth < 1180 ?
                            <div className="memberDashboardSelect">
                            <Select
                                showSearch
                                className='memberDashboardSelectElement'
                                placeholder="Select a member"
                                optionFilterProp="children"
                                onChange={this.onMemberSelectMobile}>
                                {this.state.tableDataSource.sort(this.sortLines).map((line: TableDataLine) => {
                                                return (
                                                <Select.Option
                                                    key={line.key}
                                                    value={line.key}>
                                                        {line.tableName}
                                                    </Select.Option>
                                                )
                                        })}
                                </Select>
                                <Button onClick={this.goToSelectedMember} disabled={!this.state.memberInDropdown}>Go</Button>
                                </div>
                            :
                            <Table
                                size='small'
                                dataSource={this.state.tableDataSource}
                                columns={this.state.tableColumns.filter(c => this.longTable ? c : this.shortTableColumns.indexOf(c.title) > -1)}
                                bordered
                                onRow={this.helper.onRow}
                                onChange={this.helper.onTableChange}
                                footer={this.helper.getFooter}
                                pagination={{defaultPageSize: 50, showSizeChanger: true, pageSizeOptions: ['20', '50','200']}}
                                scroll={{ y: 625 }}></Table>
                            }
                        </div>
                ) : ''}
                <Switch>
                    <Route path='/admin/members/add'>
                        <div className="memberDetailsSection">
                            <h2 className="memberDetailsTitle">Add Member</h2>
                            <div className="memberDetailsCloseIcon"><CloseCircleOutlined onClick={this.exitAddMember} /></div>
                            <div className="clearBoth"></div>
                            <div className="joinFormAdminContainer">
                                <JoinForm clubSignupSem={null} isAdmin={true}></JoinForm>
                            </div>
                        </div>
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
