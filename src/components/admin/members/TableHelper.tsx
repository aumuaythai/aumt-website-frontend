import { CopyOutlined, FormOutlined, SearchOutlined } from '@ant-design/icons'
import {
  Button,
  Input,
  InputRef,
  notification,
  Popconfirm,
  Tooltip,
} from 'antd'
import { TableCurrentDataSource } from 'antd/lib/table/interface'
import moment from 'moment'
import PapaParse from 'papaparse'
import React, { Component, createRef, RefObject } from 'react'
import {
  default as DataFormatterUtil,
  default as dataUtil,
} from '../../../services/data.util'
import {
  addMultipleMembers,
  removeMultipleMembers,
  updateMembership,
  updatePaid,
} from '../../../services/db'
import Validator from '../../../services/validator'
import { AumtMember, AumtMembersObj } from '../../../types'
import './TableHelper.css'

export type TableDataLine = AumtMember & { key: string; tableName: string }
export type TableColumn = any

interface TableHelperProps {
  onMemberSelect: (member: TableDataLine) => void
}

interface TableHelperState {
  searchedColumn: string
  searchText: string
  currentData: TableDataLine[]
  currentSelectedRows: TableDataLine[]
  currentFilters: Record<string, (string | number | boolean)[] | null>
  totalMembers: number
  deletingSelectedMembers: boolean
  currentTableLines: number
  invertSearchMap: Record<string, boolean>
}

export class TableHelper extends Component<TableHelperProps, TableHelperState> {
  private searchInputRef: RefObject<InputRef>

  constructor(props: TableHelperProps) {
    super(props)
    this.searchInputRef = createRef()
    this.state = {
      searchText: '',
      searchedColumn: '',
      currentData: [],
      currentSelectedRows: [],
      currentFilters: {},
      invertSearchMap: {},
      totalMembers: 0,
      deletingSelectedMembers: false,
      currentTableLines: 0,
    }
  }

  copyText = (text: string) => {
    DataFormatterUtil.copyText(text)
  }

  private handleSearch = (
    selectedKeys: string[],
    confirm: Function,
    dataIndex: string
  ) => {
    confirm()
    this.setState(
      {
        ...this.state,
        searchText: selectedKeys[0],
        searchedColumn: dataIndex,
      },
      this.forceUpdate
    )
  }

  private handleReset = (clearFilters: Function) => {
    clearFilters()
    this.setState({ ...this.state, searchText: '' })
  }
  private renderHighlightedText = (text: string, columnIndex: string) => {
    if (this.state.searchedColumn === columnIndex) {
      // https://stackoverflow.com/a/43235785
      const parts = text.split(new RegExp(`(${this.state.searchText})`, 'gi'))
      return (
        <span>
          {parts.map((part, idx) => {
            const match =
              part.toLowerCase() === this.state.searchText?.toLowerCase()
            return (
              <span
                key={idx}
                style={match ? { backgroundColor: '#ffc069' } : {}}
              >
                {part}
              </span>
            )
          })}
        </span>
      )
    } else {
      return text
    }
  }

  private setInvertSearch = (
    dataIndex: keyof TableDataLine,
    checked: boolean
  ) => {
    this.setState({
      ...this.state,
      invertSearchMap: Object.assign(this.state.invertSearchMap, {
        [dataIndex]: checked,
      }),
    })
  }

  private getSelectedRows = (): TableDataLine[] => {
    if (this.state.currentSelectedRows.length) {
      return this.state.currentSelectedRows
    } else {
      return this.state.currentData
    }
  }

  private sortTableKeys = (a: string, b: string) => {
    const keyMap = {
      firstName: 100,
      lastName: 95,
      preferredName: 90,
      email: 85,
      paid: 80,
      membership: 75,
      isReturningMember: 70,
      isUoAStudent: 65,
      EmergencyContactName: 30,
      EmergencyContactNumber: 25,
      EmergencyContactRelationship: 20,
      key: 10,
    }
    return ((keyMap as any)[a] || 50) > ((keyMap as any)[b] || 50) ? -1 : 1
  }

