import React, {Component,ReactText} from 'react'
import { Switch, Route, Link, withRouter, RouteComponentProps } from 'react-router-dom';
import { Modal, Spin, Table, notification, Button, Select, Switch as AntSwitch, Radio, Alert, message } from 'antd'
import { PlusOutlined, UploadOutlined, CloseCircleOutlined } from '@ant-design/icons'
import './MemberDashboard.css'
import {TableColumn, TableDataLine} from './TableHelper'
import MemberDetails from './MemberDetails'
import { JoinForm } from '../../Content/join/JoinForm'
import { AumtMembersObj, AumtMember } from '../../../types'
import db from '../../../services/db'
import { TableHelper } from './TableHelper'

interface MemberDashboardProps extends RouteComponentProps {}

interface MemberDashboardState {
    currentMembers: AumtMembersObj
    loadingMembers: boolean
    tableDataSource: TableDataLine[]
    tableColumns: TableColumn[]
    selectedMember: TableDataLine | null
    selectedRowKeys: ReactText[]
    memberInDropdown: TableDataLine | null
    dbListenerId: string
    currentClubFormOpen: boolean
    clubFormLoading: boolean
    clubSignupSem: '' | 'S1' | 'S2'
    loadingSignupSem: boolean
    importMembersVisible: boolean
    importMemberErrors: string[]
    importMemberSuccessText: string
    importMemberParsing: boolean
    membersToImport: Record<string, AumtMember>
    rowSelectionEnabled: boolean
    mobileMemberSort: 'name' | 'joined'
}

class MemberDashboard extends Component<MemberDashboardProps, MemberDashboardState> {
    private helper: TableHelper| null = null
    private emptyHelper: boolean = true
    private shortTableColumns = ['Name', 'Email', 'Membership', 'UoA', 'Paid']
    private firstListen = true
    private importMemberInput: React.RefObject<HTMLInputElement> | null = null
    constructor(props: MemberDashboardProps) {
        super(props)
        this.importMemberInput = React.createRef();
        this.state = {
            currentMembers: {},
            loadingMembers: false,
            tableDataSource: [],
            tableColumns: [],
            selectedRowKeys: [],
            selectedMember: null,
            memberInDropdown: null,
            dbListenerId: '',
            currentClubFormOpen: false,
            clubFormLoading: true,
            clubSignupSem: '',
            importMembersVisible: false,
            loadingSignupSem: true,
            importMemberErrors: [],
            importMemberSuccessText: '',
            importMemberParsing: false,
            membersToImport: {},
            rowSelectionEnabled: false,
            mobileMemberSort: 'name'
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
            const windowPath = window.location.pathname.split('/')
            if (!this.state.selectedMember && windowPath.length > 2 && windowPath[3]) {
                const memberId = windowPath[3]
                if (memberId === 'add') {
                    return
                }
                const selectedMember = lines.find(l => l.key === memberId)
                if (selectedMember) {
                    this.setState({
                        ...this.state,
                        selectedMember: selectedMember
                    })
                } else {
                    this.exitSelectedMember()
                }
            }
        }
    }
    showImportMembers = () => {
        this.setState({
            ...this.state,
            importMembersVisible: true,
            importMemberErrors: [],
            importMemberSuccessText: '',
            importMemberParsing: false,
            membersToImport: {}
        })
    }
    onImportMemberFileChange = (files: FileList | null) => {
        if (files && files.length > 0) {
            this.setState({
                ...this.state,
                importMemberParsing: true,
                membersToImport: {}
            })
            this.helper?.parseMemberFile(files[0])
                .then((parseObj: {members: Record<string, AumtMember>, text: string, errors: string[]}) => {
                    const {members, errors, text} = parseObj
                    this.setState({
                        ...this.state,
                        importMemberSuccessText: text,
                        importMemberErrors: errors,
                        importMemberParsing: false,
                        membersToImport: members
                    })
                })
                .catch((err) => {
                    this.setState({
                        ...this.state,
                        importMemberParsing: false,
                        importMemberErrors: [err.toString()],
                        membersToImport: {}
                    })
                })
        }
    }
    onImportMembersOk = () => {
        if (Object.keys(this.state.membersToImport).length === 0) {
            return this.setState({
                ...this.state,
                importMemberErrors: ['No members to import']
            })
        }
        this.setState({
            ...this.state,
            importMembersVisible: false
        })
        const key = 'importMemberMessage'
        message.loading({content: 'Adding to Database', key})
        this.helper?.importMembers(this.state.membersToImport)
            .then(() => {
                message.success({content: 'Members Added', key, duration: 2})
            })
            .catch((err) => {
                message.error({content: err.toString(), key, duration: 3})
            })
    }
    
