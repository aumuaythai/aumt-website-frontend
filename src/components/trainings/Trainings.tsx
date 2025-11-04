import { getDisplayName } from '@/lib/utils'
import { useTrainings } from '@/services/trainings'
import { Divider, Spin } from 'antd'
import { Link } from 'react-router'
import { useAuth } from '../../context/AuthProvider'
import { useConfig } from '../../context/ClubConfigProvider'
import SignupForm from './SignupForm'

export default function Trainings() {
  const { user, userId } = useAuth()
  const clubConfig = useConfig()
  const { data: trainings, isPending: isLoadingTrainings } = useTrainings()

  if (isLoadingTrainings || !clubConfig?.clubSignupSem || !trainings) {
    return <Spin />
  }

  if (!trainings.length) {
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

  if (!user) {
    return (
      <div>
        <p>
          You must <Link to="/login?from=/signups"> log in </Link> to view and
          sign up!
        </p>
        <h4>Not a member?</h4>
        <p>
          <Link to="/join">Join the club!</Link> Club signups are open at the
          beginning of each semester.
        </p>
      </div>
    )
  }

  return (
    <main className="max-w-lg mx-auto pt-8 px-6">
      {trainings.map((training) => {
        const isMembershipOutOfDate =
          (user.membership === 'FY' && training.semester === 'SS') ||
          (user.membership !== 'FY' && user.membership !== training.semester)

        if (training.openToPublic) {
          return (
            <SignupForm
              title={training.title}
              id={training.trainingId}
              closes={training.closes}
              sessions={training.sessions}
              displayName={getDisplayName(user)}
              showNotes={true}
              submittingAsName={
                user
                  ? `${user.preferredName || user.firstName} ${user.lastName}`
                  : ''
              }
              userId={userId}
              notes={training.notes}
              signupMaxSessions={training.signupMaxSessions}
              openToPublic={training.openToPublic}
            />
          )
        }

        if (!user.paid && training.paymentLock) {
          return (
            <div
              key={training.trainingId}
              className="max-w-[440px] p-5 mx-auto text-left"
            >
              <h2 className="text-xl">{training.title}</h2>
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

        if (isMembershipOutOfDate) {
          return (
            <>
              <h2 className="text-xl">{training.title}</h2>
              <p>
                Your membership is out of date, please update it by going to the{' '}
                <Link to="/account">My Account</Link> tab.
              </p>
            </>
          )
        }

        return (
          <SignupForm
            title={training.title}
            id={training.trainingId}
            closes={training.closes}
            sessions={training.sessions}
            displayName={getDisplayName(user)}
            showNotes={true}
            submittingAsName={
              user
                ? `${user.preferredName || user.firstName} ${user.lastName}`
                : ''
            }
            userId={userId}
            notes={training.notes}
            signupMaxSessions={training.signupMaxSessions}
            openToPublic={training.openToPublic}
          />
        )
      })}
    </main>
  )
}
