import MarkdownEditor from '@/components/utility/MarkdownEditor'
import { cn } from '@/lib/utils'
import { useCreateEvent, useEvent } from '@/services/events'
import type { Event } from '@/types'
import { eventSchema } from '@/types'
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
import { Controller, FieldErrors, useForm } from 'react-hook-form'
import { FormItem } from 'react-hook-form-antd'
import { Link, useNavigate, useParams } from 'react-router'

export default function CreateEvent() {
  const { eventId } = useParams()
  const navigate = useNavigate()

  const { data: event, isPending: isLoadingEvent } = useEvent(eventId!)
  const createEvent = useCreateEvent()

  const {
    control,
    formState: { isSubmitting, errors },
    handleSubmit,
    watch,
  } = useForm<Event>({
    resolver: zodResolver(eventSchema),
  })

  async function onValid(data: Event) {
    await createEvent.mutateAsync(data)
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
        <h1 className="text-2xl">Create Event</h1>
      </div>
      <Form layout="vertical" onFinish={handleSubmit(onValid, onInvalid)}>
        <h2 className="mt-4 text-lg">Details</h2>
        <FormItem control={control} name="title" label="Title">
          <Input placeholder="Casino Night" />
        </FormItem>

        <label htmlFor="date" className="mb-2 block">
          Date
        </label>
        <Controller
          name="date"
          control={control}
          render={({ field, fieldState: { error } }) => (
            <>
              <Input
                id="date"
                type="datetime-local"
                value={field.value?.toISOString().slice(0, -1)}
                className={cn(
                  'relative [&::-webkit-calendar-picker-indicator]:opacity-0 [&::-webkit-calendar-picker-indicator]:absolute [&::-webkit-calendar-picker-indicator]:size-full',
                  error && '!border-red-500'
                )}
                onChange={(e) => field.onChange(new Date(e.target.value + 'Z'))}
              />
              <div className="text-red-500 !mb-4">{error?.message}</div>
            </>
          )}
        />
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
        <FormItem control={control} name="signups">
          <Checkbox>Enable Signups</Checkbox>
        </FormItem>

        {/* <Controller
            control={control}
            name="signups"
            render={({ field }) => (
              <Checkbox
              checked={!!field.value}
              onChange={(e) =>
              field.onChange(
                e.target.checked
                ? {
                  opens: undefined,
                  closes: undefined,
                  openToNonMembers: false,
                  needAdminConfirm: false,
                  isCamp: false,
                  limit: 30,
                  }
                  : null
                  )
                  }
                  >
                  Enable Signups
                  </Checkbox>
                  )}
                  /> */}
        {signups && (
          <div>
            <label htmlFor="signups.opens" className="mb-2 block">
              Signups Open
            </label>
            <Controller
              name="signups.opens"
              control={control}
              render={({ field, fieldState: { error } }) => (
                <>
                  <Input
                    id="signups.opens"
                    type="datetime-local"
                    value={field.value?.toISOString().slice(0, -1)}
                    className={cn(
                      'relative [&::-webkit-calendar-picker-indicator]:opacity-0 [&::-webkit-calendar-picker-indicator]:absolute [&::-webkit-calendar-picker-indicator]:size-full',
                      error && '!border-red-500'
                    )}
                    onChange={(e) => field.onChange(new Date(e.target.value))}
                  />
                  <div className="text-red-500 !mb-4">{error?.message}</div>
                </>
              )}
            />
            <label htmlFor="signups.closes" className="mb-2 block">
              Signups Close
            </label>
            <Controller
              name="signups.closes"
              control={control}
              render={({ field, fieldState: { error } }) => (
                <>
                  <Input
                    id="signups.closes"
                    type="datetime-local"
                    value={field.value?.toISOString().slice(0, -1)}
                    className={cn(
                      'relative [&::-webkit-calendar-picker-indicator]:opacity-0 [&::-webkit-calendar-picker-indicator]:absolute [&::-webkit-calendar-picker-indicator]:size-full',
                      error && '!border-red-500'
                    )}
                    onChange={(e) => field.onChange(new Date(e.target.value))}
                  />
                  <div className="text-red-500 !mb-4">{error?.message}</div>
                </>
              )}
            />
            <FormItem
              control={control}
              name="signups.limit"
              label="Limit (optional)"
            >
              <InputNumber />
            </FormItem>
            <FormItem control={control} name="signups.needAdminConfirm">
              <Checkbox>Require Admin Approval</Checkbox>
            </FormItem>
            <FormItem control={control} name="signups.isCamp">
              <Checkbox>Include Drivers and Dietary Forms</Checkbox>
            </FormItem>
            <FormItem control={control} name="signups.openToNonMembers">
              <Checkbox>Open to Non-Members</Checkbox>
            </FormItem>
          </div>
        )}
        <div className="flex gap-x-2.5">
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
