// import {
//   CloseCircleOutlined,
//   PlusOutlined,
//   UploadOutlined,
// } from '@ant-design/icons'
// import {
//   Alert,
//   Switch as AntSwitch,
//   Button,
//   Modal,
//   Radio,
//   Select,
//   Spin,
//   Table,
//   message,
//   notification,
// } from 'antd'
// import React, { Component, Key } from 'react'
// import {
//   Link,
//   Route,
//   RouteComponentProps,
//   Switch,
//   withRouter,
// } from 'react-router'
// import {
//   getAllMembers,
//   getClubConfig,
//   listenToMembers,
//   setClubSignupSem,
//   unlisten,
// } from '../../../services/db'
// import { AumtMember, AumtMembersObj } from '../../../types'
// import { JoinForm } from '../../content/join/JoinForm'
// import './MemberDashboard.css'
// import MemberDetails from './MemberDetails'
// import { TableColumn, TableDataLine, TableHelper } from './TableHelper'

// interface MemberDashboardProps extends RouteComponentProps {}

// interface MemberDashboardState {
//   currentMembers: AumtMembersObj
//   loadingMembers: boolean
//   tableDataSource: TableDataLine[]
//   tableColumns: TableColumn[]
//   selectedMember: TableDataLine | null
//   selectedRowKeys: Key[]
//   memberInDropdown: TableDataLine | null
//   dbListenerId: string
//   currentClubFormOpen: boolean
//   clubFormLoading: boolean
//   clubSignupSem: '' | 'S1' | 'S2' | 'SS'
//   loadingSignupSem: boolean
//   importMembersVisible: boolean
//   importMemberErrors: string[]
//   importMemberSuccessText: string
//   importMemberParsing: boolean
//   membersToImport: Record<string, AumtMember>
//   rowSelectionEnabled: boolean
//   mobileMemberSort: 'name' | 'joined'
// }

// export default class MemberDashboard extends Component<
//   MemberDashboardProps,
//   MemberDashboardState
// > {
//   private helper: TableHelper | null = null
//   private emptyHelper: boolean = true
//   private shortTableColumns = ['Name', 'Email', 'Membership', 'UoA', 'Paid']
//   private firstListen = true
//   private importMemberInput: React.RefObject<HTMLInputElement> | null = null
//   constructor(props: MemberDashboardProps) {
//     super(props)
//     this.importMemberInput = React.createRef()
//     this.state = {
//       currentMembers: {},
//       loadingMembers: false,
//       tableDataSource: [],
//       tableColumns: [],
//       selectedRowKeys: [],
//       selectedMember: null,
//       memberInDropdown: null,
//       dbListenerId: '',
//       currentClubFormOpen: false,
//       clubFormLoading: true,
//       clubSignupSem: '',
//       importMembersVisible: false,
//       loadingSignupSem: true,
//       importMemberErrors: [],
//       importMemberSuccessText: '',
//       importMemberParsing: false,
//       membersToImport: {},
//       rowSelectionEnabled: false,
//       mobileMemberSort: 'name',
//     }
//   }
//   componentDidMount = () => {
//     getClubConfig().then((clubConfig) => {
//       this.setState({
//         clubFormLoading: false,
//         currentClubFormOpen: clubConfig.clubSignupStatus === 'open',
//         clubSignupSem: clubConfig.clubSignupSem,
//         loadingSignupSem: false,
//       })
//     })
//   }
//   componentWillUnmount = () => {
//     unlisten(this.state.dbListenerId)
//   }
//   tableHelperChange = (helper: TableHelper) => {
//     if (this.emptyHelper && helper) {
//       this.helper = helper
//       this.emptyHelper = false
//       this.getMembers()
//     }
//   }
//   getMembers = () => {
//     this.setState({ loadingMembers: true })
//     getAllMembers()
//       .then((memberObj) => {
//         this.setTableData(memberObj)
//         this.setState({
//           dbListenerId: listenToMembers(this.onDbChange),
//         })
//       })
//       .catch((err) => {
//         notification.error({
//           message: 'Could not get members: ' + err.toString(),
//         })
//       })
//       .finally(() => {
//         this.setState({ loadingMembers: false })
//       })
//   }
//   onDbChange = (memberObj: AumtMembersObj) => {
//     if (!this.firstListen) {
//       this.setTableData(memberObj)
//       if (this.state.selectedMember) {
//         const changedMember = this.state.tableDataSource.find(
//           (line) => line.key === this.state.selectedMember?.key
//         )
//         if (changedMember) {
//           this.setState({
//             selectedMember: changedMember,
//           })
//         }
//       }
//     }
//     this.firstListen = false
//   }
//   onSignupSemChange = (sem: 'S1' | 'S2' | 'SS') => {
//     this.setState({
//       loadingSignupSem: true,
//     })
//     setClubSignupSem(sem)
//       .then(() => {
//         this.setState({
//           clubSignupSem: sem,
//           loadingSignupSem: false,
//         })
//       })
//       .catch((err) => {
//         this.setState({
//           loadingSignupSem: false,
//         })
//         notification.error({
//           message: 'Could not set signup Semester: ' + err.toString(),
//         })
//       })
//   }