    onImportMembersCancel = () => {
        this.setState({
            ...this.state,
            importMembersVisible: false
        })
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
    onMobileSortByChange = (sortType: 'name' | 'joined') => {
        this.setState({
            ...this.state,
            mobileMemberSort: sortType
        })
    }
    goToSelectedMember = () => {
        if (this.state.memberInDropdown) {
            this.onMemberSelect(this.state.memberInDropdown)
        }
    }
    sortLines = (a: TableDataLine, b: TableDataLine) => {
        if (this.state.mobileMemberSort === 'name') {
            return a.tableName < b.tableName ? -1 : 1
        } else {
            return a.timeJoinedMs < b.timeJoinedMs ? 1 : -1
        }
    }
    onRowSelectChange = (selectedRowKeys: ReactText[], selectedRows: TableDataLine[]) => {
        this.setState({
            ...this.state,
            selectedRowKeys
        })
        this.helper?.onRowSelectChange(selectedRows)
    };

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
                    <div className={`retrievingMembersText ${this.longTable ? '' : 'narrowRetrievingMembersText'}`}>Retrieving Members <Spin/></div> :
                    this.helper ? (
                        <div className={`memberDisplaySection ${this.longTable ? '' : 'memberDisplaySectionNarrow'}`}>
                            <div className="memberDashboardHeader">
                                <h2 className='memberDashboardTitle'>AUMT Members</h2>
                                <div className="memberDashboardHeaderButtons">
                                    <div className="memberDashboardGlobalConfigOptionsContainer memberDashboardHideSmallScreen">
                                        Multi Select <AntSwitch
                                        checked={this.state.rowSelectionEnabled}
                                        onChange={e => this.setState({...this.state, rowSelectionEnabled: e})}
                                        ></AntSwitch>
                                    </div>
                                    {this.longTable ?
                                    <div className="memberDashboardGlobalConfigOptionsContainer memberDashboardHideSmallScreen">
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
                                    :''}
                                    {this.longTable ?
                                    <div className="memberDashboardGlobalConfigOptionsContainer memberDashboardHideSmallScreen">
                                        Join Form: <AntSwitch
                                            className='memberDashboardClubOpenSwitch'
                                            checked={this.state.currentClubFormOpen}
                                            loading={this.state.clubFormLoading}
                                            onChange={e => this.onClubFormOpenChange(e)}
                                            checkedChildren="open"
                                            unCheckedChildren="closed"></AntSwitch>
                                    </div>
                                    :''}
                                    <div className="memberDashboardGlobalConfigOptionsContainer">
                                        <Button className='memberDashboardHideSmallScreen' onClick={this.showImportMembers}>Import Members <UploadOutlined /></Button>
                                        <Modal
                                            title='Import Members'
                                            visible={this.state.importMembersVisible}
                                            okText='Begin Import'
                                            onOk={this.onImportMembersOk}
                                            onCancel={this.onImportMembersCancel}>
                                            <p>Importing is intended for backups and such. One can only import a .csv file exactly like the one generated by clicking Download .csv at the Table footer. Use it as a template.</p>
                                            <p>If the column headers of the csv file do not match exactly it will be rejected. The key column of each member must match the UID of their firebase login so make sure every login exists first.</p>
                                            <p>A file with more than 500 members will throw a bunch of errors so... don't</p>
                                            <input onChange={e => this.onImportMemberFileChange(e.target.files)} ref={this.importMemberInput} type='file' accept='.csv,.CSV,'/>
                                            {this.state.importMemberParsing ? <Spin/> : ''}
                                            {this.state.importMemberSuccessText ?
                                                <Alert message={this.state.importMemberSuccessText}></Alert>
                                                : ''}
                                            <div className="importMemberMessagesContainer">
                                                {this.state.importMemberErrors.map((line, idx) => {
                                                    return <Alert key={idx} type='error' message={line}></Alert>
                                                })}
                                            </div>
                                        </Modal>
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
                                <div className="mobileSortBySelectContainer">
                                Sort by: 
                                    <Select value={this.state.mobileMemberSort} className='memberDashboardMobileSortBy' onChange={this.onMobileSortByChange}>
                                        <Select.Option value='name'>Name (A -&gt; Z)</Select.Option>
                                        <Select.Option value='joined'>Joined (New -&gt; Old)</Select.Option>
                                    </Select>
                                </div>
                                <div className="mobileTotalMembersContainer">
                                    Total: {this.state.tableDataSource.length}
                                </div>
                                <div className="clearBoth"></div>
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
                                rowSelection={this.state.rowSelectionEnabled ?
                                    {selectedRowKeys: this.state.selectedRowKeys, onChange: this.onRowSelectChange} :
                                    undefined}
                                onChange={this.helper.onTableChange}
                                // footer={this.helper.getFooter}
                                pagination={{
                                    defaultPageSize: 50,
                                    showSizeChanger: true,
                                    pageSizeOptions: ['20', '50', '100', '200'],
                                    showTotal: (total, range) => {
                                        return <div>
                                            {this.helper?.getFooterTextFromLines(total)}
                                            <Button onClick={this.helper?.downloadCsvData} type='link'>Download .csv</Button>
                                            <Button onClick={this.helper?.copyCurrentEmails} type='link'>Copy Emails</Button>
                                            {this.helper?.getRemoveSelectedLink()}
                                        </div>
                                    }
                                }}
                                scroll={{ y: 725 }}></Table>
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
                        : ''}
                    </Route>
                </Switch>
            </div>
        )
    }
}

export default withRouter(MemberDashboard)
