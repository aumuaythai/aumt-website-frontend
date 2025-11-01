import { zodResolver } from '@hookform/resolvers/zod'
import { Button, Input, List, notification, Radio, Select, Spin } from 'antd'
import { ReactNode, useState } from 'react'
import { Control, Controller, useForm, UseFormWatch } from 'react-hook-form'
import z from 'zod'
import { useAuth } from '../../../context/AuthProvider'
import { useConfig } from '../../../context/ClubConfigProvider'
import { setMember } from '../../../services/db'
import { AumtMember, MembershipPeriod } from '../../../types'
import PaymentInstructions from '../../utility/PaymentInstructions'
import { ETHNICITIES } from '../join/JoinForm'

const accountSchema = z.object({
  membership: z.enum(['S1', 'S2', 'FY', 'SS']),
  paymentType: z.enum(['Cash', 'Bank Transfer', 'Other']),
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  preferredName: z.string().optional(),
  ethnicity: z.enum(ETHNICITIES),
  gender: z.string().min(1, 'Gender is required'),
  isUoAStudent: z.enum(['Yes', 'No']),
  upi: z.string().optional(),
  studentId: z.string().optional(),
  EmergencyContactName: z.string().min(1, 'Emergency contact name is required'),
  EmergencyContactNumber: z
    .string()
    .min(1, 'Emergency contact number is required'),
  EmergencyContactRelationship: z
    .string()
    .min(1, 'Emergency contact relationship is required'),
})

type Account = z.infer<typeof accountSchema>

function Account() {
  const { authedUser, authedUserId } = useAuth()
  const [saving, setSaving] = useState(false)

  const { control, watch, handleSubmit } = useForm<Account>({
    defaultValues: {
      membership: authedUser.membership,
      paymentType: authedUser.paymentType,
      firstName: authedUser.firstName,
      lastName: authedUser.lastName,
      preferredName: authedUser.preferredName,
      ethnicity: authedUser.ethnicity,
      gender: authedUser.gender,
      isUoAStudent: authedUser.isUoAStudent,
      upi: authedUser.upi,
      studentId: authedUser.studentId,
      EmergencyContactName: authedUser.EmergencyContactName,
      EmergencyContactNumber: authedUser.EmergencyContactNumber,
      EmergencyContactRelationship: authedUser.EmergencyContactRelationship,
    },
    resolver: zodResolver(accountSchema),
  })

  const onSave = handleSubmit(updateMember)

  async function updateMember(data: Account) {
    setSaving(true)
    const updatedMember: AumtMember = {
      ...authedUser,
      ...data,
    }

    try {
      console.log(updatedMember)
      await setMember(authedUserId, updatedMember)
      notification.success({ message: 'Details updated' })
    } catch (error) {
      console.error('Error updating member:', error)
    } finally {
      setSaving(false)
    }
  }

  return (
    <main className="max-w-[640px] mx-auto text-left p-5">
      <h1 className="text-3xl font-bold">Account Settings</h1>
      <p>
        Here you can edit and update your details by clicking on the 'Edit'
        button for each section. In the membership section you can change your
        membership at the beginning of a new semester when signups for it opens.
      </p>

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
    </main>
  )
}

export default function AccountWrapper() {
  const { authedUser } = useAuth()

  if (!authedUser) {
    return <div>You do not have an account yet. Please join.</div>
  }

  return <Account />
}

type SectionProps = {
  saving: boolean
  control: Control<Account>
  onSave: (e?: React.BaseSyntheticEvent) => Promise<void>
  watch?: UseFormWatch<Account>
}

const MembershipPeriodLong: Record<MembershipPeriod, string> = {
  S1: 'Semester 1',
  S2: 'Semester 2',
  FY: 'Full Year (Sem 1 and Sem 2)',
  SS: 'Summer School',
}

function MembershipSection({ saving, control, onSave }: SectionProps) {
  const { authedUser } = useAuth()
  const { clubConfig, clubSignupSem } = useConfig()
  const [editing, setEditing] = useState(false)

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
          {MembershipPeriodLong[authedUser.membership]}
        </span>
      </List.Item>

      <List.Item>
        <span>Status</span>
        <span className="font-bold">
          {authedUser.paid === 'Yes' ? 'Paid' : 'Not paid'}
        </span>
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
                !(
                  authedUser.membership === 'FY' && authedUser.paid === 'Yes'
                ) && <Radio.Button value="S2">Semester 2</Radio.Button>}
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
      {authedUser.paid === 'No' && (
        <List.Item>
          <PaymentInstructions
            membershipType={authedUser.membership}
            paymentType={authedUser.paymentType}
            clubConfig={clubConfig}
          />
        </List.Item>
      )}
    </AccountSection>
  )
}

function PersonalSection({ saving, control, onSave }: SectionProps) {
  const { authedUser } = useAuth()
  const [editing, setEditing] = useState(false)

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
        <span className="font-bold">{authedUser.email}</span>
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
  const { authedUser } = useAuth()
  const [editing, setEditing] = useState(false)

  const isUoaStudent = watch('isUoAStudent')

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
      {isUoaStudent === 'Yes' && (
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
  const { authedUser } = useAuth()
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
          name="EmergencyContactName"
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
          name="EmergencyContactNumber"
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
          name="EmergencyContactRelationship"
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
