export interface AumtMember {
    // contact
    firstName: string
    lastName: string
    preferredName: string
    email: string
    instagramHandle: string

    // details
    upi: string
    isReturningMember: 'Yes' | 'No'
    isUoAStudent: 'Yes' | 'No'
    initialExperience: string

    // Membership
    membership: 'S1' | 'S2' | 'FY'
    paymentType: 'Cash' | 'Bank Transfer' | 'Other'
    paid: 'Yes' | 'No'
    emailVerified: boolean
    timeJoinedMs: number

    // Emergency Contact
    EmergencyContactName: string
    EmergencyContactNumber: string
    EmergencyContactRelationship: string
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
