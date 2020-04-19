import React, {Component} from 'react'
import Highlighter from 'react-highlight-words';
import { Input, Button } from 'antd'
import { SearchOutlined } from '@ant-design/icons'
import './TableHelper.css'
import { AumtMember, AumtMembersObj } from '../../../types'
import { TableCurrentDataSource } from 'antd/lib/table/interface';

export type TableDataLine = AumtMember & {key: string, tableName: string}
export type TableColumn = any

interface TableHelperProps {
    onMemberSelect: (member: TableDataLine) => void
}

interface TableHelperState {
    searchedColumn: string
    searchText: string
    currentData: TableDataLine[]
    totalMembers: number
}

export class TableHelper extends Component<TableHelperProps, TableHelperState> {
    constructor(props: TableHelperProps) {
        super(props)
        this.state = {
            searchText: '',
            searchedColumn: '',
            currentData: [],
            totalMembers: 0
        }
    }

    private searchInput: Input|null = null

    private handleSearch = (selectedKeys: string[], confirm: Function, dataIndex: string) => {
        confirm();
        this.setState({
            searchText: selectedKeys[0],
            searchedColumn: dataIndex,
        });
    }

    private handleReset = (clearFilters: Function) => {
        clearFilters();
        this.setState({ searchText: '' });
    }

    private getColumnSearchProps = (dataIndex: keyof TableDataLine) => ({
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
        },
        render: (text: string) => {
            return this.state.searchedColumn === dataIndex ? (
                <Highlighter
                highlightStyle={{ backgroundColor: '#ffc069', padding: 0 }}
                searchWords={[this.state.searchText]}
                autoEscape
                textToHighlight={text.toString()}
                />
                ) : (
                    text
                )
        }
      });

    public onTableChange = (pagination: any, filter: any, sorter: any, dataSource: TableCurrentDataSource<TableDataLine>) => {
        this.setState({
            ...this.state,
            currentData: dataSource.currentDataSource
        })
    }
    
    public getFooter = (currentDisplay: TableDataLine[]) => {
        return `Members: ${this.state.currentData.length}/${this.state.totalMembers}`
    }

    public onRow = (record: TableDataLine) => {
        return {
            onClick: () => {
                this.props.onMemberSelect(record)
            }
        }
    }

    public getTableFromMembers = (memberObj: AumtMembersObj): {lines: TableDataLine[], columns: TableColumn[]} => {
        const lines: TableDataLine[] = []
        Object.keys(memberObj).forEach((uid: string) => {
            const member = memberObj[uid]
            const line: TableDataLine = Object.assign({
                key: uid,
                ...member
            }, {
                tableName: member.firstName + (member.preferredName ? ` "${member.preferredName}"` : '') + ' ' + member.lastName
            })
            lines.push(line)
        })
        const columns: TableColumn[] = [
            {
                title: 'Name',
                dataIndex: 'tableName',
                sorter: (a: TableDataLine, b: TableDataLine) => a.tableName.localeCompare(b.tableName),
                ...this.getColumnSearchProps('tableName')
            },
            {
                dataIndex: 'email',
                title: 'Email',
                sorter: (a: TableDataLine, b: TableDataLine) => a.email.localeCompare(b.email),
                ...this.getColumnSearchProps('email')
            },
            {
                dataIndex: 'UPI',
                title: 'upi',
                sorter: (a: TableDataLine, b: TableDataLine) => a.UPI.localeCompare(b.UPI),
                ...this.getColumnSearchProps('UPI')
            },
            {
                dataIndex: 'membership',
                title: 'Membership',
                width: 130,
                filters: [{ text: 'Sem 1', value: 'S1' },
                            { text: 'Full Year', value: 'FY' },
                            {text: 'None', value: null}],
                onFilter: (value: string, record: TableDataLine) => {
                    return (!record.membership && value === 'None') || record.membership === value
                }
            },
            {
                dataIndex: 'isReturningMember',
                title: 'Returning',
                width: 130,
                filters: [{ text: 'Yes', value: 'Yes' },
                { text: 'No', value: 'No' }],
                onFilter: (value: string, record: TableDataLine) => {
                    return record.isReturningMember === value
                }
            },
            {
                dataIndex: 'isUoAStudent',
                title: 'UoA',
                width: 100,
                filters: [{ text: 'Yes', value: 'Yes' },
                { text: 'No', value: 'No' }],
                onFilter: (value: string, record: TableDataLine) => {
                    return record.isUoAStudent === value
                }
            },
            {
                dataIndex: 'isUoAStudent',
                title: 'Paid',
                width:100
            },
            {
                title: 'Emergency Contact',
                children: [
                    {
                        dataIndex: 'EmergencyContactName',
                        title: 'Name',
                        ...this.getColumnSearchProps('EmergencyContactName')
                    },
                    {
                        dataIndex: 'EmergencyContactNumber',
                        title: 'Number',
                        ...this.getColumnSearchProps('EmergencyContactNumber')
                    },
                    {
                        dataIndex: 'Relationship',
                        title: 'Relation',
                        ...this.getColumnSearchProps('Relationship')
                    }
                ]                
            }
        ]
        this.setState({...this.state, currentData: lines, totalMembers: lines.length})
        return {lines, columns}
    }
    render(){return null}
}