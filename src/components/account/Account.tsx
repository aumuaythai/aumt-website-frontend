import PaymentInstructions from '@/components/utility/PaymentInstructions'
import { useAuth } from '@/context/AuthProvider'
import { useConfig } from '@/context/ClubConfigProvider'
import { useUpdateMember } from '@/services/member'
import { Member } from '@/types'
import {
  ETHNICITIES,
  memberSchema,
  MEMBERSHIP_PERIOD_LONG,
} from '@/types/Member'
import { zodResolver } from '@hookform/resolvers/zod'
import { Button, Input, List, notification, Radio, Select, Spin } from 'antd'
import { ReactNode, useState } from 'react'
import {
  Control,
  Controller,
  FieldErrors,
  useForm,
  UseFormWatch,
} from 'react-hook-form'
import z from 'zod'

const accountSchema = memberSchema.omit({
  email: true,
  isReturningMember: true,
  paid: true,
  timeJoinedMs: true,
  initialExperience: true,
  notes: true,
})

type Account = z.infer<typeof accountSchema>

export default function Account() {
  const { user, userId } = useAuth()
  const updateMember = useUpdateMember()

  const {
    control,
    watch,
    handleSubmit,
    formState: { isSubmitting: saving },
  } = useForm<Account>({
    defaultValues: { ...user },
    resolver: zodResolver(accountSchema),
  })

  async function onSave(e?: React.BaseSyntheticEvent) {
    await handleSubmit(onValid, onInvalid)(e)
  }

  async function onValid(data: Account) {
    if (!user) {
      return
    }

    const updatedMember: Member = {
      ...user,
      ...data,
    }

    await updateMember.mutateAsync({ userId, member: updatedMember })
  }

  function onInvalid(errors: FieldErrors<Account>) {
    const firstError = Object.keys(errors)[0]
    if (firstError) {
      notification.error({ message: errors[firstError]?.message })
    }
  }

  if (!user) {
    return (
      <div>
        Loading account details <Spin />
      </div>
    )
  }

  return (
    <form
      className="max-w-[640px] mx-auto text-left p-6"
      onSubmit={handleSubmit(onValid, onInvalid)}
    >
      <h1 className="text-2xl font-bold">Account Settings</h1>

      <MembershipSection saving={saving} control={control} onSave={onSave} />
      <PersonalSection saving={saving} control={control} onSave={onSave} />
      <UniversitySection
        saving={saving}
        control={control}
        watch={watch}
        onSave={onSave}
      />
      <EmergencyContactSection
        saving={saving}
        control={control}
        onSave={onSave}
      />
    </form>
  )
}

type SectionProps = {
  saving: boolean
  control: Control<Account>
  onSave: (e?: React.BaseSyntheticEvent) => Promise<void>
  watch?: UseFormWatch<Account>
}

