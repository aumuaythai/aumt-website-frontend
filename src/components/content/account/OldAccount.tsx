import { Button, Input, List, notification, Radio, Select, Spin } from 'antd'
import { useRef, useState } from 'react'
import { useAuth } from '../../../context/AuthProvider'
import { useConfig } from '../../../context/ConfigProvider'
import { signOut } from '../../../services/auth'
import { setMember } from '../../../services/db'
import Validator from '../../../services/validator'
import { AumtMember } from '../../../types'
import PaymentInstructions from '../../utility/PaymentInstructions'
import { ETHNICITIES } from '../join/JoinForm'
import './Account.css'

interface AccountState {
  currentFirstName: string
  currentLastName: string
  currentPreferredName: string
  currentEthnicity: string
  currentGender: string
  currentEmail: string
  currentIsUoaStudent: 'Yes' | 'No'
  currentUpi: string
  currentStudentId: string
  currentMembership: 'S1' | 'FY' | 'S2' | 'SS'
  currentPaid: 'Yes' | 'No'
  currentNotes: string
  currentPaymentType: 'Bank Transfer' | 'Cash' | 'Other'
  currentIsReturningMember: 'Yes' | 'No'
  currentInterestedInCamp: 'Yes' | 'No'
  currentInitialExperience: string
  currentECName: string
  currentECNumber: string
  currentECRelationship: string
  saving: boolean
  editPersonal: boolean
  editUniversity: boolean
  editMembership: boolean
  editEC: boolean
}