//   setTableData = (memberObj: AumtMembersObj) => {
//     if (this.helper) {
//       const { lines, columns } = this.helper.getTableFromMembers(memberObj)
//       this.setState({
//         tableDataSource: lines,
//         tableColumns: columns,
//       })
//       const windowPath = window.location.pathname.split('/')
//       if (
//         !this.state.selectedMember &&
//         windowPath.length > 2 &&
//         windowPath[3]
//       ) {
//         const memberId = windowPath[3]
//         if (memberId === 'add') {
//           return
//         }
//         const selectedMember = lines.find((l) => l.key === memberId)
//         if (selectedMember) {
//           this.setState({
//             selectedMember: selectedMember,
//           })
//         } else {
//           this.exitSelectedMember()
//         }
//       }
//     }
//   }
//   showImportMembers = () => {
//     this.setState({
//       importMembersVisible: true,
//       importMemberErrors: [],
//       importMemberSuccessText: '',
//       importMemberParsing: false,
//       membersToImport: {},
//     })
//   }
//   onImportMemberFileChange = (files: FileList | null) => {
//     if (files && files.length > 0) {
//       this.setState({
//         importMemberParsing: true,
//         membersToImport: {},
//       })
//       this.helper
//         ?.parseMemberFile(files[0])
//         .then(
//           (parseObj: {
//             members: Record<string, AumtMember>
//             text: string
//             errors: string[]
//           }) => {
//             const { members, errors, text } = parseObj
//             this.setState({
//               importMemberSuccessText: text,
//               importMemberErrors: errors,
//               importMemberParsing: false,
//               membersToImport: members,
//             })
//           }
//         )
//         .catch((err) => {
//           this.setState({
//             importMemberParsing: false,
//             importMemberErrors: [err.toString()],
//             membersToImport: {},
//           })
//         })
//     }
//   }
//   onImportMembersOk = () => {
//     if (Object.keys(this.state.membersToImport).length === 0) {
//       return this.setState({
//         importMemberErrors: ['No members to import'],
//       })
//     }
//     this.setState({
//       importMembersVisible: false,
//     })
//     const key = 'importMemberMessage'
//     message.loading({ content: 'Adding to Database', key })
//     this.helper
//       ?.importMembers(this.state.membersToImport)
//       .then(() => {
//         message.success({ content: 'Members Added', key, duration: 2 })
//       })
//       .catch((err) => {
//         message.error({ content: err.toString(), key, duration: 3 })
//       })
//   }

//   onImportMembersCancel = () => {
//     this.setState({
//       importMembersVisible: false,
//     })
//   }
//   onMemberSelect = (member: TableDataLine) => {
//     this.setState({
//       selectedMember: member,
//     })
//     this.props.history.push(`/admin/members/${member.key}`)
//   }
//   onMemberSelectMobile = (uid: string) => {
//     const member = this.state.tableDataSource.find((l) => l.key === uid)
//     if (member) {
//       this.setState({
//         memberInDropdown: member,
//       })
//     }
//   }
//   onMobileSortByChange = (sortType: 'name' | 'joined') => {
//     this.setState({
//       mobileMemberSort: sortType,
//     })
//   }
//   goToSelectedMember = () => {
//     if (this.state.memberInDropdown) {
//       this.onMemberSelect(this.state.memberInDropdown)
//     }
//   }
//   sortLines = (a: TableDataLine, b: TableDataLine) => {
//     if (this.state.mobileMemberSort === 'name') {
//       return a.tableName < b.tableName ? -1 : 1
//     } else {
//       return a.timeJoinedMs < b.timeJoinedMs ? 1 : -1
//     }
//   }
//   onRowSelectChange = (
//     selectedRowKeys: Key[],
//     selectedRows: TableDataLine[]
//   ) => {
//     this.setState({
//       selectedRowKeys,
//     })
//     this.helper?.onRowSelectChange(selectedRows)
//   }

//   exitSelectedMember = () => {
//     this.setState({
//       selectedMember: null,
//     })
//     this.props.history.push('/admin/members')
//   }
//   exitAddMember = () => {
//     this.props.history.push('/admin/members')
//   }
//   get longTable() {
//     return window.location.pathname === '/admin/members'
//   }
//   render() {
//     console.log(this.state.selectedMember)