  private getColumnSearchProps = (dataIndex: keyof TableDataLine) => ({
    filterDropdown: (fns: {
      setSelectedKeys: Function
      selectedKeys: string[]
      confirm: Function
      clearFilters: Function
    }) => (
      <div style={{ padding: 8 }}>
        <Input
          ref={this.searchInputRef}
          placeholder={`Search ${dataIndex}`}
          value={fns.selectedKeys[0]}
          onChange={(e) =>
            fns.setSelectedKeys(e.target.value ? [e.target.value] : [])
          }
          onPressEnter={() =>
            this.handleSearch(fns.selectedKeys, fns.confirm, dataIndex)
          }
          style={{ width: 188, marginBottom: 8, display: 'block' }}
        />
        <div>
          {/* TODO: working invert search */}
          {/* {dataIndex === 'notes' ? <Checkbox onChange={e => this.setInvertSearch(dataIndex, e.target.checked)}>Invert</Checkbox>: ''} */}
        </div>
        <Button
          type="primary"
          onClick={() =>
            this.handleSearch(fns.selectedKeys, fns.confirm, dataIndex)
          }
          icon={<SearchOutlined />}
          size="small"
          style={{ width: 90, marginRight: 8 }}
        >
          Search
        </Button>
        <Button
          onClick={() => this.handleReset(fns.clearFilters)}
          size="small"
          style={{ width: 90 }}
        >
          Reset
        </Button>
      </div>
    ),
    filterIcon: (filtered: boolean) => (
      <SearchOutlined style={{ color: filtered ? '#1890ff' : undefined }} />
    ),
    onFilter: (value: string, record: TableDataLine) => {
      if (this.state.invertSearchMap[dataIndex]) {
        return !record[dataIndex]
          ?.toString()
          .toLowerCase()
          .includes(value.toLowerCase())
      } else {
        return record[dataIndex]
          ?.toString()
          .toLowerCase()
          .includes(value.toLowerCase())
      }
    },
    onFilterDropdownVisibleChange: (visible: boolean) => {
      if (visible) {
        setTimeout(() => this.searchInputRef.current.select())
      }
    },
  })

  public importMembers = (
    members: Record<string, AumtMember>
  ): Promise<void> => {
    return addMultipleMembers(members)
  }

  public parseMemberFile = (
    file: File
  ): Promise<{
    members: Record<string, AumtMember>
    errors: string[]
    text: string
  }> => {
    return new Promise((resolve, reject) => {
      const errorsFound: string[] = []
      PapaParse.parse(file, {
        header: true,
        complete: (papaData) => {
          const { data, errors } = papaData
          const initialObj: Record<string, AumtMember> = {}
          const members: Record<string, AumtMember> = data.reduce<
            Record<string, AumtMember>
          >((memberObj: Record<string, AumtMember>, line: any, idx) => {
            const error = errors.find((e) => e.row === idx)
            if (error) {
              errorsFound.push(
                `ERROR - Removed member ${idx + 1} - ${error.message}`
              )
              return memberObj
            }
            if (!line.key) {
              errorsFound.push(
                `ERROR - Removed member with no key, member number ${idx + 1}`
              )
              return memberObj
            }
            const aumtMember = Validator.createAumtMember(line)
            if (typeof aumtMember === 'string') {
              errorsFound.push(
                `ERROR - Removed member with invalid data values at member number ${
                  idx + 1
                }. Reason: ${aumtMember}`
              )
              return memberObj
            }
            memberObj[line.key] = aumtMember
            return memberObj
          }, initialObj)
          return resolve({
            members,
            errors: errorsFound,
            text: `Able to import ${Object.keys(members).length} members`,
          })
        },
        error: (err) => {
          reject(`Could not parse file: ${err.message}`)
        },
      })
    })
  }

