import { getDisplayName } from '@/lib/utils'
import { useMembersWithUids } from '@/services/members'
import { DownloadOutlined, PlusOutlined } from '@ant-design/icons'
import { Button, Input, Modal, Spin, Table } from 'antd'
import { ColumnType } from 'antd/lib/table'
import { useState } from 'react'
import { Link } from 'react-router'
import { Member } from '../../../types'
import MemberDetails from './MemberDetails'

export type TableDataLine = Member & { key: string; tableName: string }
export type TableColumn = ColumnType<TableDataLine>

export default function MemberDashboard() {
  const [selectedMember, setSelectedMember] = useState<TableDataLine | null>(
    null,
  )
  const [search, setSearch] = useState('')
  const { data: members, isPending: isLoadingMembers } = useMembersWithUids()

  if (isLoadingMembers) {
    return (
      <div>
        Retrieving Members <Spin />
      </div>
    )
  }

  const dataSource: TableDataLine[] = []
  if (members) {
    Object.entries(members).forEach(([uid, member]) => {
      const name = getDisplayName(member)

      if (
        search &&
        !name.toLowerCase().includes(search) &&
        !member.email.toLowerCase().includes(search)
      ) {
        return
      }

      dataSource.push({
        key: uid,
        ...member,
        tableName: name,
      })
    })
  }

  const exportToCsv = () => {
    if (!members) return

    const memberEntries = Object.entries(members)
    if (memberEntries.length === 0) return

    // Define consistent column order
    const memberKeys: (keyof Member)[] = [
      'firstName',
      'lastName',
      'preferredName',
      'email',
      'ethnicity',
      'gender',
      'membership',
      'paymentType',
      'isReturningMember',
      'paid',
      'timeJoinedMs',
      'upi',
      'studentId',
      'isUoAStudent',
      'initialExperience',
      'notes',
      'emergencyContactName',
      'emergencyContactNumber',
      'emergencyContactRelationship',
    ]
    const headers = ['uid', ...memberKeys]

    // Build CSV rows
    const csvRows: string[] = []
    csvRows.push(headers.join(','))

    for (const [uid, member] of memberEntries) {
      const values: string[] = [`"${uid}"`]

      for (const key of memberKeys) {
        const value = member[key]
        if (value === null || value === undefined) {
          values.push('')
        } else if (typeof value === 'boolean') {
          values.push(value ? 'Yes' : 'No')
        } else {
          values.push(`"${String(value).replace(/"/g, '""')}"`)
        }
      }

      csvRows.push(values.join(','))
    }

    // Download the CSV
    const blob = new Blob([csvRows.join('\n')], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `members-${new Date().toISOString().split('T')[0]}.csv`
    link.click()
    URL.revokeObjectURL(url)
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
      render: (paid: boolean) => (paid ? 'Yes' : 'No'),
      sorter: (a: TableDataLine, b: TableDataLine) => (a.paid ? 1 : -1),
    },
  ]

  return (
    <div className="flex-1 p-4 h-full">
      <div className="flex justify-between mb-4">
        <Input
          placeholder="Search names or emails"
          className="!w-80"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <div className="flex gap-2">
          <Button icon={<DownloadOutlined />} onClick={exportToCsv}>
            Export CSV
          </Button>
          <Link to="/admin/members/add">
            <Button type="primary" icon={<PlusOutlined />}>
              Add Member
            </Button>
          </Link>
        </div>
      </div>

      <Table
        dataSource={dataSource}
        columns={columns}
        bordered
        size="middle"
        tableLayout="fixed"
        pagination={{ pageSize: 20 }}
        rowClassName="cursor-pointer"
        onRow={(record) => ({
          onClick: () => setSelectedMember(record),
        })}
      />

      <Modal
        open={!!selectedMember}
        footer={null}
        classNames={{ container: 'max-h-160 overflow-y-auto' }}
        onCancel={() => setSelectedMember(null)}
      >
        {selectedMember && <MemberDetails member={selectedMember} />}
      </Modal>
    </div>
  )
}
