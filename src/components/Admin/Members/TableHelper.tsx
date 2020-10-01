import React, {Component, ReactText} from 'react'
import { Input, Button, Tooltip, notification, Popconfirm } from 'antd'
import { SearchOutlined, CopyOutlined, FormOutlined } from '@ant-design/icons'
import moment from 'moment'
import PapaParse from 'papaparse'
import './TableHelper.css'
import { AumtMember, AumtMembersObj } from '../../../types'
import { TableCurrentDataSource } from 'antd/lib/table/interface';
import db from '../../../services/db';
import Validator from '../../../services/validator';

import DataFormatterUtil from '../../../services/data.util'
import dataUtil from '../../../services/data.util';
export type TableDataLine = AumtMember & {key: string, tableName: string}
export type TableColumn = any

interface TableHelperProps {
    onMemberSelect: (member: TableDataLine) => void
}

interface TableHelperState {
    searchedColumn: string
    searchText: string
    currentData: TableDataLine[]
    currentSelectedRows: TableDataLine[]
    currentFilters: Record<string, React.ReactText[] | null>
    totalMembers: number
    deletingSelectedMembers: boolean
    currentTableLines: number
}

export class TableHelper extends Component<TableHelperProps, TableHelperState> {
    constructor(props: TableHelperProps) {
        super(props)
        this.state = {
            searchText: '',
            searchedColumn: '',
            currentData: [],
            currentSelectedRows: [],
            currentFilters: {},
            totalMembers: 0,
            deletingSelectedMembers: false,
            currentTableLines: 0
        }
    }

    private searchInput: Input|null = null

