import LockOutlined from '@ant-design/icons/lib/icons/LockOutlined'
import UserOutlined from '@ant-design/icons/UserOutlined'
import { zodResolver } from '@hookform/resolvers/zod'
import { Button, Input, notification } from 'antd'
import { Controller, FieldErrors, useForm } from 'react-hook-form'
import { Link, useNavigate, useSearchParams } from 'react-router'
import z from 'zod'
import { signIn } from '../../services/auth'
import ResetPasswordLink from '../header/ResetLink'
import Logo from '../svg/Logo'

export interface LoginState {
  username: string
  password: string
  isAuthed: boolean
  authing: boolean
  errorCode: string
}

const ERROR_MESSAGES = {
  'auth/user-not-found':
    "There is no user with this email address. Contact the club to make sure you're signed up.",
  'auth/invalid-email': 'Email is not valid.',
  'auth/wrong-password': 'You have entered an incorrect password.',
  default: 'Error logging in.',
}

const loginSchema = z.object({
  email: z.email('Invalid email').min(1, 'Email is required'),
  password: z.string('Invalid password').min(1, 'Password is required'),
})

type LoginForm = z.infer<typeof loginSchema>

export default function LoginForm() {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()

  const from = searchParams.get('from') || '/'

  const {
    control,
    formState: { isSubmitting },
    handleSubmit,
  } = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
  })

  async function onSubmit(data: LoginForm) {
    try {
      await signIn(data.email, data.password)
      navigate(from)
    } catch (error: any) {
      notification.error({
        message: 'Error logging in',
        description: ERROR_MESSAGES[error.code] || ERROR_MESSAGES.default,
      })
    }
  }

  function handleError(error: FieldErrors<LoginForm>) {
    const firstError = Object.keys(error)[0]
    if (firstError) {
      notification.error({
        message: error[firstError]?.message,
      })
    }
  }

  return (
    <div className="mx-auto p-6 pt-24 max-w-sm">
      <Link to="/">
        <Logo className="max-w-48 mx-auto" />
      </Link>
      <h2 className="mt-1 text-center">Sign In</h2>
      <form
        onSubmit={handleSubmit(onSubmit, handleError)}
        className="mt-2 flex flex-col gap-y-2"
      >
        <Controller
          control={control}
          name="email"
          render={({ field: { value, onChange } }) => (
            <Input
              type="email"
              placeholder="Email"
              autoFocus
              value={value}
              prefix={<UserOutlined />}
              onChange={onChange}
            />
          )}
        />
        <Controller
          control={control}
          name="password"
          render={({ field: { value, onChange } }) => (
            <Input.Password
              value={value}
              placeholder="●●●●●●●●"
              prefix={<LockOutlined />}
              onChange={onChange}
            />
          )}
        />
        <Button htmlType="submit" loading={isSubmitting}>
          Log in
        </Button>
      </form>

      <ResetPasswordLink className="text-sm mt-2 cursor-pointer hover:text-blue-400 text-blue-500 block mx-auto">
        Reset Password
      </ResetPasswordLink>
    </div>
  )
}
