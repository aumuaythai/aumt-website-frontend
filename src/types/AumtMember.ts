export interface AumtMember {
    EmergencyContactName: string
    EmergencyContactNumber: string
    Relationship: string
    UPI: string
    disabled: boolean
    displayName: string
    email: string
    emailVerified: boolean
    firstName: string
    isReturningMember: 'Yes' | 'No'
    isUoAStudent: 'Yes' | 'No'
    lastName: string
    membership: 'S1' | 'S2' | 'FY' | null
    password: ''
    preferredName: string
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
