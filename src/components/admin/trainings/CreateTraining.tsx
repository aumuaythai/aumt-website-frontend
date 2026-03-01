import TimestampInput from '@/components/util/timestamp-input'
import { useConfig } from '@/services/config'
import { useCreateTraining } from '@/services/trainings'
import { Session, trainingSchema } from '@/types'
import { ArrowLeftOutlined, MinusCircleOutlined } from '@ant-design/icons'
import { zodResolver } from '@hookform/resolvers/zod'
import {
  Button,
  Checkbox,
  Form,
  Input,
  InputNumber,
  notification,
  Radio,
  Tabs,
} from 'antd'
import { Timestamp } from 'firebase/firestore'
import { useRef } from 'react'
import {
  Controller,
  FieldErrors,
  useFieldArray,
  useForm,
} from 'react-hook-form'
import { FormItem } from 'react-hook-form-antd'
import { Link } from 'react-router'
import z from 'zod'
import { RenderMarkdown } from '../../util/RenderMarkdown'

const TRAINING_DEFAULT_NOTES = `RULES/ETIQUETTE
1.    Keep the training area free until your session starts.
2.    No shoes on the mat
3.    Let the trainer know if you need to leave early or take a rest due to injury, medical reasons, etc.
4.    Wipe inside and outside of gear using provided wipes at the end of class.
5.    Put ALL training gear back in its designated place after use.`

const sessionFormSchema = z.object({
  title: z.string('Invalid session title').min(1, 'Session title is required'),
  limit: z.number('Invalid session limit').min(0, 'Session limit is required'),
})

const trainingFormSchema = trainingSchema.extend({
  sessions: z.array(sessionFormSchema),
})
type TrainingForm = z.infer<typeof trainingFormSchema>

