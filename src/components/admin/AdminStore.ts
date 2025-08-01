import { notification } from 'antd'
import {
  getEventById,
  getTrainingData,
  listenToEvents,
  listenToTrainings,
  unlisten,
} from '../../services/db'
import { AumtEvent, AumtMembersObj, AumtWeeklyTraining } from '../../types'

interface AdminState {
  // TODO add support for member storage here.
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
    pushEvents: () => {},
  }

  addListeners = (
    pushTrainings: (trainings: AumtWeeklyTraining[]) => void,
    pushEvents: (events: AumtEvent[]) => void
  ) => {
    this.state.pushTrainings = pushTrainings
    this.state.pushEvents = pushEvents
  }

  requestTrainings = (): void => {
    if (!this.state.dbTrainingListenerId) {
      this.state.dbTrainingListenerId = listenToTrainings(
        this.onDbUpdateTrainings
      )
    }
  }

  requestEvents = (): void => {
    if (!this.state.dbEventsListenerId) {
      this.state.dbEventsListenerId = listenToEvents(
        this.onDbUpdateEvents,
        this.onDbEventListenerError
      )
    }
  }

  getEventById = (id: string): Promise<AumtEvent> => {
    if (this.state.events.length) {
      const foundEvent = this.state.events.find((e) => e.id === id)
      if (foundEvent) {
        return Promise.resolve(foundEvent)
      }
    }
    return getEventById(id)
  }

  getTrainingById = (id: string): Promise<AumtWeeklyTraining> => {
    if (this.state.trainings.length) {
      const foundTraining = this.state.trainings.find(
        (t) => t.trainingId === id
      )
      if (foundTraining) {
        return Promise.resolve(foundTraining)
      }
    }
    return getTrainingData(id)
  }

  onDbUpdateTrainings = (forms: AumtWeeklyTraining[]) => {
    this.state.trainings = forms
    this.state.pushTrainings(this.state.trainings)
  }

  onDbUpdateEvents = (events: AumtEvent[]) => {
    this.state.events = events
    this.state.pushEvents(this.state.events)
  }

  onDbEventListenerError = (message: string) => {
    notification.error({ message })
  }

  cleanup = () => {
    this.state.members = {}
    this.state.trainings = []
    unlisten(this.state.dbTrainingListenerId)
    this.state.dbTrainingListenerId = ''
    this.state.events = []
    unlisten(this.state.dbEventsListenerId)
    this.state.dbEventsListenerId = ''
  }
}

export default new AdminStore()