//     return (
//       <div className="memberDashboardContainer">
//         <TableHelper
//           onMemberSelect={this.onMemberSelect}
//           ref={this.tableHelperChange}
//         ></TableHelper>
//         {this.state.loadingMembers ? (
//           <div
//             className={`retrievingMembersText ${
//               this.longTable ? '' : 'narrowRetrievingMembersText'
//             }`}
//           >
//             Retrieving Members <Spin />
//           </div>
//         ) : this.helper ? (
//           <div
//             className={`memberDisplaySection ${
//               this.longTable ? '' : 'memberDisplaySectionNarrow'
//             }`}
//           >
//             <div className="memberDashboardHeader">
//               <h2 className="memberDashboardTitle">AUMT Members</h2>
//               <div className="memberDashboardHeaderButtons">
//                 <div className="memberDashboardGlobalConfigOptionsContainer memberDashboardHideSmallScreen">
//                   Multi Select{' '}
//                   <AntSwitch
//                     checked={this.state.rowSelectionEnabled}
//                     onChange={(e) => this.setState({ rowSelectionEnabled: e })}
//                   ></AntSwitch>
//                 </div>
//                 {this.longTable ? (
//                   <div className="memberDashboardGlobalConfigOptionsContainer memberDashboardHideSmallScreen">
//                     Joining Semester:
//                     <div className="signupSemChangeContainer">
//                       {this.state.loadingSignupSem ? (
//                         <Spin />
//                       ) : (
//                         <Radio.Group
//                           value={this.state.clubSignupSem}
//                           onChange={(e) =>
//                             this.onSignupSemChange(e.target.value)
//                           }
//                         >
//                           <Radio.Button value="S1">Sem 1</Radio.Button>
//                           <Radio.Button value="S2">Sem 2</Radio.Button>
//                           <Radio.Button value="SS">Summer School</Radio.Button>
//                         </Radio.Group>
//                       )}
//                     </div>
//                   </div>
//                 ) : null}
//                 <div className="memberDashboardGlobalConfigOptionsContainer">
//                   <Button
//                     className="memberDashboardHideSmallScreen"
//                     onClick={this.showImportMembers}
//                   >
//                     Import Members <UploadOutlined />
//                   </Button>
//                   <Modal
//                     title="Import Members"
//                     visible={this.state.importMembersVisible}
//                     okText="Begin Import"
//                     onOk={this.onImportMembersOk}
//                     onCancel={this.onImportMembersCancel}
//                   >
//                     <p>
//                       Importing is intended for backups and such. One can only
//                       import a .csv file exactly like the one generated by
//                       clicking Download .csv at the Table footer. Use it as a
//                       template.
//                     </p>
//                     <p>
//                       If the column headers of the csv file do not match exactly
//                       it will be rejected. The key column of each member must
//                       match the UID of their firebase login so make sure every
//                       login exists first.
//                     </p>
//                     <p>
//                       A file with more than 500 members will throw a bunch of
//                       errors so... don't
//                     </p>
//                     <input
//                       onChange={(e) =>
//                         this.onImportMemberFileChange(e.target.files)
//                       }
//                       ref={this.importMemberInput}
//                       type="file"
//                       accept=".csv,.CSV,"
//                     />
//                     {this.state.importMemberParsing ? <Spin /> : null}
//                     {this.state.importMemberSuccessText ? (
//                       <Alert
//                         message={this.state.importMemberSuccessText}
//                       ></Alert>
//                     ) : null}
//                     <div className="importMemberMessagesContainer">
//                       {this.state.importMemberErrors.map((line, idx) => {
//                         return (
//                           <Alert key={idx} type="error" message={line}></Alert>
//                         )
//                       })}
//                     </div>
//                   </Modal>
//                 </div>
//                 <Link to="/admin/members/add">
//                   <Button
//                     className="memberDashboardHeaderButton"
//                     type="primary"
//                     shape="round"
//                     size="large"
//                   >
//                     Add Member <PlusOutlined />
//                   </Button>
//                 </Link>
//               </div>
//               <div className="clearBoth"></div>
//             </div>
//             {window.innerWidth < 1180 ? (
//               <div className="memberDashboardSelect">
//                 <div className="mobileSortBySelectContainer">
//                   Sort by:
//                   <Select
//                     value={this.state.mobileMemberSort}
//                     className="memberDashboardMobileSortBy"
//                     onChange={this.onMobileSortByChange}
//                   >
//                     <Select.Option value="name">Name (A -&gt; Z)</Select.Option>
//                     <Select.Option value="joined">
//                       Joined (New -&gt; Old)
//                     </Select.Option>
//                   </Select>
//                 </div>
//                 <div className="mobileTotalMembersContainer">
//                   Total: {this.state.tableDataSource.length}
//                 </div>
//                 <div className="clearBoth"></div>
//                 <Select
//                   showSearch
//                   className="memberDashboardSelectElement"
//                   placeholder="Select a member"
//                   optionFilterProp="children"
//                   onChange={this.onMemberSelectMobile}
//                 >
//                   {this.state.tableDataSource
//                     .sort(this.sortLines)
//                     .map((line: TableDataLine) => {
//                       return (
//                         <Select.Option key={line.key} value={line.key}>
//                           {line.tableName}
//                         </Select.Option>
//                       )
//                     })}
//                 </Select>
//                 <Button
//                   onClick={this.goToSelectedMember}
//                   disabled={!this.state.memberInDropdown}
//                 >
//                   Go
//                 </Button>
//               </div>
//             ) : (
//               <Table
//                 size="small"
//                 dataSource={this.state.tableDataSource}
//                 columns={this.state.tableColumns.filter((c) =>
//                   this.longTable
//                     ? c
//                     : this.shortTableColumns.indexOf(c.title) > -1
//                 )}
//                 bordered
//                 rowSelection={
//                   this.state.rowSelectionEnabled
//                     ? {
//                         selectedRowKeys: this.state.selectedRowKeys,
//                         onChange: this.onRowSelectChange,
//                       }
//                     : undefined
//                 }
//                 onChange={this.helper.onTableChange}
//                 // footer={this.helper.getFooter}
//                 pagination={{
//                   defaultPageSize: 50,
//                   showSizeChanger: true,
//                   pageSizeOptions: ['20', '50', '100', '200'],
//                   showTotal: (total, range) => {
//                     return (
//                       <div>
//                         {this.helper?.getFooterTextFromLines(total)}
//                         <Button
//                           onClick={this.helper?.downloadCsvData}
//                           type="link"
//                         >
//                           Download .csv
//                         </Button>
//                         <Button
//                           onClick={this.helper?.copyCurrentEmails}
//                           type="link"
//                         >
//                           Copy Emails
//                         </Button>
//                         {this.helper?.getRemoveSelectedLink()}
//                       </div>
//                     )
//                   },
//                 }}
//                 scroll={{ y: 725 }}
//               ></Table>
//             )}
//           </div>
//         ) : null}
//         {this.state.selectedMember ? (
//           <div className="memberDetailsSection">
//             <MemberDetails
//               member={this.state.selectedMember}
//               onExit={this.exitSelectedMember}
//             />
//           </div>
//         ) : null}
//         <Modal
//           open={!!this.state.selectedMember}
//           onCancel={() => this.setState({ selectedMember: null })}
//           footer={null}
//           classNames={{ content: 'max-h-160 overflow-y-auto' }}
//         >
//           <MemberDetails
//             member={this.state.selectedMember}
//             onExit={this.exitSelectedMember}
//           />
//         </Modal>
//         {/* <Switch>
//           <Route path="/admin/members/add">
//             <div className="memberDetailsSection">
//               <h2 className="memberDetailsTitle">Add Member</h2>
//               <div className="memberDetailsCloseIcon">
//                 <CloseCircleOutlined onClick={this.exitAddMember} />
//               </div>
//               <div className="clearBoth"></div>
//               <div className="joinFormAdminContainer">
//                 <JoinForm clubConfig={null} isAdmin={true}></JoinForm>
//               </div>
//             </div>
//           </Route>
//           <Route path="/admin/members/:id">
//             {this.state.selectedMember ? (
//               <div className="memberDetailsSection">
//                 <MemberDetails
//                   member={this.state.selectedMember}
//                   onExit={this.exitSelectedMember}
//                 ></MemberDetails>
//               </div>
//             ) : null}
//           </Route>
//         </Switch> */}
//       </div>
//     )
//   }
// }

