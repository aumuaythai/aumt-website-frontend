// import { useCreateTraining, useTraining } from '@/services/trainings'
// import { Training, TrainingSession } from '@/types'
// import { ArrowLeftOutlined, MinusCircleOutlined } from '@ant-design/icons'
// import { zodResolver } from '@hookform/resolvers/zod'
// import {
//   Button,
//   Checkbox,
//   DatePicker,
//   Input,
//   InputNumber,
//   notification,
//   Radio,
//   Spin,
//   Tabs,
// } from 'antd'
// import moment from 'moment'
// import { useRef } from 'react'
// import {
//   Controller,
//   FieldErrors,
//   useFieldArray,
//   useForm,
// } from 'react-hook-form'
// import { Link, useNavigate, useParams } from 'react-router'
// import z from 'zod'
// import { RenderMarkdown } from '../../utility/RenderMarkdown'

// const TRAINING_DEFAULT_NOTES = `RULES/ETIQUETTE
// 1.    Keep the training area free until your session starts.
// 2.    No shoes on the mat
// 3.    Let the trainer know if you need to leave early or take a rest due to injury, medical reasons, etc.
// 4.    Wipe inside and outside of gear using provided wipes at the end of class.
// 5.    Put ALL training gear back in its designated place after use.`

// const trainingSchema = z.object({
//   title: z.string().min(1, 'Title is required'),
//   opens: z.any(),
//   closes: z.any(),
//   sessions: z.array(
//     z.object({
//       title: z.string().min(1, 'Session title is required'),
//       limit: z.number().min(0, 'Session limit is required'),
//     })
//   ),
//   openToPublic: z.boolean(),
//   notes: z.string(),
//   maxSessions: z.number().min(1, 'Max sessions must be at least 1'),
//   semester: z.enum(['S1', 'S2', 'SS']),
//   paymentLock: z.boolean(),
// })

// export default function CreateTraining() {
//   const populateWeekValue = useRef(1)
//   const hasPopulated = useRef(false)

//   const { trainingId } = useParams()
//   const navigate = useNavigate()

//   const { data: training, isLoading: isLoadingTraining } = useTraining(
//     trainingId!
//   )
//   const createTrainingMutation = useCreateTraining()

//   const {
//     handleSubmit,
//     watch,
//     setValue,
//     formState: { isSubmitting },
//     control,
//   } = useForm<z.infer<typeof trainingSchema>>({
//     defaultValues: {
//       openToPublic: false,
//       maxSessions: 1,
//       paymentLock: true,
//       notes: '',
//       sessions: [{ title: '', limit: 30 }],
//     },
//     resolver: zodResolver(trainingSchema),
//   })

//   const { append, remove, replace } = useFieldArray({
//     control,
//     name: 'sessions',
//   })

//   const sessions = watch('sessions')

//   if (training && !hasPopulated.current) {
//     const sessions = Object.values(training.sessions).map((session) => ({
//       title: session.title,
//       limit: session.limit,
//     }))

//     setValue('opens', training.opens)
//     setValue('closes', training.closes)
//     setValue('title', training.title)
//     setValue('notes', training.notes)
//     replace(sessions)
//     setValue('semester', training.semester as 'S1' | 'S2' | 'SS')
//     setValue('paymentLock', training.paymentLock)
//     setValue('maxSessions', training.signupMaxSessions)
//     setValue('openToPublic', training.openToPublic)
//     hasPopulated.current = true
//   }

//   function handlePopulateWeek() {
//     const SEMESTER_START = new Date(2025, 6, 21) // change this at the start of each semester

//     const week =
//       populateWeekValue.current >= 7
//         ? populateWeekValue.current + 2
//         : populateWeekValue.current
//     const daysToSunday = (week - 1) * 7 - 1

//     const newOpens = new Date(SEMESTER_START)
//     newOpens.setDate(SEMESTER_START.getDate() + daysToSunday)
//     newOpens.setHours(0)

//     const newCloses = new Date(newOpens)
//     newCloses.setDate(newOpens.getDate() + 5)
//     newCloses.setHours(20, 30, 0)

//     const title = `Week ${populateWeekValue.current} Training Signups`