    copyText = (text: string) => {
        DataFormatterUtil.copyText(text)
    }

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
    private renderHighlightedText = (text: string, columnIndex: string) => {
        if (this.state.searchedColumn === columnIndex) {
            // https://stackoverflow.com/a/43235785
            const parts = text.split(new RegExp(`(${this.state.searchText})`, 'gi'));
            return <span>
                {parts.map((part, idx) => {
                    const match = part.toLowerCase() === this.state.searchText.toLowerCase()
                    return <span key={idx} style={match ? { backgroundColor: '#ffc069' } : {} }>
                        { part }
                    </span>})
                }
            </span>
        } else {
            return text
        }
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
            firstName:100,
            lastName:95,
            preferredName: 90,
            email: 85,
            paid: 80,
            membership: 75,
            isReturningMember: 70,
            isUoAStudent: 65,
            EmergencyContactName: 30,
            EmergencyContactNumber: 25,
            EmergencyContactRelationship: 20,
            key: 10
        }
        return ((keyMap as any)[a] || 50) > ((keyMap as any)[b] || 50) ? -1 : 1
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
    });

    public importMembers = (members: Record<string, AumtMember>): Promise<void> => {
        return db.addMultipleMembers(members)
    }

    public parseMemberFile = (file: File): Promise<{members: Record<string, AumtMember>, errors: string[], text: string}> => {
        return new Promise((resolve, reject) => {
            const errorsFound: string[] = []
            PapaParse.parse(file, {
                header: true,
                complete: (papaData) => {
                    const {data, errors} = papaData
                    const members: Record<string, AumtMember> = data.reduce((memberObj: Record<string, AumtMember>, line: any, idx) => {
                        const error = errors.find(e => e.row === idx)
                        if (error) {
                            errorsFound.push(`ERROR - Removed member ${idx + 1} - ${error.message}`)
                            return memberObj
                        }
                        if (!line.key) {
                            errorsFound.push(`ERROR - Removed member with no key, member number ${idx + 1}`)
                            return memberObj
                        }
                        const aumtMember = Validator.createAumtMember(line)
                        if (typeof(aumtMember) == 'string') {
                            errorsFound.push(`ERROR - Removed member with invalid data values at member number ${idx + 1}. Reason: ${aumtMember}`)
                            return memberObj
                        }
                        memberObj[line.key] = aumtMember
                        return memberObj
                    }, {})
                    return resolve({
                        members,
                        errors: errorsFound,
                        text: `Able to import ${Object.keys(members).length} members`
                    })
                },
                error: (err) => {
                    reject(`Could not parse file: ${err.message}`)
                }
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
            csvStr += Object.keys(dataLine).sort(this.sortTableKeys).map((key: string) => {
                return (dataLine as any)[key]
             }).join(',') + (idx < arr.length - 1 ? '\n' : '')
        })
        if (this.state.currentFilters && !this.state.currentSelectedRows.length) {
            const filterKeys = Object.keys(this.state.currentFilters)
            for (let i = 0; i < filterKeys.length; i ++) {
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
        const emails = this.getSelectedRows().map(row => row.email).join('\n')
        this.copyText(emails)
    }

    private removeSelectedLines = () => {
        if (this.state.currentSelectedRows.length) {
            this.setState({
                ...this.state,
                deletingSelectedMembers: false
            })
            const uids = this.state.currentSelectedRows.map(r => r.key)
            db.removeMultipleMembers(uids)
                .then(() => {
                    notification.success({message: `Successfully removed ${uids.length} members`})
                    this.setState({
                        ...this.state,
                        deletingSelectedMembers: false,
                        currentSelectedRows: []
                    })
                })
                .catch((err) => {
                    this.setState({
                        ...this.state,
                        deletingSelectedMembers: false
                    })
                    notification.error({message: err.toString()})
                })
        }
    }

    public setTotalFromPage = (total: number) => {
        this.setState({
            ...this.state,
            currentTableLines: total
        })
    }

    public onTableChange = (pagination: any, filter: Record<keyof TableDataLine, React.ReactText[] | null>, sorter: any, dataSource: TableCurrentDataSource<TableDataLine>, ...extra: any) => {
        this.setState({
            ...this.state,
            currentFilters: filter,
            currentData: dataSource.currentDataSource,
        })
    }

    public onRowSelectChange = (rowsSelected: TableDataLine[]) => {
        this.setState({
            ...this.state,
            currentSelectedRows: rowsSelected
        })
    }

    public getFooterTextFromLines = (numberOfLines: number) => {
        return `Members: ${this.state.currentSelectedRows.length || numberOfLines}/${this.state.totalMembers}`
    }
    
    public getRemoveSelectedLink = () => {
        return this.state.currentSelectedRows.length ? <Popconfirm
                title={`Delete ${this.state.currentSelectedRows.length} members?`}
                onConfirm={this.removeSelectedLines}>
                <Button loading={this.state.deletingSelectedMembers} disabled={!this.state.currentSelectedRows.length} type='link'>Remove Selected</Button>
            </Popconfirm> : ''
    }

    public updatePaid = (line: TableDataLine, newPaid: 'Yes' | 'No') => {
        db.updatePaid(line.key, newPaid)
            .then(() => {
                notification.success({message: `Updated Paid for ${line.firstName} to ${newPaid}`})
            })
            .catch((err) => {
                notification.error({message: 'Could not update ' + err.toString()})
            })
    }

    private updateMembership = (line: TableDataLine, newMembership: 'S1' | 'S2' | 'FY') => {
        db.updateMembership(line.key, newMembership)
            .then(() => {
                notification.success({message: `Updated membership for ${line.firstName} to ${newMembership}`})
            })
            .catch((err) => {
                notification.error({message: 'Could not update ' + err.toString()})
            })
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
                defaultSortOrder: 'ascend',
                sorter: (a: TableDataLine, b: TableDataLine) => a.tableName.localeCompare(b.tableName),
                render: (t: string, line: TableDataLine) => {
                    return (
                        <Tooltip placement='left' title='View Details'>
                            <span className='tableNameLink' onClick={e => this.props.onMemberSelect(line)}>
                                {this.renderHighlightedText(t, 'tableName')}
                            </span>
                        </Tooltip>
                        )
                },
                ...this.getColumnSearchProps('tableName')
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
                    return <span>{this.renderHighlightedText(text, 'email')} <Tooltip title='Copy'>
                        <span className='noLinkA rightTableText' onClick={e => e.stopPropagation()}><CopyOutlined onClick={e => this.copyText(text)}/></span>
                        </Tooltip></span>
                }
            },
            {
                dataIndex: 'upi',
                title: 'upi',
                render: (t: string) => this.renderHighlightedText(t, 'upi'),
                sorter: (a: TableDataLine, b: TableDataLine) => a.upi.localeCompare(b.upi),
                ...this.getColumnSearchProps('upi')
            },
            {
                dataIndex: 'membership',
                title: 'Membership',
                filters: [{ text: 'Sem 1', value: 'S1' },
                            { text: 'Sem 2', value: 'S2' },
                            { text: 'Full Year', value: 'FY' }],
                onFilter: (value: string, record: TableDataLine) => {
                    return (!record.membership && value === 'None') || record.membership === value
                },
                render: (text: 'S1' | 'S2' | 'FY', line: TableDataLine) => {
                    let newText: 'S1' | 'S2' | 'FY' = 'S2'
                    if (text === 'S2') newText = 'FY'
                    if (text === 'FY') newText = 'S1'
                    return <span>
                        {text} <Tooltip title={`Change to ${newText}`}>
                            <span className="noLinkA rightTableText" onClick={e => e.stopPropagation()}>
                                <FormOutlined onClick={e => this.updateMembership(line, newText)}/>
                            </span>
                        </Tooltip>
                    </span>
                }
            },
            {
                dataIndex: 'isReturningMember',
                title: 'Returning',
                filters: [{ text: 'Yes', value: 'Yes' },
                { text: 'No', value: 'No' }],
                onFilter: (value: string, record: TableDataLine) => {
                    return record.isReturningMember === value
                }
            },
            {
                dataIndex: 'isUoAStudent',
                title: 'UoA',
                filters: [{ text: 'Yes', value: 'Yes' },
                { text: 'No', value: 'No' }],
                onFilter: (value: string, record: TableDataLine) => {
                    return record.isUoAStudent === value
                }
            },
            {
                dataIndex: 'paid',
                title: 'Paid',
                filters: [{ text: 'Yes', value: 'Yes' },
                    { text: 'No', value: 'No' }],
                onFilter: (value: string, record: TableDataLine) => {
                    return record.paid === value
                },
                render: (text: 'Yes' | 'No', line: TableDataLine) => {
                    const newPaid = text === 'Yes'  ? 'No' : 'Yes'
                    return <span>
                        {text} <Tooltip title={`Change to ${newPaid}`}>
                            <span className="noLinkA rightTableText" onClick={e => e.stopPropagation()}>
                                <FormOutlined onClick={e => this.updatePaid(line, newPaid)}/>
                            </span>
                        </Tooltip>
                    </span>
                }
            },
            {
                dataIndex: 'paymentType',
                title: 'Payment Type',
                filters: [{ text: 'Bank Transfer', value: 'Bank Transfer' },
                    { text: 'Cash', value: 'Cash' },
                    { text: 'Other', value: 'Other'}],
                onFilter: (value: string, record: TableDataLine) => {
                    return record.paymentType === value
                },
            },
            {
                dataIndex: 'instagramHandle',
                title: 'Insta',
                ...this.getColumnSearchProps('instagramHandle'),
                render: (text: string) => {
                    return text ? <span>@{this.renderHighlightedText(text, 'instagramHandle')}</span> : {text}
                }
            },
            {
                dataIndex: 'timeJoinedMs',
                title: 'Joined',
                sorter: (a: TableDataLine, b: TableDataLine) => b.timeJoinedMs - a.timeJoinedMs,
                filters: [{text: 'Jul 24-27', value: '24'}, {text: 'Jul 28 +', value: '28'}],
                onFilter: (value: string, record: TableDataLine) => {
                    if (value === '28') {
                        return 1595851200000 < record.timeJoinedMs
                    } else if (value === '24') {
                        return 1595505600000 < record.timeJoinedMs && 1595851200000 > record.timeJoinedMs
                    }
                    return true
                },
                render: (text: string) => {
                    return moment(Number(text)).format('MMM DD')
                }
            },
            // {
            //     dataIndex: 'emailVerified',
            //     title: 'Logged In',
            //     filters: [{text: 'Yes', value: true}, 
            //     {text: 'No', value: false}],
            //     onFilter: (value: boolean, record: TableDataLine) => {
            //         return value === record.emailVerified
            //     },
            //     render: (verified: boolean) => {
            //         return verified ? 'Yes' : 'No'
            //     }
            // }
            {
                dataIndex: 'notes',
                title: 'Notes',
                ...this.getColumnSearchProps('notes'),
                render: (text: string) => {
                    return <p className='tableLongTextContainer'>
                            <span>{this.renderHighlightedText(text, 'notes')}</span>
                        </p>
                }

            }
            // {
            //     title: 'Emergency Contact',
            //     children: [
            //         {
            //             dataIndex: 'EmergencyContactName',
            //             title: 'Name',
            //             render: (t: string) => this.renderHighlightedText(t, 'EmergencyContactName'),
            //             ...this.getColumnSearchProps('EmergencyContactName')
            //         },
            //         {
            //             dataIndex: 'EmergencyContactNumber',
            //             title: 'Number',
            //             render: (text: string) => {
            //                 return <span>{this.renderHighlightedText(text, 'EmergencyContactNumber')} <Tooltip title='Copy'>
            //                     <span className='noLinkA rightTableText' onClick={e => e.stopPropagation()}><
            //                         CopyOutlined onClick={e => this.copyText(text)}/>
            //                     </span>
            //                     </Tooltip></span>
            //             },
            //             ...this.getColumnSearchProps('EmergencyContactNumber')
            //         },
            //         {
            //             dataIndex: 'EmergencyContactRelationship',
            //             title: 'Relation',
            //             render: (t: string) => this.renderHighlightedText(t, 'EmergencyContactRelationship'),
            //             ...this.getColumnSearchProps('EmergencyContactRelationship')
            //         }
            //     ]                
            // }
        ]
        this.setState({...this.state, currentData: lines, totalMembers: lines.length})
        return {lines, columns}
    }
    render(){return null}
}