import z, { number } from 'zod'
import { timestampSchema } from './util'

export interface TrainingSession {
  limit: number
  title: string
  sessionId: string
  trainers: string[]
  position: number
  members: {
    [uid: string]: {
      name: string
      timeAdded: Date
    }
  }
  waitlist: {
    [uid: string]: {
      name: string
      timeAdded: Date
    }
  }
}

export const sessionSchema = z.object({
  title: z.string('Invalid session title').min(1, 'Session title is required'),
  limit: z.number('Invalid session limit').min(0, 'Session limit is required'),
  position: z.number().optional(),
  members: z
    .record(
      z.string(),
      z.object({
        name: z.string(),
        timeAdded: z.date(),
      })
    )
    .optional(),
  waitlist: z
    .record(
      z.string(),
      z.object({
        name: z.string(),
        timeAdded: z.date(),
      })
    )
    .optional(),
})
export type Session = z.infer<typeof sessionSchema>

// export type Training = {
//   sessions: Record<string, TrainingSession>
//   feedback: string[]
//   title: string
//   opens: Date
//   closes: Date
//   notes: string
//   signupMaxSessions: number
//   openToPublic: boolean
//   semester: string
//   paymentLock: boolean
// }

export const trainingSchema = z.object({
  title: z.string('Invalid title').min(1, 'Title is required'),
  opens: timestampSchema,
  closes: timestampSchema,
  sessions: z.record(z.string(), sessionSchema),
  openToPublic: z.boolean('Required'),
  notes: z.string(),
  maxSessions: z
    .number('Invalid max sessions')
    .min(1, 'Max sessions must be at least 1'),
  semester: z.enum(['S1', 'S2', 'SS'], 'Required'),
  paymentLock: z.boolean('Required'),
  feedback: z.array(z.string()).optional(),
})
export type Training = z.infer<typeof trainingSchema>
