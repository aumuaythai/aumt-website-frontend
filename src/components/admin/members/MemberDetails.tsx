import { CopyOutlined } from '@ant-design/icons'
import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { Button, Input, notification, Popconfirm, Radio, Tooltip } from 'antd'
import { Controller, FieldErrors, useForm } from 'react-hook-form'
import z from 'zod'
import DataFormatterUtil from '../../../services/data.util'
import { setMember } from '../../../services/db'
import { AumtMember } from '../../../types'
import type { TableDataLine } from './MemberDashboard'

interface MemberDetailsProps {
  member: TableDataLine
  onExit: () => void
}

const memberDetailsSchema = z.object({
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  preferredName: z.string().optional(),
  email: z.email().min(1, 'Email is required'),
  ethnicity: z.string().min(1, 'Ethnicity is required'),
  gender: z.string().min(1, 'Gender is required'),
  membership: z.enum(['S1', 'S2', 'FY', 'SS']),
  paid: z.enum(['Yes', 'No']),
  paymentType: z.enum(['Cash', 'Bank Transfer', 'Other']),
  isReturningMember: z.enum(['Yes', 'No']),
  interestedInCamp: z.enum(['Yes', 'No']),
  isUoAStudent: z.enum(['Yes', 'No']),
  upi: z.string().optional(),
  studentId: z.string().optional(),
  notes: z.string().optional(),
  EmergencyContactName: z.string().min(1, 'Emergency contact name is required'),
  EmergencyContactNumber: z
    .string()
    .min(1, 'Emergency contact number is required'),
  EmergencyContactRelationship: z
    .string()
    .min(1, 'Emergency contact relationship is required'),
})

type MD = z.infer<typeof memberDetailsSchema>

