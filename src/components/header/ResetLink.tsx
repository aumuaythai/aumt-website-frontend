import UserOutlined from '@ant-design/icons/UserOutlined'
import { zodResolver } from '@hookform/resolvers/zod'
import { Alert, Input, Modal, notification } from 'antd'
import { FirebaseError } from 'firebase/app'
import { ReactNode, useState } from 'react'
import { Controller, FieldErrors, useForm } from 'react-hook-form'
import { z } from 'zod'
import { sendPasswordResetEmail } from '../../services/auth'

type ResetPasswordLinkProps = {
  className?: string
  children?: ReactNode
}

const resetPasswordSchema = z.object({
  email: z.email('Invalid email').min(1, 'Email is required'),
})

type ResetPasswordForm = z.infer<typeof resetPasswordSchema>

export default function ResetPasswordLink({
  className,
  children,
}: ResetPasswordLinkProps) {
  const [open, setOpen] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const { control, reset, handleSubmit } = useForm<ResetPasswordForm>({
    resolver: zodResolver(resetPasswordSchema),
  })

  async function onValid(data: ResetPasswordForm) {
    setIsSubmitting(true)
    try {
      await sendPasswordResetEmail(data.email)
      setOpen(false)
      notification.success({
        message: 'Reset email sent',
      })
    } catch (error) {
      if (error instanceof FirebaseError) {
        let errorText = 'Error sending reset email'
        if (error.code === 'auth/user-not-found') {
          errorText =
            "No usesr found for email. Contact the club to make sure you're signed up."
        } else if (error.code === 'auth/invalid-email') {
          errorText = 'Invalid Email.'
        }
        setError(errorText)
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  function onInvalid(errors: FieldErrors<ResetPasswordForm>) {
    const firstError = Object.keys(errors)[0]
    if (firstError) {
      setError(errors[firstError]?.message)
    }
  }

  function handleCancel() {
    setError(null)
    setOpen(false)
    reset()
  }

  return (
    <>
      <button onClick={() => setOpen(true)} className={className}>
        {children}
      </button>
      <Modal
        title="Reset Password"
        open={open}
        onOk={handleSubmit(onValid, onInvalid)}
        confirmLoading={isSubmitting}
        onCancel={handleCancel}
        okText="Send Reset Email"
      >
        {error && <Alert type="error" message={error} />}
        <Controller
          control={control}
          name="email"
          render={({ field }) => (
            <Input
              type="email"
              placeholder="Email"
              prefix={<UserOutlined />}
              value={field.value}
              className="mt-2"
              onChange={field.onChange}
            />
          )}
        />
      </Modal>
    </>
  )
}