//     const sessions = [
//       { title: 'Tuesday 4:30 (Beginners)', limit: 40 },
//       { title: 'Wednesday 4:30 (Intermediate)', limit: 40 },
//       { title: "Wednesday 5:30 (Women's Beginners)", limit: 20 },
//       { title: 'Thursday 4:30 (Beginners)', limit: 40 },
//       { title: 'Friday 6:30 (Intermediate)', limit: 20 },
//     ]

//     setValue('opens', newOpens)
//     setValue('closes', newCloses)
//     setValue('title', title)
//     setValue('notes', TRAINING_DEFAULT_NOTES)
//     setValue('sessions', sessions)
//   }

//   function generateSessionId(length: number) {
//     const digits = '1234567890qwertyuiopasdfghjklzxcvbnm'
//     let id = ''
//     for (let i = 0; i < length; i++) {
//       id += digits[Math.floor(Math.random() * digits.length)]
//     }
//     return id
//   }

//   async function onSubmit(data: z.infer<typeof trainingSchema>) {
//     const sessions: Record<string, TrainingSession> = {}
//     data.sessions.forEach((session, index) => {
//       const sessionId = generateSessionId(10)
//       sessions[sessionId] = {
//         title: session.title,
//         limit: session.limit,
//         sessionId: sessionId,
//         trainers: [],
//         members: {},
//         waitlist: {},
//         position: index,
//       }
//     })

//     const newTraining: Training = {
//       title: data.title,
//       opens: data.opens,
//       closes: data.closes,
//       openToPublic: data.openToPublic,
//       sessions: sessions,
//       semester: data.semester,
//       paymentLock: data.paymentLock,
//       notes: data.notes,
//       signupMaxSessions: data.maxSessions,
//       feedback: training?.feedback || [],
//     }

//     createTrainingMutation.mutate(newTraining)

//     await navigate('/admin')
//     notification.success({
//       message: 'Training created',
//     })
//   }

//   function onInvalid(errors: FieldErrors<z.infer<typeof trainingSchema>>) {
//     console.log(errors)

//     const firstError = Object.keys(errors)[0]
//     if (firstError) {
//       notification.error({
//         message: `${firstError} error`,
//         description: errors[firstError]?.message,
//       })
//     }
//   }

//   const isEditing = !!trainingId
//   const notes = watch('notes')

//   if (isLoadingTraining) {
//     return (
//       <div>
//         Loading training <Spin />
//       </div>
//     )
//   }