// import { PlusOutlined, UploadOutlined } from '@ant-design/icons'
// import {
//   Alert,
//   Switch as AntSwitch,
//   Button,
//   Modal,
//   Radio,
//   Select,
//   Spin,
//   Table,
//   message,
//   notification,
// } from 'antd'
// import React, { Component, Key } from 'react'
// import { Link, RouteComponentProps } from 'react-router'
// import {
//   getAllMembers,
//   getClubConfig,
//   listenToMembers,
//   setClubSignupSem,
//   unlisten,
// } from '../../../services/db'
// import { AumtMember, AumtMembersObj } from '../../../types'
// import './MemberDashboard.css'
// import MemberDetails from './MemberDetails'
// import { TableColumn, TableDataLine, TableHelper } from './TableHelper'

// interface MemberDashboardProps extends RouteComponentProps {}

// interface MemberDashboardState {
//   currentMembers: AumtMembersObj
//   loadingMembers: boolean
//   tableDataSource: TableDataLine[]
//   tableColumns: TableColumn[]
//   selectedMember: TableDataLine | null
//   selectedRowKeys: Key[]
//   memberInDropdown: TableDataLine | null
//   dbListenerId: string
//   currentClubFormOpen: boolean
//   clubFormLoading: boolean
//   clubSignupSem: '' | 'S1' | 'S2' | 'SS'
//   loadingSignupSem: boolean
//   importMembersVisible: boolean
//   importMemberErrors: string[]
//   importMemberSuccessText: string
//   importMemberParsing: boolean
//   membersToImport: Record<string, AumtMember>
//   rowSelectionEnabled: boolean
//   mobileMemberSort: 'name' | 'joined'
// }

