export type PaymentType = 'Cash' | 'Bank Transfer' | 'Other'

export type MembershipPeriod = 'S1' | 'S2' | 'FY' | 'SS'

export type Gender = 'Male' | 'Female' | 'Non-binary' | 'Prefer not to say'

export type AumtMember = {
  // contact
  firstName: string
  lastName: string
  preferredName: string | null
  email: string

  // demographic
  ethnicity: string
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
  initialExperience: string
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
