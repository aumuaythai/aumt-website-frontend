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

export const PAYMENT_TYPE = ['Cash', 'Bank Transfer', 'Other'] as const
type PaymentType = (typeof PAYMENT_TYPE)[number]

export type AumtMember = {
  // contact
  firstName: string
  lastName: string
  preferredName: string | null
  email: string

  // demographic
  ethnicity: Ethnicities
  gender: Gender

  // Membership
  membership: MembershipPeriod
  paymentType: PaymentType
  isReturningMember: boolean
  paid: boolean
  timeJoinedMs: number

  // Details
  upi: string | null
  studentId: string | null
  isInterestedInCamp: boolean
  isUoAStudent: boolean
  initialExperience: InitialExperience
  notes: string | null

  // Emergency Contact
  emergencyContactName: string
  emergencyContactNumber: string
  emergencyContactRelationship: string
}

export interface AumtMembersObj {
  [uid: string]: AumtMember
}

export interface AumtMemberWithCollated extends AumtMember {
  collated: string
}
export interface AumtMembersObjWithCollated {
  [uid: string]: AumtMemberWithCollated
}
