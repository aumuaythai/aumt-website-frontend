export interface AumtEventSignupData {
    displayName: string
    email: string
    timeSignedUpMs: number
    confirmed: boolean
    dietaryRequirements?: string
    driverLicenseClass?: 'Full 2+ years' | 'Full < 2 years' | 'Restricted'
    seatsInCar?: number
}

export type AumtEventSignup = Record<string,AumtEventSignupData>

export interface AumtEventSignupObject {
    limit: number | null
    opens: Date
    needAdminConfirm: boolean
    openToNonMembers: boolean
    isCamp: boolean
    members: AumtEventSignup
    waitlist: AumtEventSignup
}

export interface AumtEvent {
    urlPath: string
    title: string
    id: string
    description: string
    photoPath: string
    date: Date
    location: string
    locationLink: string
    fbLink: string
    signups: AumtEventSignupObject | null
}