function MembershipSection({ saving, control, onSave }: SectionProps) {
  const { user } = useAuth()
  const clubConfig = useConfig()
  const [editing, setEditing] = useState(false)

  const clubSignupSem = clubConfig?.clubSignupSem

  if (!user || !clubConfig) {
    return (
      <div>
        Loading account details <Spin />
      </div>
    )
  }

  return (
    <AccountSection
      title="Membership"
      saving={saving}
      onSave={onSave}
      editing={editing}
      setEditing={setEditing}
    >
      <List.Item>
        <span>Current</span>
        <span className="font-bold">
          {MEMBERSHIP_PERIOD_LONG[user.membership]}
        </span>
      </List.Item>

      <List.Item>
        <span>Status</span>
        <span className="font-bold">{user.paid ? 'Paid' : 'Not paid'}</span>
      </List.Item>

      <List.Item>
        <span>Update membership</span>
        <Controller
          control={control}
          name="membership"
          render={({ field: { value, onChange } }) => (
            <Radio.Group
              buttonStyle="solid"
              disabled={!editing}
              value={value}
              onChange={onChange}
            >
              {clubSignupSem === 'SS' && (
                <Radio.Button value="SS">Summer School</Radio.Button>
              )}
              {clubSignupSem === 'S1' && (
                <>
                  <Radio.Button value="FY">Full Year</Radio.Button>
                  <Radio.Button value="S1">Semester 1</Radio.Button>
                </>
              )}
              {clubSignupSem === 'S2' &&
                !(user.membership === 'FY' && user.paid) && (
                  <Radio.Button value="S2">Semester 2</Radio.Button>
                )}
            </Radio.Group>
          )}
        />
      </List.Item>

      <List.Item>
        <span>Payment type</span>
        <Controller
          control={control}
          name="paymentType"
          render={({ field: { value, onChange } }) => (
            <Radio.Group
              buttonStyle="solid"
              disabled={!editing}
              value={value}
              onChange={onChange}
            >
              <Radio.Button value="Bank Transfer">Bank Transfer</Radio.Button>
              <Radio.Button value="Cash">Cash</Radio.Button>
              <Radio.Button value="Other">Other</Radio.Button>
            </Radio.Group>
          )}
        />
      </List.Item>
      {!user.paid && (
        <List.Item>
          <PaymentInstructions
            membershipType={user.membership}
            paymentType={user.paymentType}
            clubConfig={clubConfig}
          />
        </List.Item>
      )}
    </AccountSection>
  )
}

function PersonalSection({ saving, control, onSave }: SectionProps) {
  const { user } = useAuth()
  const [editing, setEditing] = useState(false)

  if (!user) {
    return (
      <div>
        Loading account details <Spin />
      </div>
    )
  }

  return (
    <AccountSection
      title="Personal"
      saving={saving}
      editing={editing}
      setEditing={setEditing}
      onSave={onSave}
    >
      <List.Item>
        <span>First name</span>
        <Controller
          name="firstName"
          control={control}
          render={({ field: { value, onChange } }) => (
            <Input
              disabled={!editing}
              value={value}
              onChange={onChange}
              className="max-w-[400px]"
            />
          )}
        />
      </List.Item>
      <List.Item>
        <span>Last name</span>
        <Controller
          name="lastName"
          control={control}
          render={({ field: { value, onChange } }) => (
            <Input
              disabled={!editing}
              value={value}
              onChange={onChange}
              className="max-w-[400px]"
            />
          )}
        />
      </List.Item>
      <List.Item>
        <span>Preferred name</span>
        <Controller
          name="preferredName"
          control={control}
          render={({ field: { value, onChange } }) => (
            <Input
              disabled={!editing}
              value={value}
              onChange={onChange}
              className="max-w-[400px]"
            />
          )}
        />
      </List.Item>
      <List.Item>
        <span>Email</span>
        <span className="font-bold">{user.email}</span>
      </List.Item>
      <List.Item>
        <span>Ethnicity</span>
        <Controller
          name="ethnicity"
          control={control}
          render={({ field: { value, onChange } }) => (
            <Select
              disabled={!editing}
              className="flex-1 max-w-[400px]"
              value={value}
              onChange={onChange}
            >
              {ETHNICITIES.map((ethnicity) => (
                <Select.Option key={ethnicity} value={ethnicity}>
                  {ethnicity}
                </Select.Option>
              ))}
            </Select>
          )}
        />
      </List.Item>
      <List.Item>
        <span>Gender</span>
        <Controller
          name="gender"
          control={control}
          render={({ field: { value, onChange } }) => (
            <Radio.Group
              name="GenderRadio"
              disabled={!editing}
              value={value}
              onChange={onChange}
            >
              <Radio value={'Male'}>Male</Radio>
              <Radio value={'Female'}>Female</Radio>
              <Radio value={'Non-binary'}>Non-binary</Radio>
              <Radio value={'Prefer not to say'}>Prefer not to say</Radio>
            </Radio.Group>
          )}
        />
      </List.Item>
    </AccountSection>
  )
}

