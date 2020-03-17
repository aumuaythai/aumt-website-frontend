import { AumtMember } from "./AumtMember";

export interface AumtTrainingSession {
    limit: number
    title: number
    trainers: {
        uid: true
    }
    members: {
        uid: AumtMember
    }
    waitlist: {
        uid: AumtMember
    }
    feedback: {
        randomId: string
    }
}
export interface AumtWeeklyTraining {
    sessions: {
        [sessionId: string]: AumtTrainingSession
    }
    title: string
    opens: number
    closes: number
}