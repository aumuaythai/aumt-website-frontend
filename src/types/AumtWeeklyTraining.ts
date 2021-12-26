export interface AumtTrainingSession {
    limit: number
    title: string
    sessionId: string
    trainers: string[]
    position: number
    members: {
        [uid: string]: {
            name: string,
            timeAdded: Date
        }
    }
    waitlist: {
        [uid: string]: {
            name: string,
            timeAdded: Date
        }
    }
}
export interface AumtWeeklyTraining {
    sessions: Record<string, AumtTrainingSession>
    feedback: string[]
    trainingId: string
    title: string
    opens: Date
    closes: Date
    notes: string
    signupMaxSessions: number
    openToPublic: boolean
    semester: string
    paymentLock: boolean
}