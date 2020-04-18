import React, {Component} from 'react'
import { Input, Button } from 'antd'
import { SearchOutlined } from '@ant-design/icons'
import { SyncOutlined } from '@ant-design/icons'
import './TableHelper.css'
import DataFormatterUtil, {TableColumn, TableDataLine} from '../../../services/data.formatter'
import { AumtMember, AumtMembersObj } from '../../../types'
import db from '../../../services/db'

interface TableHelperProps {}

interface TableHelperState {
    searchedColumn: string
    searchText: string
}

export class TableHelper extends Component<TableHelperProps, TableHelperState> {
    constructor(props: TableHelperProps) {
        super(props)
        this.state = {
            searchText: '',
            searchedColumn: ''
        }
    }

    private searchInput: Input|null = null

    private handleSearch = (selectedKeys: string[], confirm: Function, dataIndex: string) => {

    }

    private handleReset = (clearFilters: Function) => {

    }

    private getColumnSearchProps = (dataIndex: keyof AumtMember) => ({
        filterDropdown: (fns: { setSelectedKeys: Function, selectedKeys: string[], confirm: Function, clearFilters: Function }) => (
          <div style={{ padding: 8 }}>
            <Input
              ref={node => {
                this.searchInput = node;
              }}
              placeholder={`Search ${dataIndex}`}
              value={fns.selectedKeys[0]}
              onChange={e => fns.setSelectedKeys(e.target.value ? [e.target.value] : [])}
              onPressEnter={() => this.handleSearch(fns.selectedKeys, fns.confirm, dataIndex)}
              style={{ width: 188, marginBottom: 8, display: 'block' }}
            />
            <Button
              type="primary"
              onClick={() => this.handleSearch(fns.selectedKeys, fns.confirm, dataIndex)}
              icon={<SearchOutlined />}
              size="small"
              style={{ width: 90, marginRight: 8 }}
            >
              Search
            </Button>
            <Button onClick={() => this.handleReset(fns.clearFilters)} size="small" style={{ width: 90 }}>
              Reset
            </Button>
          </div>
        ),
        filterIcon: (filtered: boolean) => <SearchOutlined style={{ color: filtered ? '#1890ff' : undefined }} />,
        onFilter: (value: string, record: TableDataLine) => {
          return record[dataIndex]?.toString().toLowerCase().includes(value.toLowerCase())
        },
        onFilterDropdownVisibleChange: (visible: boolean) => {
          if (visible) {
            setTimeout(() => this.searchInput?.select())
          }
        }
        // render: (text) =>
        //   this.state.searchedColumn === dataIndex ? (
        //     <Highlighter
        //       highlightStyle={{ backgroundColor: '#ffc069', padding: 0 }}
        //       searchWords={[this.state.searchText]}
        //       autoEscape
        //       textToHighlight={text.toString()}
        //     />
        //   ) : (
        //     text
        //   ),
      });

    public getTableFromMembers = (memberObj: AumtMembersObj): {lines: TableDataLine[], columns: TableColumn[]} => {
        const lines: TableDataLine[] = []
        Object.keys(memberObj).forEach((uid: string) => {
            const line: TableDataLine = {
                key: uid,
                ...memberObj[uid]
            }
            lines.push(line)
        })
        const columns: TableColumn[] = [
            {
                title: 'Name',
                children: [
                    {
                        dataIndex: 'firstName',
                        title: 'First',
                        sorter: (a: TableDataLine, b: TableDataLine) => a.firstName.localeCompare(b.firstName),
                        ...this.getColumnSearchProps('firstName')
                    },
                    {
                        dataIndex: 'lastName',
                        title: 'Last',
                        sorter: (a: TableDataLine, b: TableDataLine) => a.lastName.localeCompare(b.lastName)
                    },
                    {
                        dataIndex: 'preferredName',
                        title: 'Preferred',
                        sorter: (a: TableDataLine, b: TableDataLine) => a.preferredName.localeCompare(b.preferredName)
                    }
                ]
            },
            {
                dataIndex: 'email',
                title: 'Email',
                sorter: (a: TableDataLine, b: TableDataLine) => a.email.localeCompare(b.email)
            },
            {
                dataIndex: 'UPI',
                title: 'UPI',
                sorter: (a: TableDataLine, b: TableDataLine) => a.UPI.localeCompare(b.UPI)
            },
            {
                dataIndex: 'membership',
                title: 'Membership',
                filters: [{ text: 'Sem 1', value: 'S1' },
                            { text: 'Full Year', value: 'FY' },
                            {text: 'None', value: null}],
                onFilter: (value: string, record: TableDataLine) => {
                    return !record.membership && value === 'None' || record.membership === value
                }
            },
            {
                dataIndex: 'isUoAStudent',
                title: 'UoA Student',
                filters: [{ text: 'Yes', value: 'Yes' },
                            { text: 'No', value: 'No' }],
                onFilter: (value: string, record: TableDataLine) => {
                    return record.isUoAStudent === value
                }
            },
            {
                title: 'Emergency Contact',
                children: [
                    {
                        dataIndex: 'EmergencyContactName',
                        title: 'Name'
                    },
                    {
                        dataIndex: 'EmergencyContactNumber',
                        title: 'Number'
                    },
                    {
                        dataIndex: 'Relationship',
                        title: 'Relationship'
                    }
                ]
            }
        ]
        return {lines, columns}
    }
    render(){return null}
}