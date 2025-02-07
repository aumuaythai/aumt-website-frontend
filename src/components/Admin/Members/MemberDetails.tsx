import { CloseCircleOutlined, CopyOutlined } from '@ant-design/icons'
import { Button, Input, notification, Popconfirm, Radio, Tooltip } from 'antd'
import moment from 'moment'
import React, { Component } from 'react'
import { RouteComponentProps, withRouter } from 'react-router-dom'
import DataFormatterUtil from '../../../services/data.util'
import db from '../../../services/db'
import Functions from '../../../services/functions'
import Validator from '../../../services/validator'
import { AumtMember } from '../../../types'
import { MemberAttendance } from './MemberAttendance'
import './MemberDetails.css'
import { TableDataLine } from './TableHelper'

interface MemberDetailsProps extends RouteComponentProps {
  member: TableDataLine
  onExit: () => void
}

interface MemberDetailsState {
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
  removing: boolean
}

class MemberDetails extends Component<MemberDetailsProps, MemberDetailsState> {
  constructor(props: MemberDetailsProps) {
    super(props)
    this.state = {
      currentFirstName: props.member.firstName,
      currentLastName: props.member.lastName,
      currentPreferredName: props.member.preferredName,
      currentEthnicity: props.member.ethnicity,
      currentGender: props.member.gender,
      currentEmail: props.member.email,
      currentIsUoaStudent: props.member.isUoAStudent,
      currentUpi: props.member.upi,
      currentStudentId: props.member.studentId,
      currentMembership: props.member.membership,
      currentPaid: props.member.paid,
      currentNotes: props.member.notes,
      currentPaymentType: props.member.paymentType,
      currentIsReturningMember: props.member.isReturningMember,
      currentInterestedInCamp: props.member.interestedInCamp,
      currentInitialExperience: props.member.initialExperience,
      currentECName: props.member.EmergencyContactName,
      currentECNumber: props.member.EmergencyContactNumber,
      currentECRelationship: props.member.EmergencyContactRelationship,
      saving: false,
      removing: false,
    }
  }
  componentDidUpdate = (prevProps: MemberDetailsProps) => {
    if (this.props !== prevProps) {
      this.setState({
        ...this.state,
        currentFirstName: this.props.member.firstName,
        currentLastName: this.props.member.lastName,
        currentPreferredName: this.props.member.preferredName,
        currentEmail: this.props.member.email,
        currentInitialExperience: this.props.member.initialExperience,
        currentIsUoaStudent: this.props.member.isUoAStudent,
        currentUpi: this.props.member.upi,
        currentStudentId: this.props.member.studentId,
        currentMembership: this.props.member.membership,
        currentPaid: this.props.member.paid,
        currentNotes: this.props.member.notes,
        currentPaymentType: this.props.member.paymentType,
        currentIsReturningMember: this.props.member.isReturningMember,
        currentInterestedInCamp: this.props.member.interestedInCamp,
        currentECName: this.props.member.EmergencyContactName,
        currentECNumber: this.props.member.EmergencyContactNumber,
        currentECRelationship: this.props.member.EmergencyContactRelationship,
      })
    }
  }
  onFirstNameChange = (newName: string) => {
    this.setState({ ...this.state, currentFirstName: newName })
  }
  onLastNameChange = (newName: string) => {
    this.setState({ ...this.state, currentLastName: newName })
  }
  onPreferredNameChange = (newName: string) => {
    this.setState({ ...this.state, currentPreferredName: newName })
  }
  onEmailChange = (newEmail: string) => {
    this.setState({ ...this.state, currentEmail: newEmail })
  }
  onIsUoaChange = (isUoa: 'Yes' | 'No') => {
    this.setState({ ...this.state, currentIsUoaStudent: isUoa })
  }
  onUpiChange = (upi: string) => {
    this.setState({ ...this.state, currentUpi: upi })
  }
  onStudentIdChange = (newId: string) => {
    this.setState({ ...this.state, currentStudentId: newId })
  }
  onMembershipChange = (membership: 'S1' | 'S2' | 'FY' | 'SS') => {
    let newMembership: 'S1' | 'S2' | 'FY' | 'SS' = membership
    this.setState({ ...this.state, currentMembership: newMembership })
  }
  onInterestedInCampChange = (interested: 'Yes' | 'No') => {
    this.setState({ ...this.state, currentInterestedInCamp: interested })
  }
  onPaidChange = (paid: 'Yes' | 'No') => {
    this.setState({ ...this.state, currentPaid: paid })
  }
  onNotesChange = (notes: string) => {
    this.setState({ ...this.state, currentNotes: notes })
  }
  onPaymentTypeChange = (payment: 'Bank Transfer' | 'Cash' | 'Other') => {
    this.setState({ ...this.state, currentPaymentType: payment })
  }
  onIsReturningChange = (isReturning: 'Yes' | 'No') => {
    this.setState({ ...this.state, currentIsReturningMember: isReturning })
  }
  onInitialExperienceChange = (experience: string) => {
    this.setState({ ...this.state, currentInitialExperience: experience })
  }
  onECNameChange = (name: string) => {
    this.setState({ ...this.state, currentECName: name })
  }
  onECNumberChange = (number: string) => {
    this.setState({ ...this.state, currentECNumber: number })
  }
  onECRelationChange = (relation: string) => {
    this.setState({ ...this.state, currentECRelationship: relation })
  }
  onRemoveClick = () => {
    this.setState({ ...this.state, removing: true })

    // Remove user from database.
    db.removeMember(this.props.member.key)
      .then(() => {
        // If successfull then remove user from auth.
        Functions.removeUser(this.props.member.key)
          .then((result) => {
            // Finally remove user from state.
            this.setState({ ...this.state, removing: false })
            notification.success({
              message: `${this.state.currentFirstName} ${this.state.currentLastName} removed. `,
            })
            this.props.history.push('/admin/members')

            console.log(result.data.message)
          })
          .catch((error) => console.log(error))
      })
      .catch((err) => {
        this.setState({ ...this.state, removing: false })
        notification.error({ message: err.toString() })
      })
  }
  onSaveClick = () => {
    const member: AumtMember = {
      firstName: this.state.currentFirstName,
      lastName: this.state.currentLastName,
      preferredName: this.state.currentPreferredName,
      ethnicity: this.state.currentEthnicity,
      gender: this.state.currentGender,
      email: this.state.currentEmail,
      isUoAStudent: this.state.currentIsUoaStudent,
      upi: this.state.currentUpi || '0',
      studentId: this.state.currentStudentId || '0',
      membership: this.state.currentMembership,
      paid: this.state.currentPaid,
      notes: this.state.currentNotes,
      isReturningMember: this.state.currentIsReturningMember,
      interestedInCamp: this.state.currentInterestedInCamp,
      initialExperience: this.state.currentInitialExperience || '',
      EmergencyContactName: this.state.currentECName,
      EmergencyContactNumber: this.state.currentECNumber,
      EmergencyContactRelationship: this.state.currentECRelationship,
      timeJoinedMs: this.props.member.timeJoinedMs,
      paymentType: this.state.currentPaymentType,
    }
    const errorStr = Validator.createAumtMember(member)
    if (typeof errorStr === 'string') {
      return notification.error({ message: errorStr })
    }
    if (this.props.member.email !== this.state.currentEmail) {
      notification.open({
        message:
          'Reminder: If you change the email here, also change it in Firebase by using the Admin SDK (see firebase user management guide)',
      })
    }
    this.setState({ ...this.state, saving: true })
    db.setMember(this.props.member.key, member)
      .then(() => {
        this.setState({ ...this.state, saving: false })
        notification.success({ message: 'Saved' })
      })
      .catch((err) => {
        notification.error({
          message: 'Could not save member' + err.toString(),
        })
      })
  }
  copyText = (text: string) => {
    DataFormatterUtil.copyText(text)
  }
  render() {
    return (
      <div>
        <h2 className="memberDetailsTitle">{this.props.member.tableName}</h2>
        <div className="memberDetailsCloseIcon">
          <CloseCircleOutlined onClick={this.props.onExit} />
        </div>
        <div className="memberDetailsHeaderButtons">
          <Button
            className="memberDescriptionButton"
            type="primary"
            loading={this.state.saving}
            onClick={this.onSaveClick}
          >
            Save {this.state.currentFirstName}
          </Button>
          <Popconfirm
            title={`Confirm delete ${this.state.currentFirstName}? RIP`}
            onConfirm={this.onRemoveClick}
          >
            <Button
              className="memberDescriptionButton"
              danger
              type="primary"
              loading={this.state.removing}
            >
              Remove {this.state.currentFirstName}
            </Button>
          </Popconfirm>
        </div>
        <div className="clearBoth"></div>
        <div className="membershipDescriptionContainer">
          <div className="memberDescriptionSection">
            <h3>Contact</h3>
            <table className="memberDetailsTable">
              <tbody>
                <tr>
                  <td className="memberDetailsTableLabel"></td>
                  <td className="memberDetailsTableData"></td>
                </tr>
                <tr className="memberDescriptionLine">
                  <td className="memberDetailsTableLabel">
                    <span className="memberDescriptionTitle">First: </span>
                  </td>
                  <td className="memberDetailsTableData">
                    <Input
                      className="memberEditInput"
                      value={this.state.currentFirstName}
                      onChange={(e) => this.onFirstNameChange(e.target.value)}
                    />
                  </td>
                </tr>
                <tr className="memberDescriptionLine">
                  <td className="memberDetailsTableLabel">
                    <span className="memberDescriptionTitle">Last: </span>
                  </td>
                  <td className="memberDetailsTableData">
                    <Input
                      className="memberEditInput"
                      value={this.state.currentLastName}
                      onChange={(e) => this.onLastNameChange(e.target.value)}
                    />
                  </td>
                </tr>
                <tr className="memberDescriptionLine">
                  <td className="memberDetailsTableLabel">
                    <span className="memberDescriptionTitle">Preferred: </span>
                  </td>
                  <td className="memberDetailsTableData">
                    <Input
                      className="memberEditInput"
                      value={this.state.currentPreferredName}
                      onChange={(e) =>
                        this.onPreferredNameChange(e.target.value)
                      }
                    />
                  </td>
                </tr>
                <tr className="memberDescriptionLine">
                  <td className="memberDetailsTableLabel">
                    <span className="memberDescriptionTitle">Email: </span>
                  </td>
                  <td className="memberDetailsTableData">
                    <Input
                      className="memberEditInput"
                      value={this.state.currentEmail}
                      suffix={
                        <Tooltip title="Copy">
                          <CopyOutlined
                            onClick={(e) =>
                              this.copyText(this.state.currentEmail)
                            }
                          />
                        </Tooltip>
                      }
                      onChange={(e) => this.onEmailChange(e.target.value)}
                    />
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <div className="memberDescriptionSection">
            <h3>Membership</h3>
            <table className="memberDetailsTable">
              <tbody>
                <tr>
                  <td className="memberDetailsTableLabel"></td>
                  <td className="memberDetailsTableData"></td>
                </tr>
                <tr className="memberDescriptionLine">
                  <td className="memberDetailsTableLabel">
                    <span className="memberDescriptionTitle">Term: </span>
                  </td>
                  <td className="memberDetailsTableData">
                    <Radio.Group
                      value={this.state.currentMembership}
                      onChange={(e) => this.onMembershipChange(e.target.value)}
                    >
                      <Radio.Button value="S1">S1</Radio.Button>
                      <Radio.Button value="S2">S2</Radio.Button>
                      <Radio.Button value="FY">FY</Radio.Button>
                      <Radio.Button value="SS">SS</Radio.Button>
                    </Radio.Group>
                  </td>
                </tr>
                <tr className="memberDescriptionLine">
                  <td className="memberDetailsTableLabel">
                    <span className="memberDescriptionTitle">Paid: </span>
                  </td>
                  <td className="memberDetailsTableData">
                    <Radio.Group
                      value={this.state.currentPaid}
                      onChange={(e) => this.onPaidChange(e.target.value)}
                    >
                      <Radio.Button value="Yes">Yes</Radio.Button>
                      <Radio.Button value="No">No</Radio.Button>
                    </Radio.Group>
                  </td>
                </tr>
                <tr className="memberDescriptionLine">
                  <td className="memberDetailsTableLabel">
                    <span className="memberDescriptionTitle">Payment: </span>
                  </td>
                  <td className="memberDetailsTableData">
                    <Radio.Group
                      value={this.state.currentPaymentType}
                      onChange={(e) => this.onPaymentTypeChange(e.target.value)}
                    >
                      <Radio.Button value="Cash">Cash</Radio.Button>
                      <Radio.Button value="Bank Transfer">
                        Transfer
                      </Radio.Button>
                      <Radio.Button value="Other">Other</Radio.Button>
                    </Radio.Group>
                  </td>
                </tr>
                <tr className="memberDescriptionLine">
                  <td className="memberDetailsTableLabel">
                    <span className="memberDescriptionTitle">Returning: </span>
                  </td>
                  <td className="memberDetailsTableData">
                    <Radio.Group
                      value={this.state.currentIsReturningMember}
                      onChange={(e) => this.onIsReturningChange(e.target.value)}
                    >
                      <Radio.Button value="Yes">Yes</Radio.Button>
                      <Radio.Button value="No">No</Radio.Button>
                    </Radio.Group>
                  </td>
                </tr>
                <tr className="memberDescriptionLine">
                  <td className="memberDetailsTableLabel">
                    <span className="memberDescriptionTitle">Joined: </span>
                  </td>
                  <td className="memberDetailsTableData">
                    <span>
                      {' '}
                      {moment(this.props.member.timeJoinedMs).format(
                        'MMM DD yyyy'
                      )}
                    </span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <div className="memberDescriptionSection">
            <h3>Details</h3>
            <table className="memberDetailsTable">
              <tbody>
                <tr>
                  <td className="memberDetailsTableLabel"></td>
                  <td className="memberDetailsTableData"></td>
                </tr>
                <tr className="memberDescriptionLine">
                  <td className="memberDetailsTableLabel">
                    <span className="memberDescriptionTitle">
                      Interested in Camp:{' '}
                    </span>
                  </td>
                  <td className="memberDetailsTableData">
                    <Radio.Group
                      value={this.state.currentInterestedInCamp}
                      onChange={(e) =>
                        this.onInterestedInCampChange(e.target.value)
                      }
                    >
                      <Radio.Button value="Yes">Yes</Radio.Button>
                      <Radio.Button value="No">No</Radio.Button>
                    </Radio.Group>
                  </td>
                </tr>
                <tr className="memberDescriptionLine">
                  <td className="memberDetailsTableLabel">
                    <span className="memberDescriptionTitle">UoA: </span>
                  </td>
                  <td className="memberDetailsTableData">
                    <Radio.Group
                      value={this.state.currentIsUoaStudent}
                      onChange={(e) => this.onIsUoaChange(e.target.value)}
                    >
                      <Radio.Button value="Yes">Yes</Radio.Button>
                      <Radio.Button value="No">No</Radio.Button>
                    </Radio.Group>
                  </td>
                </tr>
                <tr
                  className={`memberDescriptionLine ${
                    this.state.currentIsUoaStudent === 'Yes'
                      ? ''
                      : 'displayNone'
                  }`}
                >
                  <td className="memberDetailsTableLabel">
                    <span className="memberDescriptionTitle">UPI: </span>
                  </td>
                  <td className="memberDetailsTableData">
                    <Input
                      className="memberEditInput"
                      suffix={
                        <Tooltip title="Copy">
                          <CopyOutlined
                            onClick={(e) =>
                              this.copyText(this.props.member.upi)
                            }
                          />
                        </Tooltip>
                      }
                      value={this.state.currentUpi}
                      onChange={(e) => this.onUpiChange(e.target.value)}
                    />
                  </td>
                </tr>
                <tr
                  className={`memberDescriptionLine ${
                    this.state.currentIsUoaStudent === 'Yes'
                      ? ''
                      : 'displayNone'
                  }`}
                >
                  <td className="memberDetailsTableLabel">
                    <span className="memberDescriptionTitle">Student ID: </span>
                  </td>
                  <td className="memberDetailsTableData">
                    <Input
                      className="memberEditInput"
                      suffix={
                        <Tooltip title="Copy">
                          <CopyOutlined
                            onClick={(e) =>
                              this.copyText(this.props.member.studentId)
                            }
                          />
                        </Tooltip>
                      }
                      value={this.state.currentStudentId}
                      onChange={(e) => this.onStudentIdChange(e.target.value)}
                    />
                  </td>
                </tr>
                <tr className="memberDescriptionLine">
                  <td className="memberDetailsTableLabel">
                    <span className="memberDescriptionTitle">ID: </span>
                  </td>
                  <td className="memberDetailsTableData">
                    <span>{this.props.member.key}</span>
                    <Tooltip title="Copy">
                      <CopyOutlined
                        onClick={(e) => this.copyText(this.props.member.key)}
                      />
                    </Tooltip>
                  </td>
                </tr>
                <tr className="memberDescriptionLine">
                  <td className="memberDetailsTableLabel">
                    <span className="memberDescriptionTitle">Notes: </span>
                  </td>
                  <td className="memberDetailsTableData">
                    <Input.TextArea
                      className="memberEditTxtArea"
                      onChange={(e) => this.onNotesChange(e.target.value)}
                      placeholder="Admin Notes"
                      autoSize={{ minRows: 2, maxRows: 2 }}
                      value={this.state.currentNotes}
                    />
                  </td>
                </tr>
              </tbody>
            </table>
            {/* <div className={`memberDescriptionLine`}>
                            <span className='memberDescriptionTitle'>Experience: </span>
                            <Input className='memberEditInput' value={this.state.currentInitialExperience} onChange={e => this.onInitialExperienceChange(e.target.value)}/>
                        </div> */}
          </div>
          <div className="memberDescriptionSection">
            <h3>Emergency Contact</h3>
            <table className="memberDetailsTable">
              <tbody>
                <tr>
                  <td className="memberDetailsTableLabel"></td>
                  <td className="memberDetailsTableData"></td>
                </tr>
                <tr className="memberDescriptionLine">
                  <td className="memberDetailsTableLabel">
                    <span className="memberDescriptionTitle">Name: </span>
                  </td>
                  <td className="memberDetailsTableData">
                    <Input
                      className="memberEditInput"
                      value={this.state.currentECName}
                      onChange={(e) => this.onECNameChange(e.target.value)}
                    />
                  </td>
                </tr>
                <tr className="memberDescriptionLine">
                  <td className="memberDetailsTableLabel">
                    <span className="memberDescriptionTitle">Number: </span>
                  </td>
                  <td className="memberDetailsTableData">
                    <Input
                      className="memberEditInput"
                      value={this.state.currentECNumber}
                      suffix={
                        <Tooltip title="Copy">
                          <CopyOutlined
                            onClick={(e) =>
                              this.copyText(
                                this.props.member.EmergencyContactNumber
                              )
                            }
                          />
                        </Tooltip>
                      }
                      onChange={(e) => this.onECNumberChange(e.target.value)}
                    />
                  </td>
                </tr>
                <tr className="memberDescriptionLine">
                  <td className="memberDetailsTableLabel">
                    <span className="memberDescriptionTitle">Relation: </span>
                  </td>
                  <td className="memberDetailsTableData">
                    <Input
                      className="memberEditInput"
                      value={this.state.currentECRelationship}
                      onChange={(e) => this.onECRelationChange(e.target.value)}
                    />
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <div className="clearBoth"></div>
        </div>
        <div className="atttendanceContainer">
          <h2>Attendance</h2>
          <MemberAttendance member={this.props.member}></MemberAttendance>
        </div>
      </div>
    )
  }
}

export default withRouter(MemberDetails)
