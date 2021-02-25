export interface AumtMember {
    // contact
    firstName: string
    lastName: string
    preferredName: string
    email: string

    // Membership
    membership: 'S1' | 'S2' | 'FY'
    paymentType: 'Cash' | 'Bank Transfer' | 'Other'
    isReturningMember: 'Yes' | 'No'
    paid: 'Yes' | 'No'
    timeJoinedMs: number
    
    // details
    upi: string
    studentId: string 
    interestedInCamp: 'Yes' | 'No'
    isUoAStudent: 'Yes' | 'No'
    initialExperience: string
    notes: string

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