function Account() {
  const { authedUser, authedUserId } = useAuth()
  const { clubConfig, clubSignupSem, clubSignupStatus } = useConfig()

  const originalStateRef = useRef<AccountState>({
    currentFirstName: authedUser.firstName,
    currentLastName: authedUser.lastName,
    currentPreferredName: authedUser.preferredName,
    currentEthnicity: authedUser.ethnicity,
    currentGender: authedUser.gender,
    currentEmail: authedUser.email,
    currentIsUoaStudent: authedUser.isUoAStudent,
    currentUpi: authedUser.upi,
    currentStudentId: authedUser.studentId,
    currentMembership: authedUser.membership,
    currentPaid: authedUser.paid,
    currentNotes: authedUser.notes,
    currentPaymentType: authedUser.paymentType,
    currentIsReturningMember: authedUser.isReturningMember,
    currentInterestedInCamp: authedUser.interestedInCamp,
    currentInitialExperience: authedUser.initialExperience,
    currentECName: authedUser.EmergencyContactName,
    currentECNumber: authedUser.EmergencyContactNumber,
    currentECRelationship: authedUser.EmergencyContactRelationship,
    saving: false,
    editPersonal: false,
    editUniversity: false,
    editMembership: false,
    editEC: false,
  })
  const originalState = originalStateRef.current

  const [prevAuthedUser, setPrevAuthedUser] = useState<AumtMember>(authedUser)
  const [state, setState] = useState<AccountState>(originalState)

  if (prevAuthedUser !== authedUser) {
    setPrevAuthedUser(authedUser)
    setState((prev) => ({
      ...prev,
      currentFirstName: authedUser.firstName,
      currentLastName: authedUser.lastName,
      currentPreferredName: authedUser.preferredName,
      currentEmail: authedUser.email,
      currentInitialExperience: authedUser.initialExperience,
      currentIsUoaStudent: authedUser.isUoAStudent,
      currentUpi: authedUser.upi,
      currentStudentId: authedUser.studentId,
      currentMembership: authedUser.membership,
      currentPaid: authedUser.paid,
      currentNotes: authedUser.notes,
      currentPaymentType: authedUser.paymentType,
      currentIsReturningMember: authedUser.isReturningMember,
      currentInterestedInCamp: authedUser.interestedInCamp,
      currentECName: authedUser.EmergencyContactName,
      currentECNumber: authedUser.EmergencyContactNumber,
      currentECRelationship: authedUser.EmergencyContactRelationship,
    }))
  }

  function onFormFieldChange(field: keyof AccountState, value: any) {
    setState((prevState) => ({
      ...prevState,
      [field]: value,
    }))
  }

  function onMembershipChange(membership: 'S1' | 'S2' | 'FY' | 'SS') {
    if (membership === originalState.currentMembership) {
      setState((prev) => ({
        ...prev,
        currentMembership: membership,
        currentPaid: originalState.currentPaid,
        editMembership: false,
      }))
    } else {
      setState((prev) => ({
        ...prev,
        currentMembership: membership,
        currentPaid: 'No',
      }))
    }
  }

  function onSaveClick() {
    const member: AumtMember = {
      firstName: state.currentFirstName,
      lastName: state.currentLastName,
      preferredName: state.currentPreferredName,
      ethnicity: state.currentEthnicity,
      gender: state.currentGender,
      email: state.currentEmail,
      isUoAStudent: state.currentIsUoaStudent,
      upi: state.currentUpi || '0',
      studentId: state.currentStudentId || '0',
      membership: state.currentMembership,
      paid: state.currentPaid,
      notes: state.currentNotes,
      isReturningMember: state.currentIsReturningMember,
      interestedInCamp: state.currentInterestedInCamp,
      initialExperience: state.currentInitialExperience || '',
      EmergencyContactName: state.currentECName,
      EmergencyContactNumber: state.currentECNumber,
      EmergencyContactRelationship: state.currentECRelationship,
      timeJoinedMs: authedUser.timeJoinedMs,
      paymentType: state.currentPaymentType,
    }

    /**
     * Additional backup check if the user has changed membership
     * we make damn sure they are set to 'not paid'.
     */
    if (state.currentMembership !== originalState.currentMembership) {
      setState((prev) => ({ ...prev, currentPaid: 'No' }))
    }

    const errorStr = Validator.createAumtMember(member)
    if (typeof errorStr === 'string') {
      return notification.error({ message: errorStr })
    }
    if (authedUser.email !== state.currentEmail) {
      notification.open({
        message:
          'Reminder: If you change the email here, also change it in Firebase by using the Admin SDK (see firebase user management guide)',
      })
    }

    setState((prev) => ({ ...prev, saving: true }))
    setMember(authedUserId, member)
      .then(() => {
        setState((prev) => ({
          ...prev,
          editPersonal: false,
          editMembership: false,
          editEC: false,
          editUniversity: false,
          saving: false,
        }))
        originalStateRef.current = state
        notification.success({ message: 'Details updated' })

        // Update props because website doesn't refresh.
        updateAuthedUserProps(member)
      })
      .catch((err) => {
        notification.error({
          message: 'Could not save member' + err.toString(),
        })
      })
  }

  function updateAuthedUserProps(member: AumtMember) {
    Object.keys(authedUser).forEach((key) => {
      authedUser[key] = member[key]
    })
  }

  function onSignOutClick() {
    signOut().catch((err) => {
      notification.error({ message: 'Error signing out: ' + err.toString() })
    })
  }

  function editPersonalChange(toggle: boolean) {
    setState((prev) => ({ ...prev, editPersonal: toggle }))
    if (!toggle) setState(originalState)
  }

  function editMembershipChange(toggle: boolean) {
    setState((prev) => ({ ...prev, editMembership: toggle }))
    if (!toggle) setState(originalState)
  }

  function editECChange(toggle: boolean) {
    setState((prev) => ({ ...prev, editEC: toggle }))
    if (!toggle) setState(originalState)
  }

  function editUniversityChange(toggle: boolean) {
    setState((prev) => ({ ...prev, editUniversity: toggle }))
    if (!toggle) setState(originalState)
  }

  if (!authedUser) {
    return <div>You do not have an account yet. Please join.</div>
  }

  return (
    <main className="accountContainer">
      <h1>Account Settings</h1>
      <p>
        Here you can edit and update your details by clicking on the 'Edit'
        button for each section. In the membership section you can change your
        membership at the beginning of a new semester when signups for it opens.
      </p>

      <List
        header="Membership"
        footer={
          <div className="listFooter">
            {state.editMembership ? (
              <>
                <Button
                  danger
                  type="primary"
                  onClick={(e) => editMembershipChange(false)}
                >
                  Cancel
                </Button>
                {state.saving ? (
                  <Spin />
                ) : (
                  <Button type="primary" onClick={onSaveClick}>
                    Save
                  </Button>
                )}
              </>
            ) : (
              <Button
                type="primary"
                onClick={(e) => editMembershipChange(true)}
              >
                Edit
              </Button>
            )}
          </div>
        }
        bordered
        className="listContainer"
      >
        <List.Item>
          Current:
          <b>
            {state.currentMembership === 'S1' ? ' Semester 1' : ''}
            {state.currentMembership === 'S2' ? ' Semester 2' : ''}
            {state.currentMembership === 'SS' ? ' Summer School' : ''}
            {state.currentMembership === 'FY'
              ? ' Full Year (Sem 1 and Sem 2)'
              : ''}
          </b>
        </List.Item>
        <List.Item>
          Status: <b>{state.currentPaid === 'Yes' ? 'Paid' : 'Not paid'}</b>
        </List.Item>
        <List.Item>
          <span>Update membership options:</span>
          <Radio.Group
            buttonStyle="solid"
            disabled={!state.editMembership}
            value={state.currentMembership}
            onChange={(e) => onMembershipChange(e.target.value)}
          >
            {clubSignupSem === 'SS' ? (
              <Radio.Button value="SS">Summer School</Radio.Button>
            ) : null}
            {clubSignupSem === 'S1' ? (
              <>
                <Radio.Button value="FY">Full Year</Radio.Button>
                <Radio.Button value="S1">Semester 1</Radio.Button>
              </>
            ) : null}
            {clubSignupSem === 'S2' &&
            !(
              state.currentMembership === 'FY' && state.currentPaid === 'Yes'
            ) ? (
              <Radio.Button value="S2">Semester 2</Radio.Button>
            ) : null}
          </Radio.Group>
        </List.Item>
        <List.Item>
          <span>Payment Type</span>
          <Radio.Group
            buttonStyle="solid"
            disabled={!state.editMembership}
            value={state.currentPaymentType}
            onChange={(e) =>
              onFormFieldChange('currentPaymentType', e.target.value)
            }
          >
            <Radio.Button value="Bank Transfer">Bank Transfer</Radio.Button>
            <Radio.Button value="Cash">Cash</Radio.Button>
            <Radio.Button value="Other">Other</Radio.Button>
          </Radio.Group>
        </List.Item>
        {state.currentPaid === 'No' ? (
          <List.Item>
            <PaymentInstructions
              membershipType={state.currentMembership}
              paymentType={state.currentPaymentType}
              clubConfig={clubConfig}
            />
          </List.Item>
        ) : null}
      </List>

      <List
        header="Personal"
        footer={
          <div className="listFooter">
            {state.editPersonal ? (
              <>
                <Button
                  type="primary"
                  danger
                  onClick={(e) => editPersonalChange(false)}
                >
                  Cancel
                </Button>
                {state.saving ? (
                  <Spin />
                ) : (
                  <Button type="primary" onClick={onSaveClick}>
                    Save
                  </Button>
                )}
              </>
            ) : (
              <Button type="primary" onClick={(e) => editPersonalChange(true)}>
                Edit
              </Button>
            )}
          </div>
        }
        bordered
        className="listContainer"
      >
        <List.Item>
          <span>First:</span>
          <Input
            disabled={!state.editPersonal}
            className="memberEditInput"
            value={state.currentFirstName}
            onChange={(e) =>
              onFormFieldChange('currentFirstName', e.target.value)
            }
          />
        </List.Item>
        <List.Item>
          <span>Last:</span>
          <Input
            disabled={!state.editPersonal}
            className="memberEditInput"
            value={state.currentLastName}
            onChange={(e) =>
              onFormFieldChange('currentLastName', e.target.value)
            }
          />
        </List.Item>
        <List.Item>
          <span>Preferred:</span>
          <Input
            disabled={!state.editPersonal}
            className="memberEditInput"
            value={state.currentPreferredName}
            onChange={(e) =>
              onFormFieldChange('currentPreferredName', e.target.value)
            }
          />
        </List.Item>
        <List.Item>
          <span>Email: {state.currentEmail}</span>
        </List.Item>
        <List.Item>
          <span>Ethnicity:</span>
          <Select
            disabled={!state.editPersonal}
            value={state.currentEthnicity}
            onChange={(value) => onFormFieldChange('currentEthnicity', value)}
            className="dropdown"
          >
            {ETHNICITIES.map((ethnicity) => (
              <Select.Option value={ethnicity}>{ethnicity}</Select.Option>
            ))}
          </Select>
        </List.Item>
        <List.Item>
          <span>Gender:</span>
          <Radio.Group
            name="GenderRadio"
            value={state.currentGender}
            disabled={!state.editPersonal}
            onChange={(e) => onFormFieldChange('currentGender', e.target.value)}
          >
            <Radio value={'Male'}>Male</Radio>
            <Radio value={'Female'}>Female</Radio>
            <Radio value={'Non-binary'}>Non-binary</Radio>
            <Radio value={'Prefer not to say'}>Prefer not to say</Radio>
          </Radio.Group>
        </List.Item>
      </List>

      <List
        header="University"
        footer={
          <div className="listFooter">
            {state.editUniversity ? (
              <>
                <Button
                  type="primary"
                  danger
                  onClick={(e) => editUniversityChange(false)}
                >
                  Cancel
                </Button>
                {state.saving ? (
                  <Spin />
                ) : (
                  <Button type="primary" onClick={onSaveClick}>
                    Save
                  </Button>
                )}
              </>
            ) : (
              <Button
                type="primary"
                onClick={(e) => editUniversityChange(true)}
              >
                Edit
              </Button>
            )}
          </div>
        }
        bordered
        className="listContainer"
      >
        <List.Item>
          <span>UoA Student:</span>
          <Radio.Group
            disabled={!state.editUniversity}
            value={state.currentIsUoaStudent}
            onChange={(e) =>
              onFormFieldChange('currentIsUoaStudent', e.target.value)
            }
          >
            <Radio.Button value="Yes">Yes</Radio.Button>
            <Radio.Button value="No">No</Radio.Button>
          </Radio.Group>
        </List.Item>
        {state.currentIsUoaStudent === 'Yes' ? (
          <>
            <List.Item>
              <span>UPI:</span>
              <Input
                disabled={!state.editUniversity}
                className="memberEditInput"
                value={state.currentUpi}
                onChange={(e) =>
                  onFormFieldChange('currentUpi', e.target.value)
                }
              />
            </List.Item>
            <List.Item>
              <span>Student Id:</span>
              <Input
                disabled={!state.editUniversity}
                className="memberEditInput"
                value={state.currentStudentId}
                onChange={(e) =>
                  onFormFieldChange('currentStudentId', e.target.value)
                }
              />
            </List.Item>
          </>
        ) : null}
      </List>

      <List
        header="Emergency Contact"
        footer={
          <div className="listFooter">
            {state.editEC ? (
              <>
                <Button
                  type="primary"
                  danger
                  onClick={(e) => editECChange(false)}
                >
                  Cancel
                </Button>
                {state.saving ? (
                  <Spin />
                ) : (
                  <Button type="primary" onClick={onSaveClick}>
                    Save
                  </Button>
                )}
              </>
            ) : (
              <Button type="primary" onClick={(e) => editECChange(true)}>
                Edit
              </Button>
            )}
          </div>
        }
        bordered
        className="listContainer"
      >
        <List.Item>
          <span>Name: </span>
          <Input
            disabled={!state.editEC}
            className="memberEditInput"
            value={state.currentECName}
            onChange={(e) => onFormFieldChange('currentECName', e.target.value)}
          />
        </List.Item>
        <List.Item>
          <span>Number: </span>
          <Input
            disabled={!state.editEC}
            className="memberEditInput"
            value={state.currentECNumber}
            onChange={(e) =>
              onFormFieldChange('currentECNumber', e.target.value)
            }
          />
        </List.Item>
        <List.Item>
          <span>Relationship: </span>
          <Input
            disabled={!state.editEC}
            className="memberEditInput"
            value={state.currentECRelationship}
            onChange={(e) =>
              onFormFieldChange('currentECRelationship', e.target.value)
            }
          />
        </List.Item>
      </List>

      <p style={{ textAlign: 'center' }}>
        Click here to
        <Button
          type="link"
          className="joinResultSignOut"
          onClick={onSignOutClick}
        >
          Log out
        </Button>
      </p>
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
