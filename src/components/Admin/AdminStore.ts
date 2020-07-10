import { AumtMembersObj, AumtEvent, AumtWeeklyTraining } from '../../types'
import db from '../../services/db'

interface AdminState {
    members: AumtMembersObj
    
    trainings: AumtWeeklyTraining[]
    pushTrainings: (trainings: AumtWeeklyTraining[]) => void
    dbTrainingListenerId: string
    
    events: AumtEvent[]
    pushEvents: (events: AumtEvent[]) => void
    dbEventsListenerId: string
}
class AdminStore {
    // TODO: explain what's going on here


    private state: AdminState = {
        members: {},
        events: [],
        trainings: [],
        dbTrainingListenerId: '',
        dbEventsListenerId: '',
        pushTrainings: () => {},
        pushEvents: () => {}
    }

    addListeners = (
        pushTrainings: (trainings: AumtWeeklyTraining[]) => void,
        pushEvents: (events: AumtEvent[]) => void,
        ) => {
        this.state.pushTrainings = pushTrainings
        this.state.pushEvents = pushEvents
    }

    requestTrainings = (): void => {
        if (!this.state.dbTrainingListenerId) {
            this.state.dbTrainingListenerId = db.listenToTrainings(this.onDbUpdateTrainings)
        }
    }

    requestEvents = (): void => {
        if (!this.state.dbEventsListenerId) {
            this.state.dbEventsListenerId = db.listenToEvents(this.onDbUpdateEvents)
        }
    }
    
    onDbUpdateTrainings = (forms: AumtWeeklyTraining[]) => {
        this.state.trainings = forms
        this.state.pushTrainings(this.state.trainings)
    }

    onDbUpdateEvents = (events: AumtEvent[]) => {
        this.state.events = events
        this.state.pushEvents(this.state.events)
    }

    cleanup = () => {
        this.state.members = {}
        this.state.trainings = []
        db.unlisten(this.state.dbTrainingListenerId)
        this.state.dbTrainingListenerId = ''
        this.state.events = []
        db.unlisten(this.state.dbEventsListenerId)
        this.state.dbEventsListenerId = ''
    }
}

export default new AdminStore()