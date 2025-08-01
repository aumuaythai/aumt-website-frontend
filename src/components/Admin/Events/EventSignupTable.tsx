import {
  ArrowLeftOutlined,
  ArrowRightOutlined,
  CloseCircleOutlined,
  CopyOutlined,
  FormOutlined,
  ReloadOutlined,
} from '@ant-design/icons'
import {
  Button,
  Checkbox,
  Drawer,
  Select,
  Table,
  Tag,
  Tooltip,
  notification,
} from 'antd'
import { ColumnsType } from 'antd/lib/table'
import { TableCurrentDataSource } from 'antd/lib/table/interface'
import moment from 'moment'
import React, { Component } from 'react'
import dataUtil, { CarAllocation } from '../../../services/data.util'
import {
  confirmMemberEventSignup,
  removeMemberFromEvent,
  signUpToEvent,
} from '../../../services/db'
import { AumtEventSignup, LicenseClasses, TableRow } from '../../../types'
import { EventSignupDetails } from './EventSignupDetails'
import './EventSignupTable.css'

interface EventSignupTableProps {
  signupData: AumtEventSignup
  urlPath: string
  eventId: string
  isWaitlist: boolean
  isCamp: boolean
  limit: number | null
}

interface EventSignupTableState {
  rows: TableRow[]
  selectedRows: TableRow[]
  columns: ColumnsType<TableRow>
  tableLoading: boolean
  selectedSignup: TableRow | null
  showCarAllocs: boolean
  randomCars: CarAllocation[]
  max4Seats: boolean
}

export class EventSignupTable extends Component<
  EventSignupTableProps,
  EventSignupTableState