  public downloadCsvData = () => {
    let csvStr = ''
    let header = ''
    let fileName = 'AumtMembers'
    this.getSelectedRows().forEach((dataLine, idx, arr) => {
      if (!header) {
        header = Object.keys(dataLine).sort(this.sortTableKeys).join(',')
        csvStr += header + '\n'
      }
      csvStr +=
        Object.keys(dataLine)
          .sort(this.sortTableKeys)
          .map((key: string) => {
            return (dataLine as any)[key]
          })
          .join(',') + (idx < arr.length - 1 ? '\n' : '')
    })
    if (this.state.currentFilters && !this.state.currentSelectedRows.length) {
      const filterKeys = Object.keys(this.state.currentFilters)
      for (let i = 0; i < filterKeys.length; i++) {
        const key = filterKeys[i]
        if (this.state.currentFilters[key]) {
          fileName += `_${key}${this.state.currentFilters[key]?.join('')}`
        }
        if (fileName.length > 50) {
          fileName += '_andmore'
          break
        }
      }
    }
    dataUtil.downloadCsv(fileName, csvStr)
  }

  public copyCurrentEmails = () => {
    const emails = this.getSelectedRows()
      .map((row) => row.email)
      .join('\n')
    this.copyText(emails)
  }

  private removeSelectedLines = () => {
    if (this.state.currentSelectedRows.length) {
      this.setState({
        ...this.state,
        deletingSelectedMembers: false,
      })
      const uids = this.state.currentSelectedRows.map((r) => r.key)
      removeMultipleMembers(uids)
        .then(() => {
          notification.success({
            message: `Successfully removed ${uids.length} members`,
          })
          this.setState({
            ...this.state,
            deletingSelectedMembers: false,
            currentSelectedRows: [],
          })
        })
        .catch((err) => {
          this.setState({
            ...this.state,
            deletingSelectedMembers: false,
          })
          notification.error({ message: err.toString() })
        })
    }
  }

  public setTotalFromPage = (total: number) => {
    this.setState({
      ...this.state,
      currentTableLines: total,
    })
  }

  public onTableChange = (
    pagination: any,
    filter: Record<string, (string | number | boolean)[] | null | null>,
    sorter: any,
    dataSource: TableCurrentDataSource<TableDataLine>,
    ...extra: any
  ) => {
    this.setState({
      ...this.state,
      currentFilters: filter,
      currentData: dataSource.currentDataSource,
    })
  }

  public onRowSelectChange = (rowsSelected: TableDataLine[]) => {
    this.setState({
      ...this.state,
      currentSelectedRows: rowsSelected,
    })
  }

  public getFooterTextFromLines = (numberOfLines: number) => {
    return `Members: ${
      this.state.currentSelectedRows.length || numberOfLines
    }/${this.state.totalMembers}`
  }

  public getRemoveSelectedLink = () => {
    return this.state.currentSelectedRows.length ? (
      <Popconfirm
        title={`Delete ${this.state.currentSelectedRows.length} members?`}
        onConfirm={this.removeSelectedLines}
      >
        <Button
          loading={this.state.deletingSelectedMembers}
          disabled={!this.state.currentSelectedRows.length}
          type="link"
        >
          Remove Selected
        </Button>
      </Popconfirm>
    ) : (
      ''
    )
  }

  public updatePaid = (line: TableDataLine, newPaid: 'Yes' | 'No') => {
    updatePaid(line.key, newPaid)
      .then(() => {
        notification.success({
          message: `Updated Paid for ${line.firstName} to ${newPaid}`,
        })
      })
      .catch((err) => {
        notification.error({ message: 'Could not update ' + err.toString() })
      })
  }

  private updateMembership = (
    line: TableDataLine,
    newMembership: 'S1' | 'S2' | 'FY' | 'SS'
  ) => {
    updateMembership(line.key, newMembership)
      .then(() => {
        notification.success({
          message: `Updated membership for ${line.firstName} to ${newMembership}`,
        })
      })
      .catch((err) => {
        notification.error({ message: 'Could not update ' + err.toString() })
      })
  }

