export interface AumtMember {
    name: string
    email: string
    membershipType: 'SEM1' | 'SEM2' | 'FULLYEAR' | null
    
    // admin/trainer uid string for the isAdmin
    isAdmin: string | null
    isTrainer: string | null
}

export interface AumtAdmin {
    id: string
    name: string
    email: string
    position: string
}
