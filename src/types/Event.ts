import { isValidMoment } from '@/lib/utils'
import z from 'zod'

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
  opens: z.refine((date) => isValidMoment(date), 'Open date is invalid'),
  closes: z.refine((date) => isValidMoment(date), 'Close date is invalid'),
  limit: z.number().nullable(),
  needAdminConfirm: z.boolean(),
  openToNonMembers: z.boolean(),
  isCamp: z.boolean(),
  members: z.record(z.string(), eventSignupSchema),
  waitlist: z.record(z.string(), eventSignupSchema),
})
export type EventSignups = z.infer<typeof eventSignupsSchema>

export const eventSchema = z.object({
  title: z.string('Title is invalid').min(1, 'Title is required'),
  urlPath: z.string('URL Path is invalid').min(1, 'URL Path is required'),
  description: z
    .string('Description is invalid')
    .min(1, 'Description is required'),
  photoPath: z.string().optional(),
  date: z.refine((date) => isValidMoment(date), 'Date is invalid'),
  location: z.string('Location is invalid').min(1, 'Location is required'),
  locationLink: z.url().optional(),
  fbLink: z.url().optional(),
  signups: eventSignupsSchema.optional(),
})
export type Event = z.infer<typeof eventSchema>