  public getTableFromMembers = (
    memberObj: AumtMembersObj
  ): { lines: TableDataLine[]; columns: TableColumn[] } => {
    const lines: TableDataLine[] = []
    Object.keys(memberObj).forEach((uid: string) => {
      const member = memberObj[uid]
      const line: TableDataLine = Object.assign(
        {
          key: uid,
          ...member,
        },
        {
          tableName:
            member.firstName +
            (member.preferredName ? ` "${member.preferredName}"` : '') +
            ' ' +
            member.lastName,
        }
      )
      lines.push(line)
    })
    const columns: TableColumn[] = [
      {
        title: 'Name',
        dataIndex: 'tableName',
        defaultSortOrder: 'ascend',
        sorter: (a: TableDataLine, b: TableDataLine) =>
          a.tableName.localeCompare(b.tableName),
        render: (t: string, line: TableDataLine) => {
          return (
            <Tooltip placement="left" title="View Details">
              <span
                className="tableNameLink"
                onClick={(e) => this.props.onMemberSelect(line)}
              >
                {this.renderHighlightedText(t, 'tableName')}
              </span>
            </Tooltip>
          )
        },
        ...this.getColumnSearchProps('tableName'),
      },
      {
        dataIndex: 'email',
        title: 'Email',
        width: window.innerWidth > 600 ? 222 : undefined,
        sorter: (a: TableDataLine, b: TableDataLine) => {
          return a.email.localeCompare(b.email)
        },
        ...this.getColumnSearchProps('email'),
        render: (text: string) => {
          return (
            <span>
              {this.renderHighlightedText(text, 'email')}{' '}
              <Tooltip title="Copy">
                <span
                  className="noLinkA rightTableText"
                  onClick={(e) => e.stopPropagation()}
                >
                  <CopyOutlined onClick={(e) => this.copyText(text)} />
                </span>
              </Tooltip>
            </span>
          )
        },
      },
      {
        dataIndex: 'upi',
        title: 'upi',
        render: (t: string) => this.renderHighlightedText(t, 'upi'),
        sorter: (a: TableDataLine, b: TableDataLine) =>
          a.upi.localeCompare(b.upi),
        ...this.getColumnSearchProps('upi'),
      },
      {
        dataIndex: 'studentId',
        title: 'Student Id',
        render: (t: string) => {
          return (
            <span>
              {this.renderHighlightedText(t, 'studentId')}{' '}
              <Tooltip title="Copy">
                <span
                  className="noLinkA rightTableText"
                  onClick={(e) => e.stopPropagation()}
                >
                  <CopyOutlined onClick={(e) => this.copyText(t)} />
                </span>
              </Tooltip>
            </span>
          )
        },
        sorter: (a: TableDataLine, b: TableDataLine) =>
          a.studentId.localeCompare(b.studentId),
        ...this.getColumnSearchProps('studentId'),
      },
      {
        dataIndex: 'ethnicity',
        title: 'Ethnicity',
        render: (text: string) => {
          return <span>{this.renderHighlightedText(text, 'ethnicity')}</span>
        },
        ...this.getColumnSearchProps('ethnicity'),
      },
      {
        dataIndex: 'gender',
        title: 'Gender',
        render: (text: string) => {
          return <span>{this.renderHighlightedText(text, 'gender')}</span>
        },
      },
      {
        dataIndex: 'membership',
        title: 'Membership',
        filters: [
          { text: 'Sem 1', value: 'S1' },
          { text: 'Sem 2', value: 'S2' },
          { text: 'Full Year', value: 'FY' },
          { text: 'Summer School', value: 'SS' },
        ],
        onFilter: (value: string, record: TableDataLine) => {
          return (
            (!record.membership && value === 'None') ||
            record.membership === value
          )
        },
        render: (text: 'S1' | 'S2' | 'FY' | 'SS', line: TableDataLine) => {
          let newText: 'S1' | 'S2' | 'FY' | 'SS' = 'S2'
          if (text === 'S2') newText = 'FY'
          if (text === 'FY') newText = 'SS'
          if (text === 'SS') newText = 'S1'
          return (
            <span>
              {text}{' '}
              <Tooltip title={`Change to ${newText}`}>
                <span
                  className="noLinkA rightTableText"
                  onClick={(e) => e.stopPropagation()}
                >
                  <FormOutlined
                    onClick={(e) => this.updateMembership(line, newText)}
                  />
                </span>
              </Tooltip>
            </span>
          )
        },
      },
      {
        dataIndex: 'isReturningMember',
        title: 'Returning',
        filters: [
          { text: 'Yes', value: 'Yes' },
          { text: 'No', value: 'No' },
        ],
        onFilter: (value: string, record: TableDataLine) => {
          return record.isReturningMember === value
        },
      },
      {
        dataIndex: 'isUoAStudent',
        title: 'UoA',
        filters: [
          { text: 'Yes', value: 'Yes' },
          { text: 'No', value: 'No' },
        ],
        onFilter: (value: string, record: TableDataLine) => {
          return record.isUoAStudent === value
        },
      },
      {
        dataIndex: 'interestedInCamp',
        title: 'Camp Interest',
        filters: [
          { text: 'Yes', value: 'Yes' },
          { text: 'No', value: 'No' },
        ],
        onFilter: (value: string, record: TableDataLine) => {
          return record.interestedInCamp === value
        },
      },
      {
        dataIndex: 'paid',
        title: 'Paid',
        filters: [
          { text: 'Yes', value: 'Yes' },
          { text: 'No', value: 'No' },
        ],
        onFilter: (value: string, record: TableDataLine) => {
          return record.paid === value
        },
        render: (text: 'Yes' | 'No', line: TableDataLine) => {
          const newPaid = text === 'Yes' ? 'No' : 'Yes'
          return (
            <span>
              {text}{' '}
              <Tooltip title={`Change to ${newPaid}`}>
                <span
                  className="noLinkA rightTableText"
                  onClick={(e) => e.stopPropagation()}
                >
                  <FormOutlined
                    onClick={(e) => this.updatePaid(line, newPaid)}
                  />
                </span>
              </Tooltip>
            </span>
          )
        },
      },
      {
        dataIndex: 'paymentType',
        title: 'Payment Type',
        filters: [
          { text: 'Bank Transfer', value: 'Bank Transfer' },
          { text: 'Cash', value: 'Cash' },
          { text: 'Other', value: 'Other' },
        ],
        onFilter: (value: string, record: TableDataLine) => {
          return record.paymentType === value
        },
      },
      {
        dataIndex: 'timeJoinedMs',
        title: 'Joined',
        sorter: (a: TableDataLine, b: TableDataLine) =>
          b.timeJoinedMs - a.timeJoinedMs,
        filters: [
          { text: 'Jul 24-27', value: '24' },
          { text: 'Jul 28 +', value: '28' },
        ],
        onFilter: (value: string, record: TableDataLine) => {
          if (value === '28') {
            return 1595851200000 < record.timeJoinedMs
          } else if (value === '24') {
            return (
              1595505600000 < record.timeJoinedMs &&
              1595851200000 > record.timeJoinedMs
            )
          }
          return true
        },
        render: (text: string) => {
          return moment(Number(text)).format('MMM DD')
        },
      },
      {
        dataIndex: 'notes',
        title: 'Notes',
        ...this.getColumnSearchProps('notes'),
        render: (text: string) => {
          return <div className="tableLongTextContainer">{text}</div>
        },
      },
    ]
    this.setState({
      ...this.state,
      currentData: lines,
      totalMembers: lines.length,
    })
    return { lines, columns }
  }
  render() {
    return null
  }
}