// export default class MemberDashboard extends Component<
//   MemberDashboardProps,
//   MemberDashboardState
// > {
//   private helper: TableHelper | null = null
//   private emptyHelper: boolean = true
//   private shortTableColumns = ['Name', 'Email', 'Membership', 'UoA', 'Paid']
//   private firstListen = true
//   private importMemberInput: React.RefObject<HTMLInputElement> | null = null
//   constructor(props: MemberDashboardProps) {
//     super(props)
//     this.importMemberInput = React.createRef()
//     this.state = {
//       currentMembers: {},
//       loadingMembers: false,
//       tableDataSource: [],
//       tableColumns: [],
//       selectedRowKeys: [],
//       selectedMember: null,
//       memberInDropdown: null,
//       dbListenerId: '',
//       currentClubFormOpen: false,
//       clubFormLoading: true,
//       clubSignupSem: '',
//       importMembersVisible: false,
//       loadingSignupSem: true,
//       importMemberErrors: [],
//       importMemberSuccessText: '',
//       importMemberParsing: false,
//       membersToImport: {},
//       rowSelectionEnabled: false,
//       mobileMemberSort: 'name',
//     }
//   }
//   componentDidMount = () => {
//     getClubConfig().then((clubConfig) => {
//       this.setState({
//         clubFormLoading: false,
//         currentClubFormOpen: clubConfig.clubSignupStatus === 'open',
//         clubSignupSem: clubConfig.clubSignupSem,
//         loadingSignupSem: false,
//       })
//     })
//   }
//   componentWillUnmount = () => {
//     unlisten(this.state.dbListenerId)
//   }
//   tableHelperChange = (helper: TableHelper) => {
//     if (this.emptyHelper && helper) {
//       this.helper = helper
//       this.emptyHelper = false
//       this.getMembers()
//     }
//   }
//   getMembers = () => {
//     this.setState({ loadingMembers: true })
//     getAllMembers()
//       .then((memberObj) => {
//         this.setTableData(memberObj)
//         this.setState({
//           dbListenerId: listenToMembers(this.onDbChange),
//         })
//       })
//       .catch((err) => {
//         notification.error({
//           message: 'Could not get members: ' + err.toString(),
//         })
//       })
//       .finally(() => {
//         this.setState({ loadingMembers: false })
//       })
//   }
//   onDbChange = (memberObj: AumtMembersObj) => {
//     if (!this.firstListen) {
//       this.setTableData(memberObj)
//       if (this.state.selectedMember) {
//         const changedMember = this.state.tableDataSource.find(
//           (line) => line.key === this.state.selectedMember?.key
//         )
//         if (changedMember) {
//           this.setState({
//             selectedMember: changedMember,
//           })
//         }
//       }
//     }
//     this.firstListen = false
//   }
//   onSignupSemChange = (sem: 'S1' | 'S2' | 'SS') => {
//     this.setState({
//       loadingSignupSem: true,
//     })
//     setClubSignupSem(sem)
//       .then(() => {
//         this.setState({
//           clubSignupSem: sem,
//           loadingSignupSem: false,
//         })
//       })
//       .catch((err) => {
//         this.setState({
//           loadingSignupSem: false,
//         })
//         notification.error({
//           message: 'Could not set signup Semester: ' + err.toString(),
//         })
//       })
//   }

//   setTableData = (memberObj: AumtMembersObj) => {
//     if (this.helper) {
//       const { lines, columns } = this.helper.getTableFromMembers(memberObj)
//       this.setState({
//         tableDataSource: lines,
//         tableColumns: columns,
//       })
//       const windowPath = window.location.pathname.split('/')
//       if (
//         !this.state.selectedMember &&
//         windowPath.length > 2 &&
//         windowPath[3]
//       ) {
//         const memberId = windowPath[3]
//         if (memberId === 'add') {
//           return
//         }
//         const selectedMember = lines.find((l) => l.key === memberId)
//         if (selectedMember) {
//           this.setState({
//             selectedMember: selectedMember,
//           })
//         } else {
//           this.exitSelectedMember()
//         }
//       }
//     }
//   }
//   showImportMembers = () => {
//     this.setState({
//       importMembersVisible: true,
//       importMemberErrors: [],
//       importMemberSuccessText: '',
//       importMemberParsing: false,
//       membersToImport: {},
//     })
//   }
//   onImportMemberFileChange = (files: FileList | null) => {
//     if (files && files.length > 0) {
//       this.setState({
//         importMemberParsing: true,
//         membersToImport: {},
//       })
//       this.helper
//         ?.parseMemberFile(files[0])
//         .then(
//           (parseObj: {
//             members: Record<string, AumtMember>
//             text: string
//             errors: string[]
//           }) => {
//             const { members, errors, text } = parseObj
//             this.setState({
//               importMemberSuccessText: text,
//               importMemberErrors: errors,
//               importMemberParsing: false,
//               membersToImport: members,
//             })
//           }
//         )
//         .catch((err) => {
//           this.setState({
//             importMemberParsing: false,
//             importMemberErrors: [err.toString()],
//             membersToImport: {},
//           })
//         })
//     }
//   }
//   onImportMembersOk = () => {
//     if (Object.keys(this.state.membersToImport).length === 0) {
//       return this.setState({
//         importMemberErrors: ['No members to import'],
//       })
//     }
//     this.setState({
//       importMembersVisible: false,
//     })
//     const key = 'importMemberMessage'
//     message.loading({ content: 'Adding to Database', key })
//     this.helper
//       ?.importMembers(this.state.membersToImport)
//       .then(() => {
//         message.success({ content: 'Members Added', key, duration: 2 })
//       })
//       .catch((err) => {
//         message.error({ content: err.toString(), key, duration: 3 })
//       })
//   }

