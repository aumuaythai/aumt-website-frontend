import { useCreateEvent, useEvent } from '@/services/events'
import { ArrowLeftOutlined } from '@ant-design/icons'
import { zodResolver } from '@hookform/resolvers/zod'
import {
  Button,
  Checkbox,
  DatePicker,
  Input,
  InputNumber,
  notification,
  Spin,
} from 'antd'
import { Moment } from 'moment'
import { useState } from 'react'
import { Controller, FieldErrors, useForm } from 'react-hook-form'
import { Link, useParams } from 'react-router'
import z from 'zod'
import { Event } from '../../../types'
import MarkdownEditor from '../../utility/MarkdownEditor'

const eventSchema = z.object({
  title: z.string('Title is invalid').min(1, 'Title is required'),
  urlPath: z.string('URL Path is invalid').min(1, 'URL Path is required'),
  description: z
    .string('Description is invalid')
    .min(1, 'Description is required'),
  photoPath: z.string().optional(),
  date: z.refine((date) => (date as Moment)?.isValid(), 'Date is invalid'),
  location: z.string('Location is invalid').min(1, 'Location is required'),
  locationLink: z.url().optional(),
  fbLink: z.url().optional(),
  signups: z
    .object({
      opens: z.refine(
        (date) => (date as Moment)?.isValid(),
        'Open date is invalid'
      ),
      closes: z.refine(
        (date) => (date as Moment)?.isValid(),
        'Close date is invalid'
      ),
      openToNonMembers: z.boolean(),
      limit: z.number(),
      needAdminConfirm: z.boolean(),
      isCamp: z.boolean(),
    })
    .optional(),
})

type EventForm = z.infer<typeof eventSchema>

export default function CreateEvent() {
  const [hasLimit, setHasLimit] = useState(false)

  const { eventId } = useParams()

  const { data: event, isPending: isLoadingEvent } = useEvent(eventId!)
  const createEvent = useCreateEvent()

  const {
    control,
    formState: { isSubmitting },
    handleSubmit,
    watch,
  } = useForm<EventForm>({
    resolver: zodResolver(eventSchema),
  })

  async function onValid(data: EventForm) {
    const eventData: Event = {
      title: data.title,
      urlPath: data.urlPath,
      description: data.description,
      photoPath: data.photoPath ?? '',
      date: (data.date as Moment).toDate(),
      location: data.location,
      locationLink: data.locationLink ?? '',
      fbLink: data.fbLink ?? '',
      signups: data.signups
        ? {
            opens: (data.signups.opens as unknown as Moment).toDate(),
            closes: (data.signups.closes as unknown as Moment).toDate(),
            openToNonMembers: data.signups.openToNonMembers ?? false,
            needAdminConfirm: data.signups.needAdminConfirm ?? false,
            isCamp: data.signups.isCamp ?? false,
            limit: data.signups.limit ?? 30,
            members: {},
            waitlist: {},
          }
        : null,
    }

    await createEvent.mutateAsync(eventData)
  }

  function onInvalid(errors: FieldErrors<EventForm>) {
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
    <form
      onSubmit={handleSubmit(onValid, onInvalid)}
      className="mx-auto p-6 pt-8 max-w-2xl w-full flex flex-col gap-y-6"
    >
      <div className="flex items-center gap-x-2.5">
        <Link to="/admin/events">
          <ArrowLeftOutlined />
        </Link>
        <h1 className="text-2xl">Create Event</h1>
      </div>

      <div>
        <h2>Event</h2>
        <label htmlFor="">Title</label>
        <Controller
          control={control}
          name="title"
          render={({ field }) => (
            <Input
              placeholder="Casino Night"
              value={field.value}
              onChange={field.onChange}
            />
          )}
        />
        <label htmlFor="">Url Path</label>
        <Controller
          control={control}
          name="urlPath"
          render={({ field }) => (
            <Input
              placeholder="casino-night"
              value={field.value}
              onChange={field.onChange}
            />
          )}
        />
        <Controller
          control={control}
          name="description"
          render={({ field }) => (
            <MarkdownEditor onChange={field.onChange} value={field.value} />
          )}
        />
      </div>

      <div>
        <h2>Details</h2>
        <label htmlFor="">Date</label>
        <Controller
          control={control}
          name="date"
          render={({ field }) => (
            <DatePicker
              showTime
              value={field.value}
              className="w-full"
              onChange={field.onChange}
            />
          )}
        />
        <label htmlFor="">Location</label>
        <Controller
          control={control}
          name="location"
          render={({ field }) => (
            <Input
              placeholder="The Hawks' Nest Gym"
              value={field.value}
              onChange={field.onChange}
            />
          )}
        />
        <label htmlFor="">Maps Link</label>
        <Controller
          control={control}
          name="locationLink"
          render={({ field }) => (
            <Input
              placeholder="https://maps.app.goo.gl/u6GvtHHeazmszeTeA"
              value={field.value}
              onChange={field.onChange}
            />
          )}
        />
        <label htmlFor="">Photo URL</label>
        <Controller
          control={control}
          name="photoPath"
          render={({ field }) => (
            <Input
              value={field.value}
              placeholder="https://example.com/photo.jpg"
              onChange={field.onChange}
            />
          )}
        />
      </div>

      <div>
        <h2>Signups</h2>

        <Controller
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
        />

        {signups && (
          <div>
            <label htmlFor="">Signups Open</label>
            <Controller
              control={control}
              name="signups.opens"
              render={({ field }) => (
                <DatePicker
                  value={field.value}
                  className="w-full"
                  onChange={field.onChange}
                />
              )}
            />
            <label htmlFor="">Signups Close</label>
            <Controller
              control={control}
              name="signups.closes"
              render={({ field }) => (
                <DatePicker
                  value={field.value}
                  className="w-full"
                  onChange={field.onChange}
                />
              )}
            />
            <div>
              <Checkbox
                checked={hasLimit}
                onChange={(e) => setHasLimit(e.target.checked)}
              >
                Limit:
              </Checkbox>
              <Controller
                control={control}
                name="signups.limit"
                render={({ field }) => (
                  <InputNumber
                    disabled={!hasLimit}
                    value={field.value}
                    onChange={field.onChange}
                  />
                )}
              />
            </div>
            <div>
              <Controller
                control={control}
                name="signups.needAdminConfirm"
                render={({ field }) => (
                  <Checkbox checked={field.value} onChange={field.onChange}>
                    Need Admin Confirmation?
                  </Checkbox>
                )}
              />
            </div>
            <Controller
              control={control}
              name="signups.isCamp"
              render={({ field }) => (
                <Checkbox checked={field.value} onChange={field.onChange}>
                  Include Drivers and Dietary Requirement Form
                </Checkbox>
              )}
            />
            <Controller
              control={control}
              name="signups.openToNonMembers"
              render={({ field }) => (
                <Checkbox checked={field.value} onChange={field.onChange}>
                  Non Members can sign themselves up (admin can sign up anyone
                  regardless)
                </Checkbox>
              )}
            />
          </div>
        )}
      </div>

      <div className="flex gap-x-2.5">
        <Button htmlType="submit" type="primary" loading={isSubmitting}>
          Submit Event
        </Button>
        <Link to="/admin/events">
          <Button>Cancel</Button>
        </Link>
      </div>
    </form>
  )
}
