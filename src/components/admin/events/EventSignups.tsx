import { generateMockUid } from '@/lib/utils'
import {
  useAddMemberToEvent,
  useEvent,
  useRemoveMemberFromEvent,
} from '@/services/events'
import { MailOutlined, PlusOutlined, UserOutlined } from '@ant-design/icons'
import { zodResolver } from '@hookform/resolvers/zod'
import { Button, Form, Input, Modal, Spin, Table } from 'antd'
import { ColumnsType } from 'antd/lib/table'
import { ArrowLeft, LoaderCircle, Plus, Trash2 } from 'lucide-react'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { FormItem } from 'react-hook-form-antd'
import { Link, useParams } from 'react-router'
import z from 'zod'

const addMemberSchema = z.object({
  name: z.string().min(1),
  email: z.email(),
})

type AddMemberForm = z.infer<typeof addMemberSchema>

export default function EventSignups() {
  const [isAddMemberModalOpen, setIsAddMemberModalOpen] = useState(false)

  const { eventId } = useParams()
  const { data: event, isPending: isLoadingEvent } = useEvent(eventId!)
  const addMember = useAddMemberToEvent()
  const removeMember = useRemoveMemberFromEvent()

  const { control, reset, handleSubmit } = useForm<AddMemberForm>({
    resolver: zodResolver(addMemberSchema),
  })

  if (isLoadingEvent) {
    return (
      <div>
        <Spin />
      </div>
    )
  }

  if (!event?.signups?.members) {
    return <div>No event with signups found</div>
  }

  const dataSource = Object.entries(event.signups.members).map(
    ([userId, signup]) => ({
      key: userId,
      name: signup.displayName,
      email: signup.email,
      timeSignedUpMs: signup.timeSignedUpMs,
      confirmed: signup.confirmed,
    })
  )

  const columns: ColumnsType = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
    },
    {
      title: 'Paid?',
      dataIndex: 'confirmed',
      key: 'confirmed',
      render: (confirmed: boolean) => {
        return confirmed ? 'Yes' : 'No'
      },
    },
    {
      title: 'Remove',
      render: (_, record) => {
        return (
          <button
            className="size-4 flex w-full justify-center text-gray-400 cursor-pointer hover:text-red-600 transition-colors"
            onClick={() => handleRemoveMember(record.key)}
          >
            {removeMember.isPending ? (
              <LoaderCircle className="size-full animate-spin text-blue-500" />
            ) : (
              <Trash2 className="size-4" />
            )}
          </button>
        )
      },
      width: '80px',
    },
  ]

  async function handleAddMember(data: AddMemberForm) {
    await addMember.mutateAsync({
      eventId: eventId!,
      userId: generateMockUid(),
      signupData: {
        displayName: data.name,
        email: data.email,
        confirmed: false,
        timeSignedUpMs: new Date().getTime(),
      },
    })
    setIsAddMemberModalOpen(false)
    reset()
  }

  async function handleRemoveMember(userId: string) {
    await removeMember.mutateAsync({
      eventId: eventId!,
      userId,
    })
  }

  return (
    <>
      <main className="flex-1 p-4 h-full">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-x-2">
            <Link to={`/admin/events`}>
              <ArrowLeft className="size-5" />
            </Link>
            <h1>{event.title}</h1>
          </div>
          <Button
            icon={<PlusOutlined />}
            onClick={() => setIsAddMemberModalOpen(true)}
          >
            Add Member
          </Button>
        </div>
        <Table
          dataSource={dataSource}
          columns={columns}
          size="middle"
          bordered
          className="mt-4"
        />
      </main>

      <Modal
        open={isAddMemberModalOpen}
        footer={null}
        onCancel={() => setIsAddMemberModalOpen(false)}
      >
        <Form layout="vertical" onFinish={handleSubmit(handleAddMember)}>
          <FormItem label="Name" name="name" control={control}>
            <Input prefix={<UserOutlined />} />
          </FormItem>
          <FormItem label="Email" name="email" control={control}>
            <Input prefix={<MailOutlined />} />
          </FormItem>
          <Button
            type="primary"
            htmlType="submit"
            loading={addMember.isPending}
          >
            Add Member
          </Button>
        </Form>
      </Modal>
    </>
  )
}