//   onImportMembersCancel = () => {
//     this.setState({
//       importMembersVisible: false,
//     })
//   }
//   onMemberSelect = (member: TableDataLine) => {
//     this.setState({
//       selectedMember: member,
//     })
//     this.props.history.push(`/admin/members/${member.key}`)
//   }
//   onMemberSelectMobile = (uid: string) => {
//     const member = this.state.tableDataSource.find((l) => l.key === uid)
//     if (member) {
//       this.setState({
//         memberInDropdown: member,
//       })
//     }
//   }
//   onMobileSortByChange = (sortType: 'name' | 'joined') => {
//     this.setState({
//       mobileMemberSort: sortType,
//     })
//   }
//   goToSelectedMember = () => {
//     if (this.state.memberInDropdown) {
//       this.onMemberSelect(this.state.memberInDropdown)
//     }
//   }
//   sortLines = (a: TableDataLine, b: TableDataLine) => {
//     if (this.state.mobileMemberSort === 'name') {
//       return a.tableName < b.tableName ? -1 : 1
//     } else {
//       return a.timeJoinedMs < b.timeJoinedMs ? 1 : -1
//     }
//   }
//   onRowSelectChange = (
//     selectedRowKeys: Key[],
//     selectedRows: TableDataLine[]
//   ) => {
//     this.setState({
//       selectedRowKeys,
//     })
//     this.helper?.onRowSelectChange(selectedRows)
//   }

//   render() {

//     if (this.state.loadingMembers) {
//       return (
//         <div>
//           Retrieving Members <Spin />
//         </div>
//       )
//     }

//     if (!this.helper) {
//       return (
//         <TableHelper
//           onMemberSelect={this.onMemberSelect}
//           ref={this.tableHelperChange}
//         />
//       )
//     }

//     return (
//       <div>
//         <div className="flex justify-between py-2">
//           <div className="items-center gap-x-6 flex">
//             <div className="flex items-center gap-x-2">
//               <span className="text-sm">Multi-select</span>
//               <AntSwitch
//                 checked={this.state.rowSelectionEnabled}
//                 onChange={(e) => this.setState({ rowSelectionEnabled: e })}
//               />
//             </div>
//             <div className="flex items-center gap-x-2">
//               <span className="text-sm">Joining Semester:</span>
//               <Radio.Group
//                 value={this.state.clubSignupSem}
//                 onChange={(e) => this.onSignupSemChange(e.target.value)}
//                 disabled={this.state.loadingSignupSem}
//               >
//                 <Radio.Button value="S1">Sem 1</Radio.Button>
//                 <Radio.Button value="S2">Sem 2</Radio.Button>
//                 <Radio.Button value="SS">Summer School</Radio.Button>
//               </Radio.Group>
//             </div>
//           </div>

//           <div className="items-center gap-x-2 flex">
//             <div>
//               <Button
//                 onClick={this.showImportMembers}
//                 icon={<UploadOutlined />}
//               >
//                 Import Members
//               </Button>
//               <Modal
//                 title="Import Members"
//                 okText="Begin Import"
//                 open={this.state.importMembersVisible}
//                 onOk={this.onImportMembersOk}
//                 onCancel={this.onImportMembersCancel}
//               >
//                 <p>
//                   Importing is intended for backups and such. One can only
//                   import a .csv file exactly like the one generated by clicking
//                   Download .csv at the Table footer. Use it as a template.
//                 </p>
//                 <p>
//                   If the column headers of the csv file do not match exactly it
//                   will be rejected. The key column of each member must match the
//                   UID of their firebase login so make sure every login exists
//                   first.
//                 </p>
//                 <p>
//                   A file with more than 500 members will throw a bunch of errors
//                   so... don't
//                 </p>
//                 <input
//                   onChange={(e) =>
//                     this.onImportMemberFileChange(e.target.files)
//                   }
//                   ref={this.importMemberInput}
//                   type="file"
//                   accept=".csv,.CSV,"
//                 />
//                 {this.state.importMemberParsing ? <Spin /> : null}
//                 {this.state.importMemberSuccessText ? (
//                   <Alert message={this.state.importMemberSuccessText}></Alert>
//                 ) : null}
//                 <div className="importMemberMessagesContainer">
//                   {this.state.importMemberErrors.map((line, idx) => (
//                     <Alert key={idx} type="error" message={line} />
//                   ))}
//                 </div>
//               </Modal>
//             </div>
//             <Link to="/admin/members/add">
//               <Button type="primary" icon={<PlusOutlined />}>
//                 Add Member
//               </Button>
//             </Link>
//           </div>
//         </div>

