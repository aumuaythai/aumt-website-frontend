import { isValidMoment } from '@/lib/utils'
import { Timestamp } from 'firebase/firestore'
import moment, { Moment } from 'moment'
import z from 'zod'

const momentSchema = z.custom<Moment>((date) => isValidMoment(date))
const timestampSchema = z.custom<Timestamp>(
  (timestamp) => timestamp instanceof Timestamp,
  'Invalid timestamp'
)

export interface AumtCampSignupData {
  name?: string
  email?: string
  phoneNumber?: string
  ecName?: string
  ecPhoneNumber?: string
  ecRelation?: string
  dietaryRequirements?: string
  daysStaying?: string
  medicalInfo?: string
  hasFirstAid?: boolean
  driverLicenseClass?: LicenseClasses
  insuranceDescription?: string
  carModel?: string
  seatsInCar?: number
}

export type TableRow = EventSignup & {
  key: string
  displayTime: string
}

export type LicenseClasses =
  | 'Full 2+ years'
  | 'Full < 2 years'
  | 'Restricted'
  | 'Other'

export const eventSignupSchema = z.object({
  displayName: z
    .string('Display name is invalid')
    .min(1, 'Display name is required'),
  email: z.email('Email is invalid'),
  timeSignedUpMs: z.number('Time signed up is invalid'),
  confirmed: z.boolean('Confirmed is invalid'),
})
export type EventSignup = z.infer<typeof eventSignupSchema>

export const eventSignupsSchema = z.object({
  opens: timestampSchema,
  closes: timestampSchema,
  limit: z.number().nullable(),
  needAdminConfirm: z.boolean(),
  openToNonMembers: z.boolean(),
  isCamp: z.boolean(),
  members: z.record(z.string(), eventSignupSchema).optional(),
  waitlist: z.record(z.string(), eventSignupSchema).optional(),
})
export type EventSignups = z.infer<typeof eventSignupsSchema>

export const eventSchema = z.object({
  title: z.string('Invalid title').min(1, 'Title is required'),
  urlPath: z.string('Invalid URL Path').min(1, 'URL Path is required'),
  description: z
    .string('Invalid description')
    .min(1, 'Description is required'),
  date: timestampSchema,
  location: z.string('Invalid location').min(1, 'Location is required'),
  locationLink: z.url().or(z.literal('')).optional(),
  fbLink: z.url().or(z.literal('')).optional(),
  photoPath: z.url().or(z.literal('')).optional(),
  signups: eventSignupsSchema.optional(),
})
export type Event = z.infer<typeof eventSchema>
