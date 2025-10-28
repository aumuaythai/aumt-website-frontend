import { Alert } from 'antd'

export interface LoginErrorMessageProps {
  errorCode: string
}

const ERROR_MESSAGES = {
  'auth/user-not-found':
    'There is no user with this email address. Contact the club to make sure you are signed up',
  'auth/invalid-email': 'Email is not valid.',
  'auth/wrong-password': 'You have entered an incorrect password',
  default: 'Error logging in',
}

export default function LoginErrorMessage(props: LoginErrorMessageProps) {
  const message = ERROR_MESSAGES[props.errorCode] || ERROR_MESSAGES.default
  return <Alert type="error" message={message}></Alert>
}