//         {window.innerWidth < 1180 ? (
//           <div className="memberDashboardSelect">
//             <div className="mobileSortBySelectContainer">
//               Sort by:
//               <Select
//                 value={this.state.mobileMemberSort}
//                 className="memberDashboardMobileSortBy"
//                 onChange={this.onMobileSortByChange}
//               >
//                 <Select.Option value="name">Name (A -&gt; Z)</Select.Option>
//                 <Select.Option value="joined">
//                   Joined (New -&gt; Old)
//                 </Select.Option>
//               </Select>
//             </div>
//             <div className="mobileTotalMembersContainer">
//               Total: {this.state.tableDataSource.length}
//             </div>
//             <div className="clearBoth"></div>
//             <Select
//               showSearch
//               className="memberDashboardSelectElement"
//               placeholder="Select a member"
//               optionFilterProp="children"
//               onChange={this.onMemberSelectMobile}
//             >
//               {this.state.tableDataSource
//                 .sort(this.sortLines)
//                 .map((line: TableDataLine) => {
//                   return (
//                     <Select.Option key={line.key} value={line.key}>
//                       {line.tableName}
//                     </Select.Option>
//                   )
//                 })}
//             </Select>
//             <Button
//               onClick={this.goToSelectedMember}
//               disabled={!this.state.memberInDropdown}
//             >
//               Go
//             </Button>
//           </div>
//         ) : (
//           <Table
//             // size="small"
//             dataSource={this.state.tableDataSource}
//             columns={this.state.tableColumns.filter((c) =>
//               this.longTable ? c : this.shortTableColumns.indexOf(c.title) > -1
//             )}
//             bordered
//             rowSelection={
//               this.state.rowSelectionEnabled
//                 ? {
//                     selectedRowKeys: this.state.selectedRowKeys,
//                     onChange: this.onRowSelectChange,
//                   }
//                 : undefined
//             }
//             onChange={this.helper.onTableChange}
//             // footer={this.helper.getFooter}
//             pagination={{
//               defaultPageSize: 50,
//               showSizeChanger: true,
//               pageSizeOptions: ['20', '50', '100', '200'],
//               showTotal: (total, range) => {
//                 return (
//                   <div>
//                     {this.helper?.getFooterTextFromLines(total)}
//                     <Button onClick={this.helper?.downloadCsvData} type="link">
//                       Download .csv
//                     </Button>
//                     <Button
//                       onClick={this.helper?.copyCurrentEmails}
//                       type="link"
//                     >
//                       Copy Emails
//                     </Button>
//                     {this.helper?.getRemoveSelectedLink()}
//                   </div>
//                 )
//               },
//             }}
//             scroll={{ y: 725 }}
//             className="w-full"
//           />
//         )}
//         <Modal
//           open={!!this.state.selectedMember}
//           onCancel={() => this.setState({ selectedMember: null })}
//           footer={null}
//           classNames={{ content: 'max-h-160 overflow-y-auto' }}
//         >
//           <MemberDetails
//             member={this.state.selectedMember}
//             onExit={this.exitSelectedMember}
//           />
//         </Modal>
//         {/* <Switch>
//           <Route path="/admin/members/add">
//             <div className="memberDetailsSection">
//               <h2 className="memberDetailsTitle">Add Member</h2>
//               <div className="memberDetailsCloseIcon">
//                 <CloseCircleOutlined onClick={this.exitAddMember} />
//               </div>
//               <div className="clearBoth"></div>
//               <div className="joinFormAdminContainer">
//                 <JoinForm clubConfig={null} isAdmin={true}></JoinForm>
//               </div>
//             </div>
//           </Route>
//           <Route path="/admin/members/:id">
//             {this.state.selectedMember ? (
//               <div className="memberDetailsSection">
//                 <MemberDetails
//                   member={this.state.selectedMember}
//                   onExit={this.exitSelectedMember}
//                 ></MemberDetails>
//               </div>
//             ) : null}
//           </Route>
//         </Switch> */}
//       </div>
//     )
//   }
// }

import { PlusOutlined, UploadOutlined } from '@ant-design/icons'
import { useQuery } from '@tanstack/react-query'
import {
  Alert,
  Switch as AntSwitch,
  Button,
  Input,
  Modal,
  Radio,
  Select,
  Spin,
  Table,
  Upload,
  message,
  notification,
} from 'antd'
import React, { Component, Key, useId, useState } from 'react'
import { Link, RouteComponentProps } from 'react-router'
import { useConfig } from '../../../context/ClubConfigProvider'
import {
  getAllMembers,
  getClubConfig,
  listenToMembers,
  setClubSignupSem,
  unlisten,
} from '../../../services/db'
import { AumtMember, AumtMembersObj } from '../../../types'
import './MemberDashboard.css'
import MemberDetails from './MemberDetails'
import { TableColumn, TableDataLine, TableHelper } from './TableHelper'

interface MemberDashboardProps extends RouteComponentProps {}

interface MemberDashboardState {
  currentMembers: AumtMembersObj
  loadingMembers: boolean
  tableDataSource: TableDataLine[]
  tableColumns: TableColumn[]
  selectedMember: TableDataLine | null
  selectedRowKeys: Key[]
  memberInDropdown: TableDataLine | null
  dbListenerId: string
  currentClubFormOpen: boolean
  clubFormLoading: boolean
  clubSignupSem: '' | 'S1' | 'S2' | 'SS'
  loadingSignupSem: boolean
  importMembersVisible: boolean
  importMemberErrors: string[]
  importMemberSuccessText: string
  importMemberParsing: boolean
  membersToImport: Record<string, AumtMember>
  rowSelectionEnabled: boolean
  mobileMemberSort: 'name' | 'joined'
}