export default function CreateTraining() {
  const populateWeekValue = useRef(1)
  const createTrainingMutation = useCreateTraining()
  const { data: config } = useConfig()

  const {
    formState: { isSubmitting },
    control,
    handleSubmit,
    watch,
    reset,
  } = useForm<TrainingForm>({
    resolver: zodResolver(trainingFormSchema),
  })

  const {
    fields: sessions,
    append,
    remove,
  } = useFieldArray({
    control,
    name: 'sessions',
  })

  function handlePopulateWeek() {
    if (!config) {
      return
    }

    const currentSemester = config.clubSignupSem
    const semesterStart =
      currentSemester === 'S1'
        ? config.semesterOneDate.toDate()
        : config.semesterTwoDate.toDate()

    const week =
      populateWeekValue.current >= 7
        ? populateWeekValue.current + 2
        : populateWeekValue.current
    const daysToSunday = (week - 1) * 7 - 1

    const newOpens = semesterStart
    newOpens.setDate(semesterStart.getDate() + daysToSunday)
    newOpens.setHours(0)

    const newCloses = new Date(newOpens)
    newCloses.setDate(newOpens.getDate() + 5)
    newCloses.setHours(20, 30, 0)

    const title = `Week ${populateWeekValue.current} Training Signups`

    reset({
      title,
      opens: Timestamp.fromDate(newOpens),
      closes: Timestamp.fromDate(newCloses),
      sessions: config.schedule,
      maxSessions: 1,
      semester: currentSemester,
      paymentLock: true,
      openToPublic: false,
      notes: TRAINING_DEFAULT_NOTES,
    })
  }

  function generateSessionId(length: number) {
    const digits = '1234567890qwertyuiopasdfghjklzxcvbnm'
    let id = ''
    for (let i = 0; i < length; i++) {
      id += digits[Math.floor(Math.random() * digits.length)]
    }
    return id
  }

  async function onSubmit(data: TrainingForm) {
    const sessions: Record<string, Session> = {}
    data.sessions.forEach((session, index) => {
      sessions[generateSessionId(10)] = {
        title: session.title,
        limit: session.limit,
        position: index,
        members: {},
      }
    })

    createTrainingMutation.mutate({
      ...data,
      sessions,
    })
  }

  function onInvalid(errors: FieldErrors<TrainingForm>) {
    console.log(errors)

    const firstError = Object.keys(errors)[0]
    if (firstError) {
      notification.error({
        message: errors[firstError]?.message,
      })
    }
  }

  const isEditing = false
  const notes = watch('notes')

  return (
    <div className="mx-auto max-w-2xl w-full pt-8 px-6">
      <h1 className="flex items-center gap-x-2.5 text-2xl">
        <Link to="/admin">
          <ArrowLeftOutlined />
        </Link>
        {isEditing ? 'Edit' : 'Create'} Training
      </h1>

      <div className="flex items-center gap-x-2 mt-4">
        <span className="text-sm">Use weekly training template for week: </span>
        <InputNumber
          defaultValue={1}
          min={1}
          onChange={(value) => (populateWeekValue.current = value ?? 1)}
        />
        <Button onClick={handlePopulateWeek}>Populate</Button>
      </div>

      <Form
        layout="vertical"
        className="!mt-4"
        onFinish={handleSubmit(onSubmit, onInvalid)}
      >
        <FormItem control={control} name="title" label="Title" className="mt-4">
          <Input />
        </FormItem>
        <TimestampInput control={control} name="opens" label="Opens" />
        <TimestampInput control={control} name="closes" label="Closes" />

        <span>Sessions</span>
        <ul className="flex flex-col gap-y-2 mt-2">
          {sessions.map((session, index) => (
            <li key={session.title} className="flex gap-x-2">
              <FormItem
                control={control}
                name={`sessions.${index}.title`}
                className="!mb-0 w-full"
              >
                <Input placeholder="Name" />
              </FormItem>
              <FormItem
                control={control}
                name={`sessions.${index}.limit`}
                className="!mb-0"
              >
                <InputNumber placeholder="Limit" />
              </FormItem>
              <button
                className="text-gray-400 hover:text-red-500"
                onClick={() => remove(index)}
              >
                <MinusCircleOutlined />
              </button>
            </li>
          ))}
        </ul>
        <Button
          onClick={() => append({ title: '', limit: 30 })}
          className="mt-2"
        >
          Add Session +
        </Button>

        <FormItem
          control={control}
          name="maxSessions"
          label="Max signups per member"
          className="!mt-4"
        >
          <InputNumber />
        </FormItem>

        <FormItem control={control} name="semester" label="Semester">
          <Radio.Group buttonStyle="solid">
            <Radio.Button value={'S1'}>Semester 1</Radio.Button>
            <Radio.Button value={'S2'}>Semester 2</Radio.Button>
            <Radio.Button value={'SS'}>Summer School</Radio.Button>
          </Radio.Group>
        </FormItem>

        <FormItem control={control} name="paymentLock" label="Payment Lock">
          <Radio.Group buttonStyle="solid">
            <Radio.Button value={true}>On</Radio.Button>
            <Radio.Button value={false}>Off</Radio.Button>
          </Radio.Group>
        </FormItem>

        <FormItem control={control} name="openToPublic">
          <Checkbox>Open to non-members?</Checkbox>
        </FormItem>

        <Tabs>
          <Tabs.TabPane tab="Edit" key="1">
            <Controller
              name="notes"
              control={control}
              render={({ field: { value, onChange } }) => (
                <Input.TextArea
                  value={value}
                  onChange={onChange}
                  placeholder="Enter markdown text"
                  autoSize={{ minRows: 2, maxRows: 26 }}
                />
              )}
            />
          </Tabs.TabPane>
          <Tabs.TabPane tab="Preview" key="2">
            <RenderMarkdown source={notes} />
          </Tabs.TabPane>
        </Tabs>

        <div className="flex gap-x-2.5 mt-6">
          <Button type="primary" htmlType="submit" loading={isSubmitting}>
            Save Training
          </Button>
          <Link to="/admin">
            <Button>Cancel</Button>
          </Link>
        </div>
      </Form>
    </div>
  )
}
