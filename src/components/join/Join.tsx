import PaymentInstructions from '@/components/utility/PaymentInstructions'
import { useAuth } from '@/context/use-auth'
import { useConfig } from '@/services/config'
import { CheckCircleFilled } from '@ant-design/icons'
import { Spin } from 'antd'
import { Link } from 'react-router'
import JoinForm from './JoinForm'

export default function Join() {
  const auth = useAuth()
  const { data: clubConfig } = useConfig()

  const user = auth?.user

  if (!clubConfig) {
    return <Spin />
  }

  if (user) {
    return (
      <div className="pt-16 p-6 max-w-2xl mx-auto text-center">
        <CheckCircleFilled className="!text-green-500 text-7xl" />
        <h1 className="text-2xl mt-4 mb-8">You are a member of AUMT!</h1>

        {!user?.paid ? (
          <>
            <h2>However, membership payment is pending</h2>
            <PaymentInstructions
              membershipType={user.membership}
              paymentType={user.paymentType}
              clubConfig={clubConfig}
            />
          </>
        ) : (
          <>
            <h2>Our records show you have paid</h2>
            <p className="text-center">
              You can now sign up to{' '}
              <Link to="/signups" className="text-blue-500">
                weekly trainings
              </Link>
            </p>
          </>
        )}

        <h1 className="mt-6">Your Current Membership</h1>
        <p>
          Membership coverage:
          <b>
            {user.membership === 'S1' && ' Semester 1 '}
            {user.membership === 'S2' && ' Semester 2 '}
            {user.membership === 'SS' && ' Summer School '}
            {user.membership === 'FY' && ' Full Year (Semester 1 and 2)'}
          </b>
        </p>

        <p>
          Status:
          <b>{user.paid ? ' Paid ' : ' Not Paid '}</b>
        </p>
      </div>
    )
  }

  if (clubConfig.clubSignupStatus === 'closed') {
    return (
      <div className="p-6 text-center">
        Signups are closed until the next semester starts. Follow us on
        <a
          href="https://www.instagram.com/aumuaythai/"
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-500"
        >
          {' '}
          Instagram{' '}
        </a>
        or
        <a
          href="https://www.facebook.com/aumuaythai/"
          className="text-blue-500"
        >
          {' '}
          Facebook{' '}
        </a>
        for announcements.
      </div>
    )
  }

  return <JoinForm />
}
