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
import { useEffect, useState } from 'react'
import { copyText } from '../../../lib/utils'
import {
  confirmMemberEventSignup,
  removeMemberFromEvent,
  signUpToEvent,
} from '../../../services/db'
import { AumtEventSignup, LicenseClasses, TableRow } from '../../../types'
import EventSignupDetails from './EventSignupDetails'
import './EventSignupTable.css'

interface EventSignupTableProps {
  signupData: AumtEventSignup
  urlPath: string
  eventId: string
  isWaitlist: boolean
  isCamp: boolean
  limit: number | null
}

type CarAllocation = {
  driver: string
  carOwner: string
  passengers: string[]
  seats: number
}

function downloadCsv(fileName: string, text: string) {
  const blob = new Blob([text])
  const a = document.createElement('a')
  a.href = URL.createObjectURL(blob)
  a.download = fileName + '.csv'
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
}

export default function EventSignupTable(props: EventSignupTableProps) {
  const keyNameMap: Record<keyof TableRow, string> = {
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

  const [rows, setRows] = useState<TableRow[]>([])
  const [selectedRows, setSelectedRows] = useState<TableRow[]>([])
  const [columns, setColumns] = useState<ColumnsType<TableRow>>([])
  const [tableLoading, setTableLoading] = useState(false)
  const [selectedSignup, setSelectedSignup] = useState<TableRow | null>(null)
  const [showCarAllocs, setShowCarAllocs] = useState(false)
  const [randomCars, setRandomCars] = useState<CarAllocation[]>([])
  const [max4Seats, setMax4Seats] = useState(false)

  useEffect(() => {
    setColumns(getColumns())
    setRows(getRows())
  }, [getColumns, getRows])

  function updateConfirmed(row: TableRow | null, newConfirmed: boolean) {
    if (!row) {
      return
    }
    confirmMemberEventSignup(
      props.eventId,
      row.key,
      newConfirmed,
      props.isWaitlist
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
  function deleteMember(key: string) {
    if (!key) return
    removeMemberFromEvent(key, props.eventId, props.isWaitlist)
      .then(() => {
        notification.success({
          message: `Removed from ${props.isWaitlist ? 'waitlist' : 'signups'}`,
        })
      })
      .catch((err) => {
        notification.error({
          message: `Error removing from event: ${err.toString()}`,
        })
      })
  }
  function onMoveClick(key: string) {
    if (!key) return
    setTableLoading(true)
    const data = props.signupData[key]
    signUpToEvent(props.eventId, key, data, !props.isWaitlist)
      .then(() => {
        return removeMemberFromEvent(key, props.eventId, props.isWaitlist)
      })
      .then(() => {
        notification.success({
          message: `Successfully moved to ${
            props.isWaitlist ? 'signups' : 'waitlist'
          }`,
        })
      })
      .catch((err) => {
        notification.error({
          message: `Error moving member: ${err.toString()}`,
        })
      })
      .finally(() => {
        setTableLoading(false)
      })
  }
  function onSelectSignup(key: string) {
    const member = rows.find((r) => r.key === key)
    if (member) {
      setSelectedSignup(member)
    }
  }

  function setShowCarAllocations(showCarAllocs: boolean) {
    let randomCars: CarAllocation[] = []
    if (showCarAllocs) {
      try {
        randomCars = dataUtil.getRandomCars(rows, max4Seats)
      } catch (e) {
        notification.error({
          message: 'Could not generate allocations: ' + e.toString(),
        })
        return
      }
    }
    setShowCarAllocs(showCarAllocs)
    setRandomCars(randomCars)
  }

  function getRows() {
    return Object.keys(props.signupData).map((uid: string) => {
      const signup = props.signupData[uid]
      return Object.assign(signup, {
        key: uid,
        displayTime: moment(new Date(signup.timeSignedUpMs)).format(
          'MMM DD HH:mm'
        ),
      })
    })
  }

  function getColumns() {
    const columns: ColumnsType<TableRow> = [
      {
        title: 'Name',
        dataIndex: 'displayName',
        render: (name: string, record: TableRow) => {
          return (
            <Tooltip placement="right" title="View Details">
              <span
                className="eventTableNameLink"
                onClick={(e) => onSelectSignup(record.key)}
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
                  <CopyOutlined onClick={(e) => copyText(email)} />
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
                      updateConfirmed(record, newConfirmed === 'Yes')
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
              {props.isWaitlist ? (
                <Button onClick={(e) => onMoveClick(record.key)}>
                  Move
                  <ArrowLeftOutlined />
                </Button>
              ) : (
                <Button onClick={(e) => onMoveClick(record.key)}>
                  <ArrowRightOutlined />
                  Move
                </Button>
              )}
              <Button type="link" onClick={(e) => deleteMember(record.key)}>
                Delete
              </Button>
            </span>
          )
        },
      },
    ].filter((r) => {
      if (props.isCamp) {
        return selectedSignup
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

  function getFooter(totalDisplayed: number) {
    return (
      <div>
        <Button
          className="eventSignupTableFooterDownloadButton"
          type="link"
          onClick={copyEmails}
        >
          Copy Emails
        </Button>
        {!props.isWaitlist && !selectedSignup ? (
          <Button
            className="eventSignupTableFooterDownloadButton"
            type="link"
            onClick={(e) => setShowCarAllocations(true)}
          >
            Random Car Allocations
          </Button>
        ) : null}
        <Button
          className="eventSignupTableFooterDownloadButton"
          type="link"
          onClick={downloadCsvInternal}
        >
          Download .csv
        </Button>
        <p className="eventSignupsTableFooterText">
          Total: {totalDisplayed} / Limit: {props.limit || 'None'}
        </p>
      </div>
    )
  }
  function onMemberSelect(member: TableRow) {
    setSelectedSignup(member)
  }
  function exitSelectedSignup() {
    setSelectedSignup(null)
  }
  function sortTableKeys(a: keyof TableRow, b: keyof TableRow) {
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
  function copyEmails() {
    copyText(
      Object.keys(props.signupData)
        .filter((key) => {
          if (selectedRows.length) {
            return selectedRows.find((r) => r.key === key)
          }
          return true
        })
        .map((key) => props.signupData[key].email)
        .join('\n')
    )
  }
  function downloadCsvInternal() {
    let header = false
    let csvStr = ''
    const fileName = `${props.urlPath}_${
      props.isWaitlist ? 'waitlist' : 'signups'
    }`
    const csvRows = selectedRows.length ? selectedRows : rows
    csvRows
      .sort((a, b) => a.timeSignedUpMs - b.timeSignedUpMs)
      .forEach((row) => {
        if (!header) {
          header = true
          csvStr +=
            (Object.keys(row) as (keyof TableRow)[])
              .sort(sortTableKeys)
              .map((k) => keyNameMap[k])
              .join(',') + '\n'
        }
        csvStr +=
          (Object.keys(row) as (keyof TableRow)[])
            .sort(sortTableKeys)
            .map((key) => row[key])
            .join(',') + '\n'
      })
    downloadCsv(fileName, csvStr)
  }
  function downloadCarCsv() {
    const allocations = randomCars
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
    downloadCsv('car_allocations', csvStr)
  }
  function onTableChange(
    pagination: any,
    filter: Record<string, (string | number | boolean)[] | null>,
    sorter: any,
    dataSource: TableCurrentDataSource<TableRow>,
    ...extra: any
  ) {
    setSelectedRows(dataSource.currentDataSource)
  }

  if (window.innerWidth < 600) {
    const curSelected = selectedSignup
    return (
      <div>
        <Select
          className="eventSignupSelect"
          placeholder="Select Member"
          onChange={onSelectSignup}
        >
          {rows
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
              isWaitlist={props.isWaitlist}
              eventId={props.eventId}
              selectedRow={curSelected}
            />
            <Button
              onClick={(e) => onMoveClick(curSelected?.key || '')}
              disabled={!curSelected}
            >
              Move to {props.isWaitlist ? ' signups' : ' waitlist'}
            </Button>
            <Button
              onClick={(e) => deleteMember(curSelected?.key || '')}
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
          selectedSignup ? 'eventSignupTableContainerNarrow' : null
        }`}
      >
        <Drawer
          visible={showCarAllocs}
          title="Random Car Allocations"
          getContainer={false}
          placement="right"
          onClose={(e) => setShowCarAllocations(false)}
          width={600}
          style={{ position: 'absolute' }}
        >
          <div className="carDrawerText">
            <p>
              Each car group has to have at least one owner and one driver on
              their full. An owner with a restricted license will have a driver
              with a full license in their group. Click New Allocation to
              generate new groups!
            </p>
            <Button
              icon={<ReloadOutlined />}
              onClick={(e) => setShowCarAllocations(true)}
            >
              New Allocation
            </Button>
            <Button type="link" onClick={downloadCarCsv}>
              Download .csv
            </Button>
            <Checkbox onChange={(e) => setMax4Seats(e.target.checked)}>
              Limit 4 People/Car
            </Checkbox>
          </div>
          {randomCars.map((car, idx) => {
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
            showTotal: getFooter,
          }}
          onChange={onTableChange}
          bordered
          loading={tableLoading}
          columns={columns}
          dataSource={rows}
          scroll={{ y: 400 }}
        ></Table>
      </div>
      {selectedSignup ? (
        <div className="eventSignupTableContainerNarrow">
          <div className="eventSignupDetailsHeader">
            <h2 className="eventSignupViewTitle">
              {selectedSignup.displayName}
            </h2>
            <div className="eventSignupDetailsCloseIcon">
              <CloseCircleOutlined onClick={exitSelectedSignup} />
            </div>
          </div>
          <EventSignupDetails
            isWaitlist={props.isWaitlist}
            eventId={props.eventId}
            selectedRow={selectedSignup}
          />
        </div>
      ) : null}
    </div>
  )
}