//   return (
//     <div className="mt-[30px] mx-auto">
//       <h2>
//         <Link className="mx-2.5" to="/admin">
//           <ArrowLeftOutlined />
//         </Link>
//         {isEditing ? 'Edit' : 'Create'} Training
//       </h2>
//       <div className="h-auto text-left px-5">
//         <span>Use weekly training template for week: </span>
//         <InputNumber
//           defaultValue={1}
//           min={1}
//           className="max-w-[60px]"
//           onChange={(value) => (populateWeekValue.current = value ?? 1)}
//         />
//         <Button onClick={handlePopulateWeek}>Populate</Button>
//         <h4 className="!mt-[30px]">Title</h4>
//         <Controller
//           name="title"
//           control={control}
//           render={({ field: { value, onChange } }) => (
//             <Input
//               placeholder="Training title"
//               value={value}
//               onChange={onChange}
//             />
//           )}
//         />
//         <div>
//           <span className="formItemTitle">Opens: </span>
//           <Controller
//             name="opens"
//             control={control}
//             render={({ field: { value, onChange } }) => (
//               <DatePicker showTime value={moment(value)} onChange={onChange} />
//             )}
//           />
//         </div>
//         <div>
//           <span className="formItemTitle">Closes: </span>
//           <Controller
//             name="closes"
//             control={control}
//             render={({ field: { value, onChange } }) => (
//               <DatePicker showTime value={moment(value)} onChange={onChange} />
//             )}
//           />
//         </div>
//         <div>
//           <Controller
//             name="openToPublic"
//             control={control}
//             render={({ field: { value, onChange } }) => (
//               <Checkbox checked={value} onChange={onChange}>
//                 Open to Non-Members
//               </Checkbox>
//             )}
//           />
//         </div>
//         <h4 className="!mt-[30px]">Sessions</h4>
//         Members can sign up to{' '}
//         <Controller
//           name="maxSessions"
//           control={control}
//           render={({ field: { value, onChange } }) => (
//             <InputNumber
//               value={value}
//               onChange={onChange}
//               className="w-[55px]"
//             />
//           )}
//         />{' '}
//         session(s).
//         <div className="py-2.5">
//           <div className="addSessionButton">
//             <Button onClick={() => append({ title: '', limit: 30 })}>
//               Add Session +
//             </Button>
//           </div>
//           {sessions.map((session, index) => (
//             <div key={session.title} className="flex gap-x-2">
//               <Controller
//                 name={`sessions.${index}.title`}
//                 control={control}
//                 render={({ field: { value, onChange } }) => (
//                   <Input placeholder="Name" value={value} onChange={onChange} />
//                 )}
//               />
//               <Controller
//                 name={`sessions.${index}.limit`}
//                 control={control}
//                 render={({ field: { value, onChange } }) => (
//                   <InputNumber value={value} onChange={onChange} />
//                 )}
//               />
//               <Button
//                 type="text"
//                 onClick={() => remove(index)}
//                 className="!p-0"
//               >
//                 <MinusCircleOutlined />
//               </Button>
//             </div>
//           ))}
//         </div>
//         <h4 className="!mt-[30px]">Semester</h4>
//         <Controller
//           name="semester"
//           control={control}
//           render={({ field: { value, onChange } }) => (
//             <Radio.Group buttonStyle="solid" value={value} onChange={onChange}>
//               <Radio.Button value={'S1'}>Semester 1</Radio.Button>
//               <Radio.Button value={'S2'}>Semester 2</Radio.Button>
//               <Radio.Button value={'SS'}>Summer School</Radio.Button>
//             </Radio.Group>
//           )}
//         />
//         <h4 className="!mt-[30px]">Payment Lock</h4>
//         <Controller
//           name="paymentLock"
//           control={control}
//           render={({ field: { value, onChange } }) => (
//             <Radio.Group buttonStyle="solid" value={value} onChange={onChange}>
//               <Radio.Button value={true}>On</Radio.Button>
//               <Radio.Button value={false}>Off</Radio.Button>
//             </Radio.Group>
//           )}
//         />
//         <h4 className="!mt-[30px]">Notes</h4>
//         <div className="notesContainer">
//           <Tabs>
//             <Tabs.TabPane tab="Edit" key="1">
//               <Controller
//                 name="notes"
//                 control={control}
//                 render={({ field: { value, onChange } }) => (
//                   <Input.TextArea
//                     value={value}
//                     onChange={onChange}
//                     placeholder="Enter markdown text"
//                     autoSize={{ minRows: 2, maxRows: 26 }}
//                   />
//                 )}
//               />
//             </Tabs.TabPane>
//             <Tabs.TabPane tab="Preview" key="2">
//               <RenderMarkdown source={notes || ''} />
//             </Tabs.TabPane>
//           </Tabs>
//         </div>
//         <div className="py-2.5">
//           <Button
//             className="mr-2.5"
//             type="primary"
//             loading={isSubmitting}
//             onClick={handleSubmit(onSubmit, onInvalid)}
//           >
//             Save Training
//           </Button>
//           <Link to="/admin">
//             <Button>Cancel</Button>
//           </Link>
//         </div>
//       </div>
//     </div>
//   )
// }

import TimestampInput from '@/components/ui/timestamp-input'
import { useConfig } from '@/services/config'
import { useCreateTraining } from '@/services/trainings'
import { Session, sessionSchema, trainingSchema } from '@/types'
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
import { RenderMarkdown } from '../../utility/RenderMarkdown'

const TRAINING_DEFAULT_NOTES = `RULES/ETIQUETTE
1.    Keep the training area free until your session starts.
2.    No shoes on the mat
3.    Let the trainer know if you need to leave early or take a rest due to injury, medical reasons, etc.
4.    Wipe inside and outside of gear using provided wipes at the end of class.
5.    Put ALL training gear back in its designated place after use.`

const trainingFormSchema = trainingSchema.extend({
  sessions: z.array(sessionSchema), // modify to allow for useFieldArray
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