function UniversitySection({ saving, control, watch, onSave }: SectionProps) {
  const { user } = useAuth()
  const [editing, setEditing] = useState(false)

  const isUoaStudent = watch?.('isUoAStudent')

  if (!user) {
    return (
      <div>
        Loading account details <Spin />
      </div>
    )
  }

  return (
    <AccountSection
      title="University"
      saving={saving}
      editing={editing}
      setEditing={setEditing}
      onSave={onSave}
    >
      <List.Item>
        <span>Are you a student at UoA?</span>
        <Controller
          name="isUoAStudent"
          control={control}
          render={({ field: { value, onChange } }) => (
            <Radio.Group
              disabled={!editing}
              value={value}
              buttonStyle="solid"
              onChange={onChange}
            >
              <Radio.Button value="Yes">Yes</Radio.Button>
              <Radio.Button value="No">No</Radio.Button>
            </Radio.Group>
          )}
        />
      </List.Item>
      {isUoaStudent && (
        <>
          <List.Item>
            <span>UPI</span>
            <Controller
              name="upi"
              control={control}
              render={({ field: { value, onChange } }) => (
                <Input
                  disabled={!editing}
                  value={value}
                  onChange={onChange}
                  className="max-w-[400px]"
                />
              )}
            />
          </List.Item>
          <List.Item>
            <span>Student ID</span>
            <Controller
              name="studentId"
              control={control}
              render={({ field: { value, onChange } }) => (
                <Input
                  disabled={!editing}
                  value={value}
                  onChange={onChange}
                  className="max-w-[400px]"
                />
              )}
            />
          </List.Item>
        </>
      )}
    </AccountSection>
  )
}

function EmergencyContactSection({ saving, control, onSave }: SectionProps) {
  const [editing, setEditing] = useState(false)

  return (
    <AccountSection
      title="Emergency Contact"
      saving={saving}
      editing={editing}
      setEditing={setEditing}
      onSave={onSave}
    >
      <List.Item>
        <span>Name</span>
        <Controller
          name="emergencyContactName"
          control={control}
          render={({ field: { value, onChange } }) => (
            <Input
              disabled={!editing}
              value={value}
              onChange={onChange}
              className="max-w-[400px]"
            />
          )}
        />
      </List.Item>
      <List.Item>
        <span>Number</span>
        <Controller
          name="emergencyContactNumber"
          control={control}
          render={({ field: { value, onChange } }) => (
            <Input
              disabled={!editing}
              value={value}
              onChange={onChange}
              className="max-w-[400px]"
            />
          )}
        />
      </List.Item>
      <List.Item>
        <span>Relationship</span>
        <Controller
          name="emergencyContactRelationship"
          control={control}
          render={({ field: { value, onChange } }) => (
            <Input
              disabled={!editing}
              value={value}
              onChange={onChange}
              className="max-w-[400px]"
            />
          )}
        />
      </List.Item>
    </AccountSection>
  )
}

function AccountSection({
  title,
  saving,
  editing,
  children,
  setEditing,
  onSave,
}: {
  title: string
  saving: boolean
  editing: boolean
  children: ReactNode
  setEditing: (editing: boolean) => void
  onSave: () => void
}) {
  return (
    <List
      header={title}
      footer={
        <div className="flex">
          {editing ? (
            <>
              <Button danger type="primary" onClick={() => setEditing(false)}>
                Cancel
              </Button>
              {saving ? (
                <Spin />
              ) : (
                <Button type="primary" onClick={onSave}>
                  Save
                </Button>
              )}
            </>
          ) : (
            <Button type="primary" onClick={() => setEditing(true)}>
              Edit
            </Button>
          )}
        </div>
      }
      bordered
      className="!mt-5"
    >
      {children}
    </List>
  )
}
