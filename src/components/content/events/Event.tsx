import {
  ArrowLeftOutlined,
  CalendarOutlined,
  ClockCircleOutlined,
  FacebookOutlined,
  HomeOutlined,
} from '@ant-design/icons'
import { Button, Divider, notification, Result } from 'antd'
import moment from 'moment'
import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import { getCurrentUid } from '../../../services/auth'
import dataUtil from '../../../services/data.util'
import { removeMemberFromEvent, signUpToEvent } from '../../../services/db'
import {
  AumtCampSignupData,
  AumtEvent,
  AumtMember,
  LicenseClasses,
} from '../../../types'
import { RenderMarkdown } from '../../utility/RenderMarkdown'
import { CampSignupForm } from './CampSignupForm'

interface EventProps {
  event: AumtEvent
  authedUser: AumtMember | null
}

interface EventState {
  displayDate: string
  displayTime: string
  signedUp: boolean
  waitlisted: boolean
  confirmedSignUp: boolean
  reservingSpot: boolean
  waitlistingMember: boolean
  withdrawingSpot: boolean
  currentOwnsCar: boolean | undefined
  currentSeats: number | undefined
  currentLicenseClass: LicenseClasses | ''
  currentDietaryRequirements: string
  currentPhoneNumber: string
}

export class Event extends Component<EventProps, EventState> {
  constructor(props: EventProps) {
    super(props)
    const options: Intl.DateTimeFormatOptions = {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    }
    const dateString = this.props.event.date.toLocaleDateString(
      undefined,
      options
    )
    const isAm = this.props.event.date.getHours() <= 11
    const displayTime = `${
      this.props.event.date.getHours() <= 12
        ? this.props.event.date.getHours()
        : this.props.event.date.getHours() - 12
    }:${('0' + String(this.props.event.date.getMinutes())).slice(-2)} ${
      isAm ? 'AM' : 'PM'
    }`
    const signupInfo = this.getSignupInfo()
    const waitlistedInfo = this.getWaitlistedInfo()
    this.state = {
      displayDate: dateString,
      displayTime,
      signedUp: !!signupInfo,
      waitlisted: !!waitlistedInfo,
      confirmedSignUp: !!signupInfo && signupInfo.confirmed,
      currentOwnsCar: (!!signupInfo && !!signupInfo.seatsInCar) || undefined,
      currentSeats: (signupInfo && signupInfo.seatsInCar) || undefined,
      currentDietaryRequirements:
        (signupInfo && signupInfo.dietaryRequirements) || '',
      currentPhoneNumber: (signupInfo && signupInfo.phoneNumber) || '',
      currentLicenseClass: (signupInfo && signupInfo.driverLicenseClass) || '',
      reservingSpot: false,
      withdrawingSpot: false,
      waitlistingMember: false,
    }
  }
  generateMockUid = () => {
    const alphabet = '1234567890qwertyuiopasdfghjklzxcvbnm'
    let uid = 'NONMEMBER'
    for (let i = 0; i < 10; i++) {
      uid += alphabet[Math.floor(Math.random() * alphabet.length)]
    }
    return uid
  }
  getSignupInfo = () => {
    const uid = getCurrentUid()
    if (uid) {
      return this.props.event.signups?.members[uid]
    }
    return null
  }
  getWaitlistedInfo = () => {
    const uid = getCurrentUid()
    if (uid) {
      return this.props.event.signups?.waitlist[uid]
    }
    return null
  }
  onSignupFormSubmit = (
    isWaitlist: boolean,
    signupData?: AumtCampSignupData
  ) => {
    const displayName = this.props.authedUser
      ? `${this.props.authedUser.firstName} ${this.props.authedUser.lastName}`
      : signupData?.name
    const email = this.props.authedUser
      ? this.props.authedUser.email
      : signupData?.email
    if (!displayName || !email) {
      notification.error({ message: 'Name and email required' })
      return
    }
    if (!isWaitlist) {
      this.setState({ ...this.state, reservingSpot: true })
    } else {
      this.setState({ ...this.state, waitlistingMember: true })
    }
    const confirmed = this.props.event.signups?.needAdminConfirm ? false : true
    signUpToEvent(
      this.props.event.id,
      getCurrentUid() || this.generateMockUid(),
      Object.assign(signupData || {}, {
        displayName,
        timeSignedUpMs: new Date().getTime(),
        confirmed,
        email,
      }),
      isWaitlist
    )
      .then(() => {
        if (isWaitlist) {
          this.setState({ ...this.state, waitlisted: true })
        } else {
          this.setState({
            ...this.state,
            signedUp: true,
            confirmedSignUp: confirmed,
          })
        }
      })
      .catch((err) => {
        notification.error({
          message: 'Error signing up to event: ' + err.toString(),
        })
      })
      .finally(() => {
        this.setState({
          ...this.state,
          reservingSpot: false,
          waitlistingMember: false,
        })
      })
  }
  copyText = (text: string) => {
    dataUtil.copyText(text)
  }
  getWaitlistPosition = (): string => {
    const uid = getCurrentUid()
    if (uid && this.props.event.signups && this.props.event.signups.waitlist) {
      const keys = Object.keys(this.props.event.signups.waitlist)
      const sortedKeys = keys.sort((a, b) => {
        if (this.props.event.signups) {
          const dataA = this.props.event.signups.waitlist[a]
          const dataB = this.props.event.signups.waitlist[b]
          return dataA.timeSignedUpMs - dataB.timeSignedUpMs
        }
        return 0
      })
      const position = sortedKeys.indexOf(uid) + 1
      if (position > 0) {
        return 'number ' + position
      }
    }
    return ''
  }
  onWithdrawClick = () => {
    this.setState({ ...this.state, withdrawingSpot: true })
    const firebaseUid = getCurrentUid()
    removeMemberFromEvent(
      firebaseUid || this.generateMockUid(),
      this.props.event.id
    )
      .then(() => {
        if (firebaseUid && this.props.event.signups) {
          delete this.props.event.signups.members[firebaseUid]
        }
        this.setState({
          ...this.state,
          signedUp: false,
          confirmedSignUp: false,
        })
      })
      .catch((err) => {
        notification.error({
          message: 'Error withdrawing from event: ' + err.toString(),
        })
      })
      .finally(() => {
        this.setState({ ...this.state, withdrawingSpot: false })
      })
  }
  render() {
    console.log(this.state.displayTime)
    return (
      <div className="max-w-[500px] text-center mx-auto p-[30px]">
        <div className="flex justify-between">
          <p className="text-black !mt-[5px]">
            <Link title="Back to Events" to="/events">
              <ArrowLeftOutlined />
            </Link>
          </p>
          <h2>{this.props.event.title}</h2>
          <div className="w-[14px]" />
        </div>
        <div className="text-left mx-auto p-5">
          <div className="p-[5px]">
            <CalendarOutlined /> {this.state.displayDate}
          </div>
          <div className="p-[5px]">
            <ClockCircleOutlined /> {this.state.displayTime}
          </div>
          <div className="p-[5px]">
            <HomeOutlined />{' '}
            {this.props.event.locationLink ? (
              <a
                href={this.props.event.locationLink}
                target="_blank"
                rel="noopener noreferrer"
              >
                {this.props.event.location}
              </a>
            ) : (
              this.props.event.location
            )}
          </div>
          {this.props.event.fbLink ? (
            <div className="p-[5px]">
              <FacebookOutlined />{' '}
              <a
                href={this.props.event.fbLink}
                target="_blank"
                rel="noopener noreferrer"
              >
                {this.props.event.fbLink}
              </a>
            </div>
          ) : null}
        </div>
        <Divider />
        <div className="text-left">
          <RenderMarkdown
            source={this.props.event.description}
          ></RenderMarkdown>
        </div>
        <Divider />
        {(() => {
          if (this.props.event.signups) {
            const { signups } = this.props.event
            if (this.state.signedUp) {
              return (
                <div>
                  <Result
                    status="success"
                    title="Thank you for signing up!"
                    subTitle={
                      !this.state.confirmedSignUp
                        ? 'Once the committee recieves your payment, you spot will be fully reserved'
                        : this.props.event.signups.needAdminConfirm
                        ? 'Our records show you have paid, your spot is confirmed'
                        : ''
                    }
                  ></Result>
                  <Button
                    type="link"
                    loading={this.state.withdrawingSpot}
                    onClick={this.onWithdrawClick}
                  >
                    Withdraw Signup
                  </Button>
                </div>
              )
            }
            if (this.state.waitlisted) {
              return (
                <div>
                  <p>
                    You are currently {this.getWaitlistPosition() || ''} on the
                    event waitlist.
                  </p>
                  <p>If a spot frees up the committee will let you know!</p>
                </div>
              )
            }
            return (
              <div>
                {signups.opens > new Date() ? (
                  <div>
                    Signups will open {moment(signups.opens).format('MMMM Do')}
                  </div>
                ) : signups.closes < new Date() ? (
                  <div>Signups have closed!</div>
                ) : !this.props.authedUser &&
                  !this.props.event.signups.openToNonMembers ? (
                  <div>
                    <p>
                      You must{' '}
                      <Link
                        to={`/login?from=/events/${this.props.event.urlPath}`}
                      >
                        {' '}
                        log in{' '}
                      </Link>{' '}
                      to reserve your place.
                    </p>
                    <h4>Don't have an account?</h4>
                    <p>
                      Please create a free <Link to={`/join`}>account</Link>{' '}
                      with us. Once you do you can signup to this event.
                    </p>
                  </div>
                ) : this.props.event.signups.limit &&
                  this.props.event.signups.limit <=
                    Object.keys(this.props.event.signups.members).length ? (
                  <div>
                    <h4>Signups are currently full</h4>
                    <p className="text-left">
                      Fill out the form below to join the waitlist and the
                      committee will message you if a spot opens.
                    </p>
                    <CampSignupForm
                      isCamp={this.props.event.signups.isCamp}
                      includeNameAndEmail={!this.props.authedUser}
                      isWaitlist={true}
                      onSubmit={(data) => this.onSignupFormSubmit(true, data)}
                      submitting={this.state.waitlistingMember}
                    ></CampSignupForm>
                  </div>
                ) : (
                  <div>
                    <h2>Signups</h2>
                    {this.props.event.signups.isCamp ? (
                      <CampSignupForm
                        isCamp={this.props.event.signups.isCamp}
                        includeNameAndEmail={!this.props.authedUser}
                        isWaitlist={false}
                        onSubmit={(data) =>
                          this.onSignupFormSubmit(false, data)
                        }
                        submitting={this.state.reservingSpot}
                      ></CampSignupForm>
                    ) : (
                      <Button
                        loading={this.state.reservingSpot}
                        type="primary"
                        block
                        className="mt-2.5"
                        onClick={(e) => this.onSignupFormSubmit(false)}
                      >
                        Reserve a Spot
                      </Button>
                    )}
                  </div>
                )}
              </div>
            )
          } else {
            return ''
          }
        })()}
      </div>
    )
  }
}
