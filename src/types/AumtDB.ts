import {AumtMember, AumtAdmin} from './AumtMember'
import {AumtWeeklyTraining} from './AumtWeeklyTraining'
import {AumtAttendanceRecord} from './AumtAttendanceRecord'
import { AumtEvent } from './AumtEvent'

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
        members: {
            [uid: string]: AumtAttendanceRecord
        }
        trainers: {
            [uid: string]: AumtAttendanceRecord
        }
    }
    events: {
        [eventId: string]: AumtEvent
    }
}