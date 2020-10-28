export interface AumtCampSignupData {
    name?: string,
    email?: string,
    phoneNumber?: string
    ecName?: string,
    ecPhoneNumber?: string,
    ecRelation?: string,
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

export type TableRow = AumtEventSignupData & {key: string, displayTime: string}

export type LicenseClasses = 'Full 2+ years' | 'Full < 2 years' | 'Restricted' | 'Other'

export type AumtEventSignup = Record<string,AumtEventSignupData>

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