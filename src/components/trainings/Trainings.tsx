import { useAuth } from '@/context/use-auth'
import { useConfig } from '@/services/config'
import { useOpenTrainings } from '@/services/trainings'
import { Divider, Spin } from 'antd'
import { Link } from 'react-router'
import LoadingPage from '../LoadingPage'
import TrainingForm from './TrainingForm'

export default function Trainings() {
  const auth = useAuth()
  const { data: clubConfig } = useConfig()
  const { data: trainings, isPending: isLoadingTrainings } = useOpenTrainings()

  const user = auth?.user

  if (isLoadingTrainings || !clubConfig?.clubSignupSem || !trainings) {
    return <LoadingPage text="Loading trainings" />
  }

  const openTrainings = trainings.filter(
    (training) => training.opens.toDate() <= new Date(),
  )

  if (!openTrainings.length) {
    return (
      <div className="text-center max-w-lg mx-auto pt-8 px-6">
        <h1 className="text-xl">Signups closed</h1>
        <p className="mt-2 text-gray-00">
          Weekly training signups will open on Sundays on this page
        </p>
        <h2 className="mt-8 text-lg">Training schedule</h2>
        <ul className="list-none mt-2">
          {clubConfig.schedule.map((training) => (
            <li key={training.title}>
              <span>{training.title}</span>
            </li>
          ))}
        </ul>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="pt-8 px-6 flex flex-col items-center">
        <p>
          You must{' '}
          <Link to="/login?from=/trainings" className="text-blue-500">
            {' '}
            log in{' '}
          </Link>{' '}
          to sign up for trainings
        </p>
        <span className="mt-4 font-bold text-xl">Not a member?</span>
        <p>
          <Link to="/join">Join the club!</Link> Club signups are open at the
          beginning of each semester.
        </p>
      </div>
    )
  }

  return (
    <main className="max-w-lg mx-auto pt-8 px-6">
      {openTrainings.map((training) => {
        if (!user.paid && training.paymentLock) {
          return (
            <div key={training.id} className="max-w-110 p-5 mx-auto text-left">
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

        const isMembershipOutOfDate =
          (user.membership === 'FY' && training.semester === 'SS') ||
          (user.membership !== 'FY' && user.membership !== training.semester)

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
