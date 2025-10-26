import { Button, notification, Result, Spin } from 'antd'
import { Link } from 'react-router-dom'
import { useAuth } from '../../../context/AuthProvider'
import { useConfig } from '../../../context/ConfigProvider'
import { signOut } from '../../../services/auth'
import dataUtil from '../../../services/data.util'
import PaymentInstructions from '../../utility/PaymentInstructions'
import { JoinForm } from './JoinForm'

export default function MainJoin() {
  const { authedUser, authedUserId } = useAuth()
  const { clubConfig } = useConfig()

  const loadingAuthedUser = !!authedUser

  const onSignOutClick = () => {
    signOut().catch((err) => {
      notification.error({ message: 'Error signing out: ' + err.toString() })
    })
  }

  const copyText = (text: string) => {
    dataUtil.copyText(text)
  }

  const getExtraResultContent = () => {
    const lines: JSX.Element[] = []
    if (authedUser?.paid === 'No') {
      lines.push(
        <div>
          <h1>However, membership payment pending</h1>
          <PaymentInstructions
            membershipType={authedUser.membership}
            paymentType={authedUser.paymentType}
            clubConfig={clubConfig}
          />
        </div>
      )
    } else {
      lines.push(
        <div>
          <h1>Our records show you have paid</h1>
          <p className="text-center">
            You can now signup to our <a href="/signups">weekly training</a>{' '}
            sessions.
          </p>
        </div>
      )
    }

    if (clubConfig?.clubSignupStatus === 'open') {
      lines.push(
        <p key="1">
          <Button type="link" className="!px-1" onClick={onSignOutClick}>
            Log out
          </Button>
          and return to the signup page, or
          <Link to="/">
            <Button className="!px-1" type="link">
              visit home page
            </Button>
          </Link>
        </p>
      )
    }

    return lines
  }

  if (clubConfig === null || loadingAuthedUser) return <Spin />

  if (authedUser) {
    return (
      <div>
        <Result
          className="max-w-[700px] mx-auto"
          status="success"
          title="You are a member of AUMT!"
          extra={getExtraResultContent()}
        />
        <h1>Your Current Membership</h1>
        <p>
          Membership coverage:
          <b>
            {authedUser.membership === 'S1' ? ' Semester 1 ' : ''}
            {authedUser.membership === 'S2' ? ' Semester 2 ' : ''}
            {authedUser.membership === 'SS' ? ' Summer School ' : ''}
            {authedUser.membership === 'FY'
              ? ' Full Year (Semester 1 and 2)'
              : ''}
          </b>
        </p>
        <p>
          Status:
          <b>{authedUser.paid === 'Yes' ? ' Paid ' : ' Not Paid '}</b>
        </p>
      </div>
    )
  }

  if (clubConfig.clubSignupStatus === 'closed') {
    return (
      <div>
        Signups are closed until the next semester starts. Follow us on
        <a
          href="https://www.instagram.com/aumuaythai/"
          target="_blank"
          rel="noopener noreferrer"
        >
          {' '}
          Instagram{' '}
        </a>
        or
        <a href="https://www.facebook.com/aumuaythai/"> Facebook </a>
        for announcements.
      </div>
    )
  }

  return (
    <div>
      <JoinForm clubConfig={clubConfig} isAdmin={false}></JoinForm>
    </div>
  )
}
