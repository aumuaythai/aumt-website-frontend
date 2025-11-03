import { Divider, Spin, notification } from 'antd'
import React, { useEffect } from 'react'
import { Link } from 'react-router'
import { useAuth } from '../../context/AuthProvider'
import { useConfig } from '../../context/ClubConfigProvider'
import { getOpenForms, listenToOneTraining, unlisten } from '../../services/db'
import { AumtWeeklyTraining } from '../../types'
import SignupForm from './SignupForm'

export default function Signups() {
  const { authedUser, authedUserId } = useAuth()
  const clubConfig = useConfig()

  const [forms, setForms] = React.useState<AumtWeeklyTraining[]>([])
  const [loadingForms, setLoadingForms] = React.useState<boolean>(true)

  const hasPaid = authedUser?.paid === 'Yes'
  const clubSignupSem = clubConfig?.clubSignupSem

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
    if (authedUser) {
      const displayName =
        authedUser.firstName +
        (authedUser.preferredName ? ` "${authedUser.preferredName}" ` : ' ') +
        authedUser.lastName
      return displayName
    } else {
      return null
    }
  }

  if (loadingForms || !clubSignupSem) {
    return <Spin />
  }

  if (!forms.length) {
    return (
      <div className="flex flex-col items-center">
        <p>Weekly training signups will open on Sundays on this page</p>
        <p>The current training schedule is:</p>
        <ul className="text-start list-none">
          <li>
            <b>Tuesday 4:30PM</b> Beginners
          </li>
          <li>
            <b>Wednesday 4:30PM</b> Intermediate
          </li>
          <li>
            <b>Wednesday 5:30PM</b> Women's Beginners
          </li>
          <li>
            <b>Thursday 4:30PM</b> Beginners
          </li>
          <li>
            <b>Friday 6:30PM</b> Intermediate
          </li>
        </ul>
      </div>
    )
  }

  return (
    <div>
      {forms.map((form) => {
        if (!form.openToPublic) {
          if (!authedUserId) {
            return (
              <div key={form.trainingId}>
                <h2 className="text-2xl">{form.title}</h2>
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
            authedUser &&
            (hasPaid || !form.paymentLock) &&
            (authedUser.membership === form.semester ||
              (authedUser.membership === 'FY' && form.semester !== 'SS'))
          ) {
            return (
              <div key={form.trainingId} className="max-w-[440px] px-4 mx-auto">
                <SignupForm
                  title={form.title}
                  id={form.trainingId}
                  closes={form.closes}
                  sessions={form.sessions}
                  displayName={getDisplayName()}
                  showNotes={true}
                  submittingAsName={
                    authedUser
                      ? `${authedUser.preferredName || authedUser.firstName} ${
                          authedUser.lastName
                        }`
                      : ''
                  }
                  authedUserId={authedUserId}
                  notes={form.notes}
                  signupMaxSessions={form.signupMaxSessions}
                  openToPublic={form.openToPublic}
                />
              </div>
            )
          } else if (
            authedUser &&
            ((authedUser.membership === 'FY' && form.semester === 'SS') ||
              (authedUser.membership !== 'FY' &&
                authedUser.membership !== form.semester))
          ) {
            return (
              <div
                key={form.trainingId}
                className="max-w-[440px] p-5 mx-auto text-left"
              >
                <h2 className="text-xl">{form.title}</h2>
                <p>
                  Your membership is out of date, please update it by going to
                  the <Link to="/account">My Account</Link> tab.
                </p>
              </div>
            )
          } else {
            return (
              <div
                key={form.trainingId}
                className="max-w-[440px] p-5 mx-auto text-left"
              >
                <h2 className="text-xl">{form.title}</h2>
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
            <div key={form.trainingId} className="max-w-[440px] px-4 mx-auto">
              <SignupForm
                title={form.title}
                id={form.trainingId}
                closes={form.closes}
                sessions={form.sessions}
                displayName={getDisplayName()}
                showNotes={true}
                submittingAsName={
                  authedUser
                    ? `${authedUser.preferredName || authedUser.firstName} ${
                        authedUser.lastName
                      }`
                    : ''
                }
                authedUserId={authedUserId}
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