export default function MemberDetails({ member, onExit }: MemberDetailsProps) {
  const queryClient = useQueryClient()

  const updateMember = useMutation({
    mutationFn: (data: AumtMember) => setMember(member.key, data),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['members'] })
      notification.success({ message: 'Member updated' })
    },
    onError: (error) => {
      notification.error({
        message: 'Error updating member: ' + error.toString(),
      })
    },
  })

  const removeMember = useMutation({
    mutationFn: () => removeMember(member.key),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['members'] })
      notification.success({ message: 'Member removed' })
    },
    onError: (error) => {
      notification.error({
        message: 'Error removing member: ' + error.toString(),
      })
    },
  })

  const { control, handleSubmit, watch } = useForm<MD>({
    resolver: zodResolver(memberDetailsSchema),
    defaultValues: {
      firstName: member.firstName,
      lastName: member.lastName,
      preferredName: member.preferredName,
      email: member.email,
      ethnicity: member.ethnicity,
      gender: member.gender,
      membership: member.membership,
      paid: member.paid,
      paymentType: member.paymentType,
      isReturningMember: member.isReturningMember,
      interestedInCamp: member.interestedInCamp,
      isUoAStudent: member.isUoAStudent,
      upi: member.upi,
      studentId: member.studentId,
      notes: member.notes,
      EmergencyContactName: member.EmergencyContactName,
      EmergencyContactNumber: member.EmergencyContactNumber,
      EmergencyContactRelationship: member.EmergencyContactRelationship,
    },
    values: { ...member },
  })

  function handleUpdateMember(data: MD) {
    if (data.email !== member.email) {
      notification.open({
        message:
          'Reminder: If you change the email here, also change it in Firebase by using the Admin SDK (see firebase user management guide)',
      })
    }

    updateMember.mutate({
      ...data,
      timeJoinedMs: member.timeJoinedMs,
      initialExperience: '',
    } as AumtMember)
  }

  function handleRemoveMember() {
    removeMember.mutate()
  }

  function onInvalid(errors: FieldErrors<MD>) {
    console.log(errors)
  }

  function copyText(text: string) {
    DataFormatterUtil.copyText(text)
  }

  const isMutating = updateMember.isPending || removeMember.isPending

  const isUoaStudent = watch('isUoAStudent')

  return (
    <div>
      <h1 className="text-xl">{member.tableName}</h1>
      <div className="flex flex-col gap-y-4 mt-4">
        <div className="flex flex-col gap-y-1">
          <h3>Contact</h3>
          <span>First</span>
          <Controller
            name="firstName"
            control={control}
            render={({ field: { value, onChange } }) => (
              <Input value={value} onChange={onChange} />
            )}
          />
          <span className="text-gray-400">Last</span>
          <Controller
            name="lastName"
            control={control}
            render={({ field: { value, onChange } }) => (
              <Input value={value} onChange={onChange} />
            )}
          />
          <span>Preferred: </span>
          <Controller
            name="preferredName"
            control={control}
            render={({ field: { value, onChange } }) => (
              <Input value={value} onChange={onChange} />
            )}
          />
          <span>Email: </span>
          <Controller
            name="email"
            control={control}
            render={({ field: { value, onChange } }) => (
              <Input
                value={value}
                onChange={onChange}
                suffix={
                  <Tooltip title="Copy">
                    <CopyOutlined onClick={(e) => copyText(value)} />
                  </Tooltip>
                }
              />
            )}
          />
        </div>
        <div className="flex flex-col gap-y-1">
          <h3>Membership</h3>
          <div>Term: </div>
          <Controller
            name="membership"
            control={control}
            render={({ field: { value, onChange } }) => (
              <Radio.Group value={value} onChange={onChange}>
                <Radio.Button value="S1">S1</Radio.Button>
                <Radio.Button value="S2">S2</Radio.Button>
                <Radio.Button value="FY">FY</Radio.Button>
                <Radio.Button value="SS">SS</Radio.Button>
              </Radio.Group>
            )}
          />
          <div>Paid: </div>
          <Controller
            name="paid"
            control={control}
            render={({ field: { value, onChange } }) => (
              <Radio.Group value={value} onChange={onChange}>
                <Radio.Button value="Yes">Yes</Radio.Button>
                <Radio.Button value="No">No</Radio.Button>
              </Radio.Group>
            )}
          />
          <div>Payment: </div>
          <Controller
            name="paymentType"
            control={control}
            render={({ field: { value, onChange } }) => (
              <Radio.Group value={value} onChange={onChange}>
                <Radio.Button value="Cash">Cash</Radio.Button>
                <Radio.Button value="Bank Transfer">Transfer</Radio.Button>
                <Radio.Button value="Other">Other</Radio.Button>
              </Radio.Group>
            )}
          />
          <div>Returning: </div>
          <Controller
            name="isReturningMember"
            control={control}
            render={({ field: { value, onChange } }) => (
              <Radio.Group value={value} onChange={onChange}>
                <Radio.Button value="Yes">Yes</Radio.Button>
                <Radio.Button value="No">No</Radio.Button>
              </Radio.Group>
            )}
          />
        </div>
        <div className="flex flex-col gap-y-1">
          <h3>Details</h3>
          <div>Interested in Camp: </div>
          <Controller
            name="interestedInCamp"
            control={control}
            render={({ field: { value, onChange } }) => (
              <Radio.Group value={value} onChange={onChange}>
                <Radio.Button value="Yes">Yes</Radio.Button>
                <Radio.Button value="No">No</Radio.Button>
              </Radio.Group>
            )}
          />
          <div>UoA: </div>
          <Controller
            name="isUoAStudent"
            control={control}
            render={({ field: { value, onChange } }) => (
              <Radio.Group value={value} onChange={onChange}>
                <Radio.Button value="Yes">Yes</Radio.Button>
                <Radio.Button value="No">No</Radio.Button>
              </Radio.Group>
            )}
          />
          {isUoaStudent === 'Yes' && (
            <>
              <div>UPI: </div>
              <Controller
                name="upi"
                control={control}
                render={({ field: { value, onChange } }) => (
                  <Input
                    suffix={
                      <Tooltip title="Copy">
                        <CopyOutlined onClick={(e) => copyText(value ?? '')} />
                      </Tooltip>
                    }
                    value={value}
                    onChange={onChange}
                  />
                )}
              />
              <div>Student ID: </div>
              <Controller
                name="studentId"
                control={control}
                render={({ field: { value, onChange } }) => (
                  <Input
                    suffix={
                      <Tooltip title="Copy">
                        <CopyOutlined onClick={(e) => copyText(value ?? '')} />
                      </Tooltip>
                    }
                    value={value}
                    onChange={onChange}
                  />
                )}
              />
            </>
          )}
          <span>Notes: </span>
          <Controller
            name="notes"
            control={control}
            render={({ field: { value, onChange } }) => (
              <Input.TextArea
                onChange={onChange}
                placeholder="Admin Notes"
                autoSize={{ minRows: 2, maxRows: 2 }}
                value={value}
              />
            )}
          />
        </div>
        <div className="flex flex-col gap-y-1">
          <h3>Emergency Contact</h3>
          <span>Name: </span>
          <Controller
            name="EmergencyContactName"
            control={control}
            render={({ field: { value, onChange } }) => (
              <Input value={value} onChange={onChange} />
            )}
          />
          <span>Number: </span>
          <Controller
            name="EmergencyContactNumber"
            control={control}
            render={({ field: { value, onChange } }) => (
              <Input
                value={value}
                onChange={onChange}
                suffix={
                  <Tooltip title="Copy">
                    <CopyOutlined onClick={(e) => copyText(value)} />
                  </Tooltip>
                }
              />
            )}
          />
          <span>Relation: </span>
          <Controller
            name="EmergencyContactRelationship"
            control={control}
            render={({ field: { value, onChange } }) => (
              <Input value={value} onChange={onChange} />
            )}
          />
        </div>
        <div className="flex gap-x-2">
          <Button
            type="primary"
            loading={isMutating}
            onClick={handleSubmit(handleUpdateMember)}
          >
            Save {member.firstName}
          </Button>
          <Popconfirm
            title={`Confirm delete ${member.firstName}? RIP`}
            onConfirm={handleRemoveMember}
          >
            <Button danger type="primary" loading={isMutating}>
              Remove {member.firstName}
            </Button>
          </Popconfirm>
        </div>
      </div>
    </div>
  )
}
