import { AumtMember } from "./AumtMember";

export interface AumtTrainingSession {
    limit: number
    title: string
    sessionId: string
    trainers: string[]
    members: {
        [uid: string]: string
    }
    waitlist: {
        [uid: string]: string
    }
}
export interface AumtWeeklyTraining {
    sessions: AumtTrainingSession[]
    feedback: string[]
    trainingId: string
    title: string
    opens: Date
    closes: Date
    notes: string
}