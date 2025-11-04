import z from 'zod'

export const ETHNICITIES = [
  'New Zealand European',
  'Māori',
  'Chinese',
  'Indian',
  'Korean',
  'British and Irish',
  'African',
  'Pasifika',
  'Australian',
  'Cambodian',
  'Dutch',
  'Filipino',
  'German',
  'Greek',
  'Italian',
  'Japanese',
  'Latin American/Hispanic',
  'Middle Eastern',
  'Sri Lankan',
  'Thai',
  'Vietnamese',
  'Other',
] as const
type Ethnicities = (typeof ETHNICITIES)[number]

export const GENDER = [
  'Male',
  'Female',
  'Non-binary',
  'Prefer not to say',
] as const
type Gender = (typeof GENDER)[number]

export const INITIAL_EXPERIENCE = [
  'None',
  'Beginner/Intermediate',
  'Advanced',
  'Other',
] as const
type InitialExperience = (typeof INITIAL_EXPERIENCE)[number]

export const MEMBERSHIP_PERIOD = ['S1', 'S2', 'FY', 'SS'] as const
type MembershipPeriod = (typeof MEMBERSHIP_PERIOD)[number]

export const MEMBERSHIP_PERIOD_LONG: Record<MembershipPeriod, string> = {
  S1: 'Semester 1',
  S2: 'Semester 2',
  FY: 'Full Year (Semester 1 and 2)',
  SS: 'Summer School',
}

export const PAYMENT_TYPE = ['Cash', 'Bank Transfer', 'Other'] as const
type PaymentType = (typeof PAYMENT_TYPE)[number]

// export type AumtMember = {
//   // contact
//   firstName: string
//   lastName: string
//   preferredName?: string
//   email: string

//   // demographic
//   ethnicity: Ethnicities
//   gender: Gender

//   // Membership
//   membership: MembershipPeriod
//   paymentType: PaymentType
//   isReturningMember: boolean
//   paid: boolean
//   timeJoinedMs: number

//   // Details
//   upi?: string
//   studentId?: string
//   isUoAStudent: boolean
//   initialExperience: InitialExperience
//   notes?: string

//   // Emergency Contact
//   emergencyContactName: string
//   emergencyContactNumber: string
//   emergencyContactRelationship: string
// }

export const aumtMemberSchema = z.object({
  firstName: z.string('Required').min(1, 'Required'),
  lastName: z.string('Required').min(1, 'Required'),
  preferredName: z.string().optional(),
  email: z.email('Required'),

  ethnicity: z.enum(ETHNICITIES, 'Required'),
  gender: z.enum(GENDER, 'Required'),

  membership: z.enum(MEMBERSHIP_PERIOD, 'Required'),
  paymentType: z.enum(PAYMENT_TYPE, 'Required'),
  isReturningMember: z.boolean('Required'),
  paid: z.boolean('Required'),
  timeJoinedMs: z.number().optional(),

  upi: z.string().optional(),
  studentId: z.string().optional(),
  isUoAStudent: z.boolean('Required'),
  initialExperience: z.enum(INITIAL_EXPERIENCE, 'Required'),
  notes: z.string().optional(),

  emergencyContactName: z.string('Required').min(1, 'Required'),
  emergencyContactNumber: z
    .string('Required')
    .regex(/^\+?[0-9]+$/, 'Invalid phone number'),
  emergencyContactRelationship: z.string('Required').min(1, 'Required'),
})

export type AumtMember = z.infer<typeof aumtMemberSchema>

export interface AumtMembersObj {
  [uid: string]: AumtMember
}