> {
  private keyNameMap: Record<keyof TableRow, string> = {
    confirmed: 'Paid?',
    displayName: 'Name',
    key: 'Firebase UID',
    timeSignedUpMs: 'Time Signed Up (ms)',
    displayTime: 'Time Signed Up',
    email: 'Email',
    phoneNumber: 'Phone',
    hasFirstAid: 'First Aid?',
    daysStaying: 'Days Staying',
    carModel: 'Model',
    insuranceDescription: 'Insurance',
    name: 'Name',
    dietaryRequirements: 'Dietary',
    medicalInfo: 'Medical',
    driverLicenseClass: 'License',
    seatsInCar: 'Seats',
    ecName: 'Emergency Contact Name',
    ecPhoneNumber: 'Emergency Contact Phone',
    ecRelation: 'Emergency Contact Relation',
  }
  constructor(props: EventSignupTableProps) {
    super(props)
    this.state = {
      rows: [],
      selectedRows: [],
      columns: [],
      tableLoading: false,
      selectedSignup: null,
      showCarAllocs: false,
      randomCars: [],
      max4Seats: false,
    }
  }
  componentDidMount = () => {
    this.setState(
      {
        ...this.state,
        columns: this.getColumns(),
      },
      () => {
        this.handleNewData(this.props.signupData)
      }
    )
  }
  componentDidUpdate = (
    prevProps: EventSignupTableProps,
    prevState: EventSignupTableState
  ) => {
    if (prevProps.signupData !== this.props.signupData) {
      this.handleNewData(Object.assign({}, this.props.signupData))
    }
  }

  updateConfirmed = (row: TableRow | null, newConfirmed: boolean) => {
    if (!row) {
      return
    }
    confirmMemberEventSignup(
      this.props.eventId,
      row.key,
      newConfirmed,
      this.props.isWaitlist
    )
      .then(() => {
        notification.success({
          message: `Updated confirmed for ${row.displayName} to ${
            newConfirmed ? 'Yes' : 'No'
          }`,
        })
      })
      .catch((err) => {
        notification.error({
          message: `Error confirming signup: ${err.toString()}`,
        })
      })
  }
  deleteMember = (key: string) => {
    if (!key) return
    removeMemberFromEvent(key, this.props.eventId, this.props.isWaitlist)
      .then(() => {
        notification.success({
          message: `Removed from ${
            this.props.isWaitlist ? 'waitlist' : 'signups'
          }`,
        })
      })
      .catch((err) => {
        notification.error({
          message: `Error removing from event: ${err.toString()}`,
        })
      })
  }
  onMoveClick = (key: string) => {
    if (!key) return
    this.setState({ ...this.state, tableLoading: true })
    const data = this.props.signupData[key]
    signUpToEvent(this.props.eventId, key, data, !this.props.isWaitlist)
      .then(() => {
        return removeMemberFromEvent(
          key,
          this.props.eventId,
          this.props.isWaitlist
        )
      })
      .then(() => {
        notification.success({
          message: `Successfully moved to ${
            this.props.isWaitlist ? 'signups' : 'waitlist'
          }`,
        })
      })
      .catch((err) => {
        notification.error({
          message: `Error moving member: ${err.toString()}`,
        })
      })
      .finally(() => {
        this.setState({ ...this.state, tableLoading: false })
      })
  }
  onSelectSignup = (key: string) => {
    const member = this.state.rows.find((r) => r.key === key)
    if (member) {
      this.setState({
        ...this.state,
        selectedSignup: member,
      })
    }
  }
  handleNewData = (signupData: AumtEventSignup) => {
    const rows = Object.keys(signupData).map((uid: string) => {
      const signup = signupData[uid]
      return Object.assign(signup, {
        key: uid,
        displayTime: moment(new Date(signup.timeSignedUpMs)).format(
          'MMM DD HH:mm'
        ),
      })
    })
    const selectedMember = rows.find(
      (r) => r.key === this.state.selectedSignup?.key
    )
    this.setState({
      ...this.state,
      rows,
      columns: this.getColumns(),
      selectedSignup: selectedMember || null,
    })
  }
  setShowCarAllocations = (showCarAllocs: boolean) => {
    let randomCars: CarAllocation[] = []
    if (showCarAllocs) {
      try {
        randomCars = dataUtil.getRandomCars(
          this.state.rows,
          this.state.max4Seats
        )
      } catch (e) {
        notification.error({
          message: 'Could not generate allocations: ' + e.toString(),
        })
        return
      }
    }
    this.setState({ ...this.state, showCarAllocs, randomCars })
  }
  setMax4Seats = (checked: boolean) => {
    this.setState({
      ...this.state,
      max4Seats: checked,
    })
  }
  getColumns = () => {
    const columns: ColumnsType<TableRow> = [
      {
        title: 'Name',
        dataIndex: 'displayName',
        render: (name: string, record: TableRow) => {
          return (
            <Tooltip placement="right" title="View Details">
              <span
                className="eventTableNameLink"
                onClick={(e) => this.onSelectSignup(record.key)}
              >
                {name}
              </span>
            </Tooltip>
          )
        },
      },
      {
        title: 'Email',
        dataIndex: 'email',
        render: (email: string, record: TableRow) => {
          return (
            <span>
              {email}{' '}
              <Tooltip title="Copy">
                <span
                  className="noLinkA rightTableText"
                  onClick={(e) => e.stopPropagation()}
                >
                  <CopyOutlined onClick={(e) => this.copyText(email)} />
                </span>
              </Tooltip>
            </span>
          )
        },
      },
      {
        title: 'Paid',
        dataIndex: 'confirmed',
        width: 85,
        filters: [
          { text: 'Yes', value: true },
          { text: 'No', value: false },
        ],
        onFilter: (value: string | number | boolean, record: TableRow) => {
          return value === record.confirmed
        },
        render: (val: boolean, record: TableRow) => {
          const text = val ? 'Yes' : 'No'
          const newConfirmed = text === 'Yes' ? 'No' : 'Yes'
          return (
            <span>
              {text}
              <Tooltip title={`Change to ${newConfirmed}`}>
                <span
                  className="noLinkA rightTableText"
                  onClick={(e) => e.stopPropagation()}
                >
                  <FormOutlined
                    onClick={(e) =>
                      this.updateConfirmed(record, newConfirmed === 'Yes')
                    }
                  />
                </span>
              </Tooltip>
            </span>
          )
        },
      },
      {
        title: 'Diet Reqs',
        dataIndex: 'dietaryRequirements',
      },
      {
        title: 'Medical Info',
        dataIndex: 'medicalInfo',
      },
      {
        title: 'License',
        dataIndex: 'driverLicenseClass',
        filters: [
          { text: 'Full 2+ years', value: 'Full 2+ years' },
          { text: 'Full <2 years', value: 'Full <2 years' },
          { text: 'Restricted', value: 'Restricted' },
          { text: 'None/Other', value: 'Other' },
        ],
        onFilter: (value: string | number | boolean, record: TableRow) => {
          return value === record.driverLicenseClass
        },
        render: (val: LicenseClasses, record: TableRow) => {
          return <span>{val === 'Other' || !val ? 'None/Other' : val}</span>
        },
      },
      {
        title: 'Owns Car',
        dataIndex: 'seatsInCar',
        render: (val: number, record: TableRow) => {
          return val && val > -1 ? <span>Yes, {val} seats</span> : 'No'
        },
        filters: [
          { text: 'Yes', value: true },
          { text: 'No', value: false },
        ],
        onFilter: (value: boolean | string | number, record: TableRow) => {
          return !(record.seatsInCar === -1) === value
        },
      },
      {
        title: 'Staying',
        dataIndex: 'daysStaying',
        filters: [
          { text: '4 days (27th-30th)', value: '4 days (27th-30th)' },
          { text: '3 days (27th-29th)', value: '3 days (27th-29th)' },
          { text: '3 days (28th-30th)', value: '3 days (28th-30th)' },
          { text: 'Other', value: 'Other' },
        ],
        onFilter: (value: boolean | string | number, record: TableRow) => {
          const defaultOptions = [
            '4 days (27th-30th)',
            '3 days (27th-29th)',
            '3 days (28th-30th)',
          ]
          if (value !== 'Other') {
            return record.daysStaying === value
          } else {
            return defaultOptions.indexOf(record.daysStaying || '') === -1
          }
        },
      },
      {
        title: 'Time',
        dataIndex: 'displayTime',
        defaultSortOrder: 'ascend' as any,
        sorter: (a: TableRow, b: TableRow) =>
          b.timeSignedUpMs - a.timeSignedUpMs,
      },
      {
        title: 'Action',
        render: (val: boolean, record: TableRow) => {
          return (
            <span>
              {this.props.isWaitlist ? (
                <Button onClick={(e) => this.onMoveClick(record.key)}>
                  Move
                  <ArrowLeftOutlined />
                </Button>
              ) : (
                <Button onClick={(e) => this.onMoveClick(record.key)}>
                  <ArrowRightOutlined />
                  Move
                </Button>
              )}
              <Button
                type="link"
                onClick={(e) => this.deleteMember(record.key)}
              >
                Delete
              </Button>
            </span>
          )
        },
      },
    ].filter((r) => {
      if (this.props.isCamp) {
        return this.state.selectedSignup
          ? ['displayName', 'email', 'confirmed', 'displayTime'].indexOf(
              r.dataIndex || ''
            ) > -1 || r.title === 'Action'
          : r
      } else {
        return (
          [
            'dietaryRequirements',
            'driverLicenseClass',
            'seatsInCar',
            'phoneNumber',
          ].indexOf(r.dataIndex || '') === -1
        )
      }
    })
    return columns
  }
  getFooter = (totalDisplayed: number) => {
    return (
      <div>
        <Button
          className="eventSignupTableFooterDownloadButton"
          type="link"
          onClick={this.copyEmails}
        >
          Copy Emails
        </Button>
        {!this.props.isWaitlist && !this.state.selectedSignup ? (
          <Button
            className="eventSignupTableFooterDownloadButton"
            type="link"
            onClick={(e) => this.setShowCarAllocations(true)}
          >
            Random Car Allocations
          </Button>
        ) : null}
        <Button
          className="eventSignupTableFooterDownloadButton"
          type="link"
          onClick={this.downloadCsv}
        >
          Download .csv
        </Button>
        <p className="eventSignupsTableFooterText">
          Total: {totalDisplayed} / Limit: {this.props.limit || 'None'}
        </p>
      </div>
    )
  }
  copyText = (text: string | undefined) => {
    if (text) dataUtil.copyText(text)
  }
  onMemberSelect = (member: TableRow) => {
    this.setState({ ...this.state, selectedSignup: member })
  }
  exitSelectedSignup = () => {
    this.setState({ ...this.state, selectedSignup: null })
  }
  sortTableKeys = (a: keyof TableRow, b: keyof TableRow) => {
    const keyMap: Record<keyof TableRow, number> = {
      displayName: 100,
      email: 90,
      phoneNumber: 85,
      confirmed: 80,
      displayTime: 50,
      daysStaying: 45,
      dietaryRequirements: 40,
      medicalInfo: 35,
      hasFirstAid: 33,
      driverLicenseClass: 30,
      seatsInCar: 20,
      carModel: 15,
      insuranceDescription: 12,
      timeSignedUpMs: 10,
      key: 5,
      ecName: 5,
      ecPhoneNumber: 5,
      ecRelation: 5,
      name: 5,
    }
    return keyMap[a] > keyMap[b] ? -1 : 1
  }
  copyEmails = () => {
    dataUtil.copyText(
      Object.keys(this.props.signupData)
        .filter((key) => {
          if (this.state.selectedRows.length) {
            return this.state.selectedRows.find((r) => r.key === key)
          }
          return true
        })
        .map((key) => this.props.signupData[key].email)
        .join('\n')
    )
  }
  downloadCsv = () => {
    let header = false
    let csvStr = ''
    const fileName = `${this.props.urlPath}_${
      this.props.isWaitlist ? 'waitlist' : 'signups'
    }`
    const csvRows = this.state.selectedRows.length
      ? this.state.selectedRows
      : this.state.rows
    csvRows
      .sort((a, b) => a.timeSignedUpMs - b.timeSignedUpMs)
      .forEach((row) => {
        if (!header) {
          header = true
          csvStr +=
            (Object.keys(row) as (keyof TableRow)[])
              .sort(this.sortTableKeys)
              .map((k) => this.keyNameMap[k])
              .join(',') + '\n'
        }
        csvStr +=
          (Object.keys(row) as (keyof TableRow)[])
            .sort(this.sortTableKeys)
            .map((key) => row[key])
            .join(',') + '\n'
      })
    dataUtil.downloadCsv(fileName, csvStr)
  }
  downloadCarCsv = () => {
    const allocations = this.state.randomCars
    let allCars: string[][] = []
    let maxLength = 0
    allocations.forEach((car) => {
      const occupants = [car.carOwner]
        .concat(car.carOwner === car.driver ? [] : [car.driver])
        .concat(car.passengers)
      allCars.push(occupants)
      maxLength = Math.max(occupants.length, maxLength)
    })
    allCars = allCars.map((row) => {
      const diff = maxLength - row.length
      return diff ? row.concat(Array(diff).join('.').split('.')) : row
    })
    const csvStr =
      ',' +
      allocations.map((c, idx) => `Car ${idx + 1}`).join(',') +
      '\n' +
      dataUtil
        .transpose(allCars)
        .map((row, idx) => (idx === 0 ? 'Owner' : '') + ',' + row.join(','))
        .join('\n')
    dataUtil.downloadCsv('car_allocations', csvStr)
  }
  onTableChange = (
    pagination: any,
    filter: Record<string, (string | number | boolean)[] | null>,
    sorter: any,
    dataSource: TableCurrentDataSource<TableRow>,
    ...extra: any
  ) => {
    this.setState({
      ...this.state,
      selectedRows: dataSource.currentDataSource,
    })
  }
  render() {
    if (window.innerWidth < 600) {
      const curSelected = this.state.selectedSignup
      return (
        <div>
          <Select
            className="eventSignupSelect"
            placeholder="Select Member"
            onChange={this.onSelectSignup}
          >
            {this.state.rows
              .sort((a, b) => b.timeSignedUpMs - a.timeSignedUpMs)
              .map((signup: TableRow) => {
                return (
                  <Select.Option key={signup.key} value={signup.key}>
                    <div className="eventSignupSelectName">
                      {signup.displayName}
                    </div>
                    <div className="eventSignupSelectTime">
                      {signup.displayTime}
                    </div>
                    {signup.confirmed ? (
                      <Tag className="eventSignupSelectPaidTag" color="success">
                        Paid
                      </Tag>
                    ) : null}
                  </Select.Option>
                )
              })}
          </Select>
          {curSelected ? (
            <div className="eventSignupMemberInfo">
              <EventSignupDetails
                isWaitlist={this.props.isWaitlist}
                eventId={this.props.eventId}
                selectedRow={curSelected}
              ></EventSignupDetails>
              <Button
                onClick={(e) => this.onMoveClick(curSelected?.key || '')}
                disabled={!curSelected}
              >
                Move to {this.props.isWaitlist ? ' signups' : ' waitlist'}
              </Button>
              <Button
                onClick={(e) => this.deleteMember(curSelected?.key || '')}
                disabled={!curSelected}
                type="link"
              >
                Delete
              </Button>
            </div>
          ) : null}
        </div>
      )
    }
    return (
      <div>
        <div
          className={`eventSignupTableContainer ${
            this.state.selectedSignup ? 'eventSignupTableContainerNarrow' : null
          }`}
        >
          <Drawer
            visible={this.state.showCarAllocs}
            title="Random Car Allocations"
            getContainer={false}
            placement="right"
            onClose={(e) => this.setShowCarAllocations(false)}
            width={600}
            style={{ position: 'absolute' }}
          >
            <div className="carDrawerText">
              <p>
                Each car group has to have at least one owner and one driver on
                their full. An owner with a restricted license will have a
                driver with a full license in their group. Click New Allocation
                to generate new groups!
              </p>
              <Button
                icon={<ReloadOutlined />}
                onClick={(e) => this.setShowCarAllocations(true)}
              >
                New Allocation
              </Button>
              <Button type="link" onClick={this.downloadCarCsv}>
                Download .csv
              </Button>
              <Checkbox onChange={(e) => this.setMax4Seats(e.target.checked)}>
                Limit 4 People/Car
              </Checkbox>
            </div>
            {this.state.randomCars.map((car, idx) => {
              return (
                <div key={idx}>
                  <h3>Car {idx + 1}</h3>
                  {car.carOwner === car.driver ? (
                    <p className="carAllocationListLine">
                      Owner/Driver: {car.carOwner}
                    </p>
                  ) : (
                    <p className="carAllocationListLine">
                      Owner: {car.carOwner}, Driver: {car.driver}
                    </p>
                  )}
                  <p className="carAllocationListLine">
                    Passengers: {car.passengers.join(', ')}
                  </p>
                </div>
              )
            })}
          </Drawer>
          <Table
            size="small"
            pagination={{
              defaultPageSize: 10,
              showSizeChanger: true,
              pageSizeOptions: ['10', '20', '50'],
              showTotal: this.getFooter,
            }}
            onChange={this.onTableChange}
            bordered
            loading={this.state.tableLoading}
            columns={this.getColumns()}
            dataSource={this.state.rows}
            scroll={{ y: 400 }}
          ></Table>
        </div>
        {this.state.selectedSignup ? (
          <div className="eventSignupTableContainerNarrow">
            <div className="eventSignupDetailsHeader">
              <h2 className="eventSignupViewTitle">
                {this.state.selectedSignup.displayName}
              </h2>
              <div className="eventSignupDetailsCloseIcon">
                <CloseCircleOutlined onClick={this.exitSelectedSignup} />
              </div>
            </div>
            <EventSignupDetails
              isWaitlist={this.props.isWaitlist}
              eventId={this.props.eventId}
              selectedRow={this.state.selectedSignup}
            ></EventSignupDetails>
          </div>
        ) : null}
      </div>
    )
  }
}
