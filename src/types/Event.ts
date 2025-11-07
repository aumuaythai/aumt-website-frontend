import { isValidMoment } from '@/lib/utils'
import { Timestamp } from 'firebase/firestore'
import { Moment } from 'moment'
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

export interface AumtEventSignupData extends AumtCampSignupData {
  displayName: string
  email: string
  timeSignedUpMs: number
  confirmed: boolean
}

export type TableRow = AumtEventSignupData & {
  key: string
  displayTime: string
}

export type LicenseClasses =
  | 'Full 2+ years'
  | 'Full < 2 years'
  | 'Restricted'
  | 'Other'

export type AumtEventSignup = Record<string, AumtEventSignupData>

export interface AumtEventSignupObject {
  limit: number | null
  opens: Date
  closes: Date
  needAdminConfirm: boolean
  openToNonMembers: boolean
  isCamp: boolean
  members: AumtEventSignup
  waitlist: AumtEventSignup
}

export const eventSignupSchema = z.object({
  opens: z.refine((date) => isValidMoment(date), 'Open date is invalid'),
  closes: z.refine((date) => isValidMoment(date), 'Close date is invalid'),
  openToNonMembers: z.boolean(),
  limit: z.number(),
  needAdminConfirm: z.boolean(),
  isCamp: z.boolean(),
})

export type EventSignup = z.infer<typeof eventSignupSchema>

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
  signups: eventSignupSchema.optional(),
})

export type Event = z.infer<typeof eventSchema>

// export type Event = {
//   title: string
//   description: string
//   urlPath: string
//   photoPath: string
//   date: Timestamp
//   location: string
//   locationLink: string
//   fbLink: string
//   signups: AumtEventSignupObject | null
// }
