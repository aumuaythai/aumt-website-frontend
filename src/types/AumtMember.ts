export interface AumtMember {
    firstName: string
    lastName: string
    preferredName: string
    upi: string
    email: string
    emailVerified: boolean
    isReturningMember: 'Yes' | 'No'
    isUoAStudent: 'Yes' | 'No'
    membership: 'S1' | 'S2' | 'FY' | null
    paid: 'Yes' | 'No'
    EmergencyContactName: string
    EmergencyContactNumber: string
    EmergencyContactRelationship: string
}

export interface AumtMembersObj {
    [uid: string]: AumtMember
}

export interface AumtAdmin {
    id: string
    name: string
    email: string
    position: string
}
