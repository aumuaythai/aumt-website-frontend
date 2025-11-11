import { useAuth } from '@/context/use-auth'
import { getDisplayName } from '@/lib/utils'
import { TrainingWithId, useUpdateMemberSessions } from '@/services/trainings'
import { zodResolver } from '@hookform/resolvers/zod'
import { Button, Checkbox, Form, Input } from 'antd'
import { CheckboxOptionType } from 'antd/lib/checkbox'
import { FieldErrors, useForm } from 'react-hook-form'
import { FormItem } from 'react-hook-form-antd'
import z from 'zod'
import { RenderMarkdown } from '../utility/RenderMarkdown'

export interface TrainingForm {
  training: TrainingWithId
}

export default function TrainingForm({ training }: TrainingForm) {
  const auth = useAuth()
  const updateMemberSessions = useUpdateMemberSessions()

  const signupFormSchema = z.object({
    sessions: z
      .array(z.string())
      .max(
        training.signupMaxSessions,
        'You can only select up to ${props.signupMaxSessions} sessions'
      ),
    feedback: z.string().optional(),
  })

  type SignupForm = z.infer<typeof signupFormSchema>

  const user = auth?.user

  const signedUpSessions = Object.keys(training.sessions).filter(
    (sessionId) => {
      if (!user?.id) {
        return false
      }

      return training.sessions[sessionId].members[user.id]
    }
  )

  const { control, watch, handleSubmit } = useForm<SignupForm>({
    resolver: zodResolver(signupFormSchema),
    values: {
      sessions: signedUpSessions,
    },
  })

  function onValid(data: SignupForm) {
    if (!user?.id) {
      return
    }

    updateMemberSessions.mutate({
      userId: user.id,
      displayName: getDisplayName(user),
      trainingId: training.id,
      sessionIds: data.sessions,
    })
  }

  function onInvalid(errors: FieldErrors<SignupForm>) {
    console.log(errors)
  }

  const sessions = watch('sessions')
  const options: CheckboxOptionType[] = Object.values(training.sessions)
    .sort((a, b) => a.position - b.position)
    .map((session) => {
      const isFull = session.limit <= Object.keys(session.members).length
      const spotsLeft = Math.max(
        0,
        session.limit - Object.keys(session.members).length
      )
      const isDisabled =
        isFull ||
        (!sessions.includes(session.sessionId) &&
          sessions.length >= training.signupMaxSessions)

      return {
        label: session.title,
        value: session.sessionId,
        disabled: isDisabled,
        className:
          '!p-4 bg-gray-100 border border-gray-200 hover:border-gray-300 transition-colors',
      }
    })

  const isMutating = updateMemberSessions.isPending

  return (
    <>
      <h2 className="text-xl">{training.title}</h2>
      {training.notes && (
        <div className="text-sm mt-4">
          <RenderMarkdown source={training.notes} />
        </div>
      )}
      <Form layout="vertical" onFinish={handleSubmit(onValid, onInvalid)}>
        <FormItem control={control} name="sessions">
          <Checkbox.Group
            options={options}
            className="flex flex-col gap-y-2 w-full !mt-6"
          />
        </FormItem>
        <FormItem
          control={control}
          name="feedback"
          label="Thoughts on last training/feedback? (anonymous)"
          className="!mt-10"
        >
          <Input.TextArea />
        </FormItem>
        <Button
          type="primary"
          htmlType="submit"
          className="w-full !font-joyride"
          size="large"
          loading={isMutating}
        >
          Submit
        </Button>
      </Form>
    </>
  )
}
