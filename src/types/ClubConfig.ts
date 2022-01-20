export interface ClubConfig {
    clubSignupStatus: 'open' | 'closed'
    clubSignupSem: 'S1' | 'S2' | 'SS'
    summerSchoolFee: number
    semesterOneFee: number
    semesterTwoFee: number
    fullYearFee: number
    bankAccountNumber: string
}