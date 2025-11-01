import { PlusOutlined } from '@ant-design/icons'
import { useQuery } from '@tanstack/react-query'
import { Switch as AntSwitch, Button, Input, Modal, Spin, Table } from 'antd'
import { ColumnType } from 'antd/lib/table'
import { useState } from 'react'
import { Link } from 'react-router'
import { getAllMembers } from '../../../services/db'
import { AumtMember } from '../../../types'
import MemberDetails from './MemberDetails'

export type TableDataLine = AumtMember & { key: string; tableName: string }
export type TableColumn = ColumnType<TableDataLine>

export default function MemberDashboard() {
  const [selectedMember, setSelectedMember] = useState<TableDataLine | null>(
    null
  )
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
        <Input
          placeholder="Search names or emails"
          className="!w-80"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <Link to="/admin/members/add">
          <Button type="primary" icon={<PlusOutlined />}>
            Add Member
          </Button>
        </Link>
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
    </div>
  )
}
