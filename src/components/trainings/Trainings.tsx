import { useAuth } from '@/context/use-auth'
import { useConfig } from '@/services/config'
import { useOpenTrainings } from '@/services/trainings'
import { Divider, Spin } from 'antd'
import { Link } from 'react-router'
import TrainingForm from './TrainingForm'

export default function Trainings() {
  const auth = useAuth()
  const { data: clubConfig } = useConfig()
  const { data: trainings, isPending: isLoadingTrainings } = useOpenTrainings()

  const user = auth?.user

  if (isLoadingTrainings || !clubConfig?.clubSignupSem || !trainings) {
    return (
      <div>
        Loading trainings
        <Spin />
      </div>
    )
  }

  if (!trainings.length) {
    return (
      <div className="text-center max-w-lg mx-auto pt-8 px-6">
        <p>Weekly training signups will open on Sundays on this page</p>
        <p className="mt-4">The current training schedule is:</p>
        <ul className="list-none mt-4">
          {clubConfig.schedule.map((training) => (
            <li key={training.name}>
              <span className="font-medium">{training.name}</span>
            </li>
          ))}
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
          return <TrainingForm training={training} />
        }

        if (!user.paid && training.paymentLock) {
          return (
            <div
              key={training.id}
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

        return <TrainingForm training={training} />
      })}
    </main>
  )
}
