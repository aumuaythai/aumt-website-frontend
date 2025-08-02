import { Button, Input, List, Radio, Select, Spin } from 'antd'
import { ReactNode, useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { useAuth } from '../../../context/AuthProvider'
import { useConfig } from '../../../context/ConfigProvider'
import { MembershipPeriod } from '../../../types'
import PaymentInstructions from '../../utility/PaymentInstructions'
import { ETHNICITIES } from '../join/JoinForm'
import './Account.css'

function Account() {
  const [saving, setSaving] = useState(false)

  function onSave(data) {
    setSaving(true)
    console.log(data)
    setTimeout(() => {
      setSaving(false)
    }, 2000)
  }

  return (
    <main className="accountContainer">
      <h1>Account Settings</h1>
      <p>
        Here you can edit and update your details by clicking on the 'Edit'
        button for each section. In the membership section you can change your
        membership at the beginning of a new semester when signups for it opens.
      </p>

      <MembershipSection saving={saving} onSave={onSave} />
      <PersonalSection saving={saving} onSave={onSave} />
      <UniversitySection saving={saving} onSave={onSave} />
      <EmergencyContactSection saving={saving} onSave={onSave} />
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

type Sectionprops = {
  saving: boolean
  onSave: (data) => void
}

const MembershipPeriodLong: Record<MembershipPeriod, string> = {
  S1: 'Semester 1',
  S2: 'Semester 2',
  FY: 'Full Year (Sem 1 and Sem 2)',
  SS: 'Summer School',
}

function MembershipSection({ saving, onSave }: Sectionprops) {
  const { authedUser } = useAuth()
  const { clubConfig, clubSignupSem } = useConfig()
  const [editing, setEditing] = useState(false)
  const { control, handleSubmit } = useForm({
    defaultValues: {
      membership: authedUser.membership,
      paymentType: authedUser.paymentType,
    },
  })

  return (
    <AccountSection
      title="Membership"
      saving={saving}
      onSave={handleSubmit(onSave)}
      editing={editing}
      setEditing={setEditing}
    >
      <List.Item>
        <span>Current</span>
        <span className="bold">
          {MembershipPeriodLong[authedUser.membership]}
        </span>
      </List.Item>

      <List.Item>
        <span>Current</span>
        <span className="bold">
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

function PersonalSection({ saving, onSave }: Sectionprops) {
  const { authedUser } = useAuth()
  const [editing, setEditing] = useState(false)

  const { register, control, handleSubmit } = useForm({
    defaultValues: {
      firstName: authedUser.firstName,
      lastName: authedUser.lastName,
      preferredName: authedUser.preferredName,
      email: authedUser.email,
      ethnicity: authedUser.ethnicity,
      gender: authedUser.gender,
    },
  })

  return (
    <AccountSection
      title="Personal"
      saving={saving}
      editing={editing}
      setEditing={setEditing}
      onSave={handleSubmit(onSave)}
    >
      <List.Item>
        <span>First name</span>
        <Input
          disabled={!editing}
          defaultValue={authedUser.firstName}
          className="input"
          {...register('firstName')}
        />
      </List.Item>
      <List.Item>
        <span>Last name</span>
        <Input
          disabled={!editing}
          defaultValue={authedUser.lastName}
          className="input"
          {...register('lastName')}
        />
      </List.Item>
      <List.Item>
        <span>Preferred name</span>
        <Input
          disabled={!editing}
          defaultValue={authedUser.preferredName}
          className="input"
          {...register('preferredName')}
        />
      </List.Item>
      <List.Item>
        <span>Email</span>
        <span className="bold">{authedUser.email}</span>
      </List.Item>
      <List.Item>
        <span>Ethnicity</span>
        <Controller
          name="ethnicity"
          control={control}
          render={({ field: { value, onChange } }) => (
            <Select
              disabled={!editing}
              className="dropdown"
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

function UniversitySection({ saving, onSave }: Sectionprops) {
  const [editing, setEditing] = useState(false)

  return (
    <AccountSection
      title="University"
      saving={saving}
      editing={editing}
      setEditing={setEditing}
      onSave={onSave}
    >
      <List.Item>UOA student</List.Item>
    </AccountSection>
  )
}

function EmergencyContactSection({ saving, onSave }: Sectionprops) {
  const [editing, setEditing] = useState(false)

  return (
    <AccountSection
      title="Emergency Contact"
      saving={saving}
      editing={editing}
      setEditing={setEditing}
      onSave={onSave}
    >
      <List.Item>Name</List.Item>
      <List.Item>Number</List.Item>
      <List.Item>Relationship</List.Item>
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
        <div className="listFooter">
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
      className="listContainer"
    >
      {children}
    </List>
  )
}