export default function MemberDashboard() {
  const [selectedMember, setSelectedMember] = useState<TableDataLine | null>(
    null
  )
  const [isMultiSelect, setIsMultiSelect] = useState(false)
  const [selectedRows, setSelectedRows] = useState<Key[]>([])
  const [search, setSearch] = useState('')

  const { data: members, isPending: isLoadingMembers } = useQuery({
    queryKey: ['members'],
    queryFn: getAllMembers,
  })

  if (isLoadingMembers) {
    return (
      <div>
        Retrieving Members <Spin />
      </div>
    )
  }

  // if (!this.helper) {
  //   return (
  //     <TableHelper
  //       onMemberSelect={this.onMemberSelect}
  //       ref={this.tableHelperChange}
  //     />
  //   )
  // }

  const dataSource: TableDataLine[] = []
  if (members) {
    Object.entries(members).forEach(([uid, member]) => {
      if (
        search &&
        !member.firstName.includes(search) &&
        !member.email.includes(search)
      ) {
        return
      }

      dataSource.push({
        key: uid,
        ...member,
        tableName: `${member.firstName} ${member.preferredName ?? ''} ${
          member.lastName
        }`,
      })
    })
  }

  const columns: TableColumn[] = [
    {
      title: 'Name',
      dataIndex: 'tableName',
      defaultSortOrder: 'ascend',
      filterSearch: true,
      sorter: (a: TableDataLine, b: TableDataLine) =>
        a.tableName.localeCompare(b.tableName),
    },
    {
      title: 'Email',
      dataIndex: 'email',
    },
    {
      title: 'Ethnicity',
      dataIndex: 'ethnicity',
    },
    {
      title: 'Gender',
      dataIndex: 'gender',
    },
    {
      title: 'Membership',
      dataIndex: 'membership',
    },
    {
      title: 'Paid',
      dataIndex: 'paid',
      sorter: (a: TableDataLine, b: TableDataLine) =>
        a.paid.localeCompare(b.paid),
    },
  ]

  return (
    <div className="flex-1 px-3 h-full">
      <div className="flex justify-between py-2">
        <div className="flex items-center gap-x-4">
          <Input
            placeholder="Search names or emails"
            className="!w-80"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <div className="flex items-center gap-x-2">
            <span className="text-sm">Multi-select</span>
            <AntSwitch checked={isMultiSelect} onChange={setIsMultiSelect} />
          </div>
        </div>

        <Link to="/admin/members/add">
          <Button type="primary" icon={<PlusOutlined />}>
            Add Member
          </Button>
        </Link>
      </div>

      {/* {window.innerWidth < 1180 ? (
          <div className="memberDashboardSelect">
            <div className="mobileSortBySelectContainer">
              Sort by:
              <Select
                value={this.state.mobileMemberSort}
                className="memberDashboardMobileSortBy"
                onChange={this.onMobileSortByChange}
              >
                <Select.Option value="name">Name (A -&gt; Z)</Select.Option>
                <Select.Option value="joined">
                  Joined (New -&gt; Old)
                </Select.Option>
              </Select>
            </div>
            <div className="mobileTotalMembersContainer">
              Total: {this.state.tableDataSource.length}
            </div>
            <div className="clearBoth"></div>
            <Select
              showSearch
              className="memberDashboardSelectElement"
              placeholder="Select a member"
              optionFilterProp="children"
              onChange={this.onMemberSelectMobile}
            >
              {this.state.tableDataSource
                .sort(this.sortLines)
                .map((line: TableDataLine) => {
                  return (
                    <Select.Option key={line.key} value={line.key}>
                      {line.tableName}
                    </Select.Option>
                  )
                })}
            </Select>
            <Button
              onClick={this.goToSelectedMember}
              disabled={!this.state.memberInDropdown}
            >
              Go
            </Button>
          </div>
        ) : ( */}
      <Table
        dataSource={dataSource}
        columns={columns}
        bordered
        size="middle"
        tableLayout="fixed"
        rowSelection={
          isMultiSelect
            ? {
                selectedRowKeys: selectedRows,
                onChange: (keys) => setSelectedRows(keys),
              }
            : undefined
        }
        pagination={{ pageSize: 20 }}
        rowClassName="cursor-pointer"
        onRow={(record) => ({
          onClick: () => setSelectedMember(record),
        })}
      />
      {/* )} */}
      <Modal
        open={!!selectedMember}
        footer={null}
        classNames={{ content: 'max-h-160 overflow-y-auto' }}
        onCancel={() => setSelectedMember(null)}
      >
        {selectedMember && (
          <MemberDetails
            member={selectedMember}
            onExit={() => setSelectedMember(null)}
          />
        )}
      </Modal>
      {/* <Switch>
          <Route path="/admin/members/add">
            <div className="memberDetailsSection">
              <h2 className="memberDetailsTitle">Add Member</h2>
              <div className="memberDetailsCloseIcon">
                <CloseCircleOutlined onClick={this.exitAddMember} />
              </div>
              <div className="clearBoth"></div>
              <div className="joinFormAdminContainer">
                <JoinForm clubConfig={null} isAdmin={true}></JoinForm>
              </div>
            </div>
          </Route>
          <Route path="/admin/members/:id">
            {this.state.selectedMember ? (
              <div className="memberDetailsSection">
                <MemberDetails
                  member={this.state.selectedMember}
                  onExit={this.exitSelectedMember}
                ></MemberDetails>
              </div>
            ) : null}
          </Route>
        </Switch> */}
    </div>
  )
}
