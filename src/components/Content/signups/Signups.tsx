import { Divider, Spin, notification } from 'antd'
import React, { useEffect } from 'react'
import { Link } from 'react-router-dom'
import {
  getOpenForms,
  listenToOneTraining,
  unlisten,
} from '../../../services/db'
import { AumtMember, AumtWeeklyTraining, ClubConfig } from '../../../types'
import SignupForm from './SignupForm'
import './Signups.css'

interface SignupProps {
  authedUser: AumtMember | null
  authedUserId: string | null
  paid: boolean
  clubSignupSem: 'S1' | 'S2' | 'loading' | 'SS'
  clubConfig: ClubConfig | null
}

export default function Signups(props: SignupProps) {
  const [forms, setForms] = React.useState<AumtWeeklyTraining[]>([])
  const [loadingForms, setLoadingForms] = React.useState<boolean>(true)

  useEffect(() => {
    let dbListenerIds: string[] = []

    const onDbChanges = (formId: string, newFormData: AumtWeeklyTraining) => {
      setForms((prevForms) =>
        prevForms.map((f) => (f.trainingId === formId ? newFormData : f))
      )
    }

    const setup = async () => {
      try {
        const fetchedForms = await getOpenForms()
        setForms(fetchedForms)
        setLoadingForms(false)

        dbListenerIds = fetchedForms.map((f) =>
          listenToOneTraining(f.trainingId, onDbChanges)
        )
      } catch (err) {
        notification.error({
          message: 'Error getting weekly trainings: ' + JSON.stringify(err),
        })
        setLoadingForms(false)
      }
    }

    setup()

    return () => {
      dbListenerIds.forEach((id) => unlisten(id))
    }
  }, [])

  const getDisplayName = (): string | null => {
    if (props.authedUser) {
      const displayName =
        props.authedUser.firstName +
        (props.authedUser.preferredName
          ? ` "${props.authedUser.preferredName}" `
          : ' ') +
        props.authedUser.lastName
      return displayName
    } else {
      return null
    }
  }

  if (loadingForms || props.clubSignupSem === 'loading') {
    return (
      <div>
        <Spin />
      </div>
    )
  }

  if (!forms.length) {
    return (
      <div className="infoContainer">
        <p>Weekly training signups will open on Sundays on this page</p>
        <p>The current training schedule is:</p>
        <ul className="scheduleList">
          <li>
            <b>Tuesday 4:30PM</b> Beginners
          </li>
          <li>
            <b>Wednesday 5:30PM</b> Women's Beginners{' '}
          </li>
          <li>
            <b>Thursday 4:30PM</b> Beginners{' '}
          </li>
          <li>
            <b>Friday 6:30PM</b> Intermediate{' '}
          </li>
        </ul>
      </div>
    )
  }

  return (
    <div className="signupsContainer">
      {forms.map((form) => {
        if (!form.openToPublic) {
          if (!props.authedUserId) {
            return (
              <div key={form.trainingId}>
                <h2>{form.title}</h2>
                <p>
                  You must <Link to="/login?from=/signups"> log in </Link> to
                  view and sign up!
                </p>
                <h4>Not a member?</h4>
                <p>
                  <Link to="/join">Join the club!</Link> Club signups are open
                  at the beginning of each semester.
                </p>
                <Divider />
              </div>
            )
          } else if (
            props.authedUser &&
            (props.authedUser.paid === 'Yes' || !form.paymentLock) &&
            (props.authedUser.membership === form.semester ||
              (props.authedUser.membership === 'FY' && form.semester !== 'SS'))
          ) {
            return (
              <div key={form.trainingId} className="formContainer">
                <SignupForm
                  title={form.title}
                  id={form.trainingId}
                  closes={form.closes}
                  sessions={form.sessions}
                  displayName={getDisplayName()}
                  showNotes={true}
                  submittingAsName={
                    props.authedUser
                      ? `${
                          props.authedUser.preferredName ||
                          props.authedUser.firstName
                        } ${props.authedUser.lastName}`
                      : ''
                  }
                  authedUserId={props.authedUserId}
                  notes={form.notes}
                  signupMaxSessions={form.signupMaxSessions}
                  openToPublic={form.openToPublic}
                />
              </div>
            )
          } else if (
            props.authedUser &&
            ((props.authedUser.membership === 'FY' && form.semester === 'SS') ||
              (props.authedUser.membership !== 'FY' &&
                props.authedUser.membership !== form.semester))
          ) {
            return (
              <div key={form.trainingId} className="signupsNotPaidContainer">
                <h2>{form.title}</h2>
                <p>
                  Your membership is out of date, please update it by going to
                  the <Link to="/account">My Account</Link> tab.
                </p>
              </div>
            )
          } else {
            return (
              <div key={form.trainingId} className="signupsNotPaidContainer">
                <h2>{form.title}</h2>
                <p>
                  Our records show you have not paid the membership fee for this
                  semester - once you do, you can sign up to trainings!
                </p>

                <Divider />

                <h3>This Week Only</h3>
                <p>
                  If you would like to pay at the training, message the AUMT
                  Facebook page - we will sign you up for the session of your
                  choice.
                </p>
                <br />
              </div>
            )
          }
        } else {
          return (
            <div key={form.trainingId} className="formContainer">
              <SignupForm
                title={form.title}
                id={form.trainingId}
                closes={form.closes}
                sessions={form.sessions}
                displayName={getDisplayName()}
                showNotes={true}
                submittingAsName={
                  props.authedUser
                    ? `${
                        props.authedUser.preferredName ||
                        props.authedUser.firstName
                      } ${props.authedUser.lastName}`
                    : ''
                }
                authedUserId={props.authedUserId}
                notes={form.notes}
                signupMaxSessions={form.signupMaxSessions}
                openToPublic={form.openToPublic}
              />
            </div>
          )
        }
      })}
    </div>
  )
}
