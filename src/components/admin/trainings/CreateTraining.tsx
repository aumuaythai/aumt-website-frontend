import { ArrowLeftOutlined, MinusCircleOutlined } from '@ant-design/icons'
import { zodResolver } from '@hookform/resolvers/zod'
import { useQuery } from '@tanstack/react-query'
import {
  Button,
  Checkbox,
  DatePicker,
  Input,
  InputNumber,
  notification,
  Radio,
  Spin,
  Tabs,
} from 'antd'
import moment from 'moment'
import React, { useRef } from 'react'
import {
  Controller,
  FieldErrors,
  useFieldArray,
  useForm,
} from 'react-hook-form'
import { Link, useParams } from 'react-router'
import z from 'zod'
import { getOpenForms, submitNewForm } from '../../../services/db'
import { AumtTrainingSession } from '../../../types'
import { RenderMarkdown } from '../../utility/RenderMarkdown'
import AdminStore from '../AdminStore'

const TRAINING_DEFAULT_NOTES = `RULES/ETIQUETTE
1.    Keep the training area free until your session starts.
2.    No shoes on the mat
3.    Let the trainer know if you need to leave early or take a rest due to injury, medical reasons, etc.
4.    Wipe inside and outside of gear using provided wipes at the end of class.
5.    Put ALL training gear back in its designated place after use.`

const trainingSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  opens: z.any(),
  closes: z.any(),
  sessions: z.array(
    z.object({
      title: z.string().min(1, 'Session title is required'),
      limit: z.number().min(0, 'Session limit is required'),
    })
  ),
  openToPublic: z.boolean(),
  notes: z.string(),
  maxSessions: z.number().min(1, 'Max sessions must be at least 1'),
  semester: z.enum(['S1', 'S2', 'SS']),
  paymentLock: z.boolean(),
})

