import { useAuth } from '@/context/use-auth'
import { generateMockUid } from '@/lib/utils'
import { useAddMemberToEvent } from '@/services/events'
import { zodResolver } from '@hookform/resolvers/zod'
import { Button, Form, Input } from 'antd'
import { useForm } from 'react-hook-form'
import { FormItem } from 'react-hook-form-antd'
import { EventSignup, eventSignupSchema } from '../../types'

export default function EventSignupForm({ eventId }: { eventId: string }) {
  const {
    control,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm<EventSignup>({
    resolver: zodResolver(eventSignupSchema),
  })

  const { user } = useAuth()
  const addMember = useAddMemberToEvent()

  async function onSubmit(data: EventSignup) {
    await addMember.mutateAsync({
      eventId,
      userId: user?.id ?? generateMockUid(),
      signupData: data,
    })
  }

  return (
    <main>
      <h2>Signup</h2>
      <Form onFinish={handleSubmit(onSubmit)}>
        <FormItem control={control} name="displayName" label="Display Name">
          <Input />
        </FormItem>
        <FormItem control={control} name="email" label="Email">
          <Input />
        </FormItem>
        <Button type="primary" htmlType="submit" loading={isSubmitting}>
          Submit
        </Button>
      </Form>
    </main>
  )
}
