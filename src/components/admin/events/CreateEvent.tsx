import MarkdownEditor from '@/components/utility/MarkdownEditor'
import { cn } from '@/lib/utils'
import { useCreateEvent, useEvent, useUpdateEvent } from '@/services/events'
import type { Event } from '@/types'
import { eventSchema, EventSignups } from '@/types'
import { ArrowLeftOutlined } from '@ant-design/icons'
import { zodResolver } from '@hookform/resolvers/zod'
import {
  Button,
  Checkbox,
  Form,
  Input,
  InputNumber,
  notification,
  Spin,
} from 'antd'
import { Timestamp } from 'firebase/firestore'
import { useRef } from 'react'
import {
  Controller,
  FieldErrors,
  UseControllerProps,
  useForm,
} from 'react-hook-form'
import { FormItem } from 'react-hook-form-antd'
import { Link, useNavigate, useParams } from 'react-router'

export default function CreateEvent() {
  const signupsRef = useRef<EventSignups | undefined>(undefined)

  const { eventId } = useParams()
  const navigate = useNavigate()

  const { data: event, isPending: isLoadingEvent } = useEvent(eventId!)
  const createEvent = useCreateEvent()
  const updateEvent = useUpdateEvent()

  if (signupsRef.current === undefined && event?.signups) {
    signupsRef.current = event.signups
  }

  const {
    control,
    formState: { isSubmitting },
    handleSubmit,
    watch,
    getValues,
    setValue,
  } = useForm<Event>({
    resolver: zodResolver(eventSchema),
    values: event,
  })

  function handleSignupsChange(value: boolean) {
    if (value && !signupsRef.current) {
      setValue('signups', {
        opens: Timestamp.now(),
        closes: Timestamp.now(),
        openToNonMembers: false,
        needAdminConfirm: false,
        isCamp: false,
        limit: null,
        members: {},
        waitlist: {},
      })
      return
    }

    if (value) {
      setValue('signups', signupsRef.current)
      return
    }

    signupsRef.current = getValues('signups')
    console.log(signupsRef.current)
    setValue('signups', undefined)
  }

  async function onValid(data: Event) {
    if (eventId) {
      await updateEvent.mutateAsync({ eventId, event: data })
    } else {
      await createEvent.mutateAsync(data)
    }
    navigate('/admin/events')
  }

  function onInvalid(errors: FieldErrors<Event>, g) {
    const firstError = Object.keys(errors)[0]
    if (firstError) {
      notification.error({
        message: errors[firstError]?.message,
      })
    }
  }

  if (eventId && isLoadingEvent) {
    return (
      <div>
        Loading event
        <Spin />
      </div>
    )
  }

  const signups = watch('signups')

  return (
    <div className="mx-auto p-6 pt-8 max-w-2xl w-full">
      <div className="flex items-center gap-x-2.5">
        <Link to="/admin/events">
          <ArrowLeftOutlined />
        </Link>
        <h1 className="text-2xl">{eventId ? 'Edit Event' : 'Create Event'}</h1>
      </div>
      <Form layout="vertical" onFinish={handleSubmit(onValid, onInvalid)}>
        <h2 className="mt-4 text-lg">Details</h2>
        <FormItem control={control} name="title" label="Title">
          <Input placeholder="Casino Night" />
        </FormItem>

        <TimestampInput name="date" control={control} label="Date" />
        <FormItem control={control} name="urlPath" label="Url Path">
          <Input placeholder="casino-night" />
        </FormItem>
        <FormItem control={control} name="description" label="Description">
          <MarkdownEditor />
        </FormItem>

        <FormItem control={control} name="location" label="Location">
          <Input placeholder="The Hawks' Nest Gym" />
        </FormItem>
        <FormItem control={control} name="locationLink" label="Maps Link">
          <Input placeholder="https://maps.app.goo.gl/u6GvtHHeazmszeTeA" />
        </FormItem>
        <FormItem control={control} name="photoPath" label="Photo URL">
          <Input placeholder="https://example.com/photo.jpg" />
        </FormItem>

        <h2 className="mt-4 text-lg">Signups</h2>
        <Checkbox
          className="!mt-4"
          checked={!!signups}
          onChange={(e) => handleSignupsChange(e.target.checked)}
        >
          Enable Signups
        </Checkbox>

        {signups && (
          <div className="mt-4">
            <TimestampInput
              control={control}
              name="signups.opens"
              label="Signups Open"
            />
            <TimestampInput
              control={control}
              name="signups.closes"
              label="Signups Close"
            />
            <FormItem
              control={control}
              name="signups.limit"
              label="Limit (optional)"
            >
              <InputNumber />
            </FormItem>
            <FormItem control={control} name="signups.needAdminConfirm">
              <Checkbox checked={signups?.needAdminConfirm}>
                Require Admin Approval
              </Checkbox>
            </FormItem>
            <FormItem control={control} name="signups.isCamp">
              <Checkbox checked={signups?.isCamp}>
                Include Drivers and Dietary Forms
              </Checkbox>
            </FormItem>
            <FormItem control={control} name="signups.openToNonMembers">
              <Checkbox checked={signups?.openToNonMembers}>
                Open to Non-Members
              </Checkbox>
            </FormItem>
          </div>
        )}
        <div className="flex gap-x-2.5 mt-4">
          <Button htmlType="submit" type="primary" loading={isSubmitting}>
            Submit Event
          </Button>
          <Link to="/admin/events">
            <Button>Cancel</Button>
          </Link>
        </div>
      </Form>
    </div>
  )
}

function TimestampInput({
  name,
  control,
  label,
}: UseControllerProps<Event, 'date' | 'signups.opens' | 'signups.closes'> & {
  label: string
}) {
  return (
    <>
      <label htmlFor={name} className="mb-2 block">
        {label}
      </label>
      <Controller
        name={name}
        control={control}
        render={({ field, fieldState: { error } }) => (
          <>
            <Input
              id={name}
              type="datetime-local"
              value={field.value?.toDate()?.toISOString().slice(0, -1)}
              className={cn(
                'relative [&::-webkit-calendar-picker-indicator]:opacity-0 [&::-webkit-calendar-picker-indicator]:absolute [&::-webkit-calendar-picker-indicator]:size-full',
                error && '!border-red-500'
              )}
              onChange={(e) =>
                field.onChange(
                  Timestamp.fromDate(new Date(e.target.value + 'Z'))
                )
              }
            />
            <div className="text-red-500 !mb-4">{error?.message}</div>
          </>
        )}
      />
    </>
  )
}