export default function CreateTraining() {
  const populateWeekValue = useRef(1)
  const hasPopulated = useRef(false)

  const { trainingId } = useParams()

  const {
    handleSubmit,
    watch,
    setValue,
    formState: { isSubmitting },
    control,
  } = useForm<z.infer<typeof trainingSchema>>({
    defaultValues: {
      openToPublic: false,
      maxSessions: 1,
      paymentLock: true,
      notes: '',
      sessions: [{ title: '', limit: 30 }],
    },
    resolver: zodResolver(trainingSchema),
  })

  const { fields, append, remove, update, replace } = useFieldArray({
    control,
    name: 'sessions',
  })

  const sessions = watch('sessions')

  const { data: training, isLoading: isLoadingTraining } = useQuery({
    queryKey: ['training', trainingId],
    queryFn: () => AdminStore.getTrainingById(trainingId!),
    enabled: !!trainingId,
  })

  if (training && !hasPopulated.current) {
    const sessions = Object.values(training.sessions).map((session) => ({
      title: session.title,
      limit: session.limit,
    }))

    setValue('opens', training.opens)
    setValue('closes', training.closes)
    setValue('title', training.title)
    setValue('notes', training.notes)
    replace(sessions)
    setValue('semester', training.semester as 'S1' | 'S2' | 'SS')
    setValue('paymentLock', training.paymentLock)
    setValue('maxSessions', training.signupMaxSessions)
    setValue('openToPublic', training.openToPublic)
    hasPopulated.current = true
  }

  function handlePopulateWeek() {
    const SEMESTER_START = new Date(2025, 6, 21) // change this at the start of each semester

    const week =
      populateWeekValue.current >= 7
        ? populateWeekValue.current + 2
        : populateWeekValue.current
    const daysToSunday = (week - 1) * 7 - 1

    const newOpens = new Date(SEMESTER_START)
    newOpens.setDate(SEMESTER_START.getDate() + daysToSunday)
    newOpens.setHours(0)

    const newCloses = new Date(newOpens)
    newCloses.setDate(newOpens.getDate() + 5)
    newCloses.setHours(20, 30, 0)

    const title = `Week ${populateWeekValue.current} Training Signups`

    const sessions = [
      { title: 'Tuesday 4:30 (Beginners)', limit: 40 },
      { title: 'Wednesday 4:30 (Intermediate)', limit: 40 },
      { title: "Wednesday 5:30 (Women's Beginners)", limit: 20 },
      { title: 'Thursday 4:30 (Beginners)', limit: 40 },
      { title: 'Friday 6:30 (Intermediate)', limit: 20 },
    ]

    setValue('opens', newOpens)
    setValue('closes', newCloses)
    setValue('title', title)
    setValue('notes', TRAINING_DEFAULT_NOTES)
    setValue('sessions', sessions)
  }

  function generateSessionId(length: number) {
    const digits = '1234567890qwertyuiopasdfghjklzxcvbnm'
    let id = ''
    for (let i = 0; i < length; i++) {
      id += digits[Math.floor(Math.random() * digits.length)]
    }
    return id
  }

  async function onSubmit(data: z.infer<typeof trainingSchema>) {
    const sessions: Record<string, AumtTrainingSession> = {}
    data.sessions.forEach((session, index) => {
      const sessionId = generateSessionId(10)
      sessions[sessionId] = {
        title: session.title,
        limit: session.limit,
        sessionId: sessionId,
        trainers: [],
        members: {},
        waitlist: {},
        position: index,
      }
    })

    await submitNewForm({
      title: data.title,
      opens: data.opens,
      closes: data.closes,
      openToPublic: data.openToPublic,
      sessions: sessions,
      semester: data.semester,
      paymentLock: data.paymentLock,
      notes: data.notes,
      signupMaxSessions: data.maxSessions,
      feedback: training?.feedback || [],
      trainingId:
        trainingId ||
        data.title.split(' ').join('').slice(0, 13) + generateSessionId(7),
    })
  }

  function onInvalid(errors: FieldErrors<z.infer<typeof trainingSchema>>) {
    console.log(errors)

    const firstError = Object.keys(errors)[0]
    if (firstError) {
      notification.error({
        message: `${firstError} error`,
        description: errors[firstError]?.message,
      })
    }
  }

  const isEditing = !!trainingId
  const notes = watch('notes')

  if (isLoadingTraining) {
    return (
      <div>
        Loading training <Spin />
      </div>
    )
  }

  return (
    <div className="mt-[30px] mx-auto">
      <h2>
        <Link className="mx-2.5" to="/admin">
          <ArrowLeftOutlined />
        </Link>
        {isEditing ? 'Edit' : 'Create'} Training
      </h2>
      <div className="h-auto text-left px-5">
        <span>Use weekly training template for week: </span>
        <InputNumber
          defaultValue={1}
          min={1}
          className="max-w-[60px]"
          onChange={(value) => (populateWeekValue.current = value ?? 1)}
        />
        <Button onClick={handlePopulateWeek}>Populate</Button>
        <h4 className="!mt-[30px]">Title</h4>
        <Controller
          name="title"
          control={control}
          render={({ field: { value, onChange } }) => (
            <Input
              placeholder="Training title"
              value={value}
              onChange={onChange}
            />
          )}
        />
        <div>
          <span className="formItemTitle">Opens: </span>
          <Controller
            name="opens"
            control={control}
            render={({ field: { value, onChange } }) => (
              <DatePicker showTime value={moment(value)} onChange={onChange} />
            )}
          />
        </div>
        <div>
          <span className="formItemTitle">Closes: </span>
          <Controller
            name="closes"
            control={control}
            render={({ field: { value, onChange } }) => (
              <DatePicker showTime value={moment(value)} onChange={onChange} />
            )}
          />
        </div>
        <div>
          <Controller
            name="openToPublic"
            control={control}
            render={({ field: { value, onChange } }) => (
              <Checkbox checked={value} onChange={onChange}>
                Open to Non-Members
              </Checkbox>
            )}
          />
        </div>
        <h4 className="!mt-[30px]">Sessions</h4>
        Members can sign up to{' '}
        <Controller
          name="maxSessions"
          control={control}
          render={({ field: { value, onChange } }) => (
            <InputNumber
              value={value}
              onChange={onChange}
              className="w-[55px]"
            />
          )}
        />{' '}
        session(s).
        <div className="py-2.5">
          <div className="addSessionButton">
            <Button onClick={() => append({ title: '', limit: 30 })}>
              Add Session +
            </Button>
          </div>
          {sessions.map((session, index) => (
            <div key={session.title} className="flex gap-x-2">
              <Controller
                name={`sessions.${index}.title`}
                control={control}
                render={({ field: { value, onChange } }) => (
                  <Input placeholder="Name" value={value} onChange={onChange} />
                )}
              />
              <Controller
                name={`sessions.${index}.limit`}
                control={control}
                render={({ field: { value, onChange } }) => (
                  <InputNumber value={value} onChange={onChange} />
                )}
              />
              <Button
                type="text"
                onClick={() => remove(index)}
                className="!p-0"
              >
                <MinusCircleOutlined />
              </Button>
            </div>
          ))}
        </div>
        <h4 className="!mt-[30px]">Semester</h4>
        <Controller
          name="semester"
          control={control}
          render={({ field: { value, onChange } }) => (
            <Radio.Group buttonStyle="solid" value={value} onChange={onChange}>
              <Radio.Button value={'S1'}>Semester 1</Radio.Button>
              <Radio.Button value={'S2'}>Semester 2</Radio.Button>
              <Radio.Button value={'SS'}>Summer School</Radio.Button>
            </Radio.Group>
          )}
        />
        <h4 className="!mt-[30px]">Payment Lock</h4>
        <Controller
          name="paymentLock"
          control={control}
          render={({ field: { value, onChange } }) => (
            <Radio.Group buttonStyle="solid" value={value} onChange={onChange}>
              <Radio.Button value={true}>On</Radio.Button>
              <Radio.Button value={false}>Off</Radio.Button>
            </Radio.Group>
          )}
        />
        <h4 className="!mt-[30px]">Notes</h4>
        <div className="notesContainer">
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
              <RenderMarkdown source={notes || ''} />
            </Tabs.TabPane>
          </Tabs>
        </div>
        <div className="py-2.5">
          <Button
            className="mr-2.5"
            type="primary"
            loading={isSubmitting}
            onClick={handleSubmit(onSubmit, onInvalid)}
          >
            Save Training
          </Button>
          <Link to="/admin">
            <Button>Cancel</Button>
          </Link>
        </div>
      </div>
    </div>
  )
}
