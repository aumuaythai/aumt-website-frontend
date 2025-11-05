import { getDisplayName } from '@/lib/utils'
import { useMembers } from '@/services/members'
import { PlusOutlined } from '@ant-design/icons'
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
    null
  )
  const [search, setSearch] = useState('')
  const { data: members, isPending: isLoadingMembers } = useMembers()

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
      sorter: (a: TableDataLine, b: TableDataLine) => (a.paid ? 1 : -1),
    },
  ]

  return (
    <div className="flex-1 p-4 h-full">
      <div className="flex justify-between mb-2">
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
        {selectedMember && <MemberDetails member={selectedMember} />}
      </Modal>
    </div>
  )
}
