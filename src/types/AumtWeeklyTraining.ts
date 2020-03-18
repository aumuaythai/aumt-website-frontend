import { AumtMember } from "./AumtMember";

export interface AumtTrainingSession {
    limit: number
    title: string
    sessionId: string
    trainers: {
        [uid: string]: true
    }
    members: {
        [uid: string]: AumtMember
    }
    waitlist: {
        [uid: string]: AumtMember
    }
    feedback: {
        [randomId: string]: string
    }
}
export interface AumtWeeklyTraining {
    sessions: {
        [sessionId: string]: AumtTrainingSession
    }
    trainingId: string
    title: string
    opens: Date
    closes: Date
    notes?: string
}