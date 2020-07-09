import { AumtMembersObj, AumtEvent, AumtWeeklyTraining } from '../../types'
import db from '../../services/db'

interface AdminState {
    members: AumtMembersObj
    events: AumtEvent[]
    trainings: AumtWeeklyTraining[]
    pushTrainings: (trainings: AumtWeeklyTraining[]) => void
    dbTrainingListenerId: string
    pushEvents: (events: AumtEvent[]) => void
}
class AdminStore {
    private state: AdminState = {
        members: {},
        events: [],
        trainings: [],
        dbTrainingListenerId: '',
        pushTrainings: () => {},
        pushEvents: () => {}
    }

    addListeners = (pushTrainings: (trainings: AumtWeeklyTraining[]) => void) => {
        this.state.pushTrainings = pushTrainings
    }

    requestTrainings = (): void | AumtWeeklyTraining[] => {
        if (!this.state.dbTrainingListenerId) {
            this.state.dbTrainingListenerId = db.listenToTrainings(this.onDbUpdateTrainings)
        }
    }
    
    onDbUpdateTrainings = (forms: AumtWeeklyTraining[]) => {
        this.state.trainings = forms
        this.state.pushTrainings(this.state.trainings)
    }

    cleanup = () => {
        this.state.members = {}
        this.state.trainings = []
        db.unlisten(this.state.dbTrainingListenerId)
        this.state.dbTrainingListenerId = ''
        this.state.events = []
    }
}

export default new AdminStore()