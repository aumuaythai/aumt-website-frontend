import {AumtMember, AumtAdmin} from './AumtMember'
import {AumtWeeklyTraining} from './AumtWeeklyTraining'
import {AumtAttendanceRecord} from './AumtAttendanceRecord'

export interface AumtDB {
    users: {
        [uid: string]: AumtMember
    }
    admin: {
        [uid: string]: AumtAdmin
    }
    trainers: {
        [uid: string]: true
    }
    weekly_trainings: {
        [trainingId: string]: AumtWeeklyTraining
    }
    attendance: {
        [uid: string]: AumtAttendanceRecord
    }
    events: {

    }
}