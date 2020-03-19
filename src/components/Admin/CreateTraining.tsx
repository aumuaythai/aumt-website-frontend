import React, {Component} from 'react'
import { Button, Input, InputNumber, DatePicker, notification } from 'antd'
import moment from 'moment'
import { MinusCircleOutlined} from '@ant-design/icons'
import './CreateTraining.css'
import { AumtTrainingSession } from '../../types'
import db from '../../services/db'


interface CreateTrainingProps {
}

interface CreateTrainingState {
    currentTitle: string
    currentOpens: Date
    currentCloses: Date
    currentSessions: AumtTrainingSession[]
    isSubmitting: boolean
    submitButtonText: string
    currentNotes: string
    currentPopulateWeekValue: number
}

const DEFAULT_TRAINING_LIMIT = 30
const TRAINING_0_OPENS_DATE = new Date(2020, 1, 23, 0, 0, 0)
const TRAINING_0_CLOSES_DATE = new Date(2020, 1, 28, 19, 30, 0)

export class CreateTraining extends Component<CreateTrainingProps, CreateTrainingState> {
    constructor(props: CreateTrainingProps) {
        super(props)
        this.state = {
            currentTitle: '',
            currentOpens: new Date(),
            currentCloses: new Date(),
            currentSessions: [],
            isSubmitting: false,
            submitButtonText: 'Submit Form',
            currentNotes: '',
            currentPopulateWeekValue: 1
        }
    }
    populateWeeklyDefaults = () => {
        const newOpens = new Date(TRAINING_0_OPENS_DATE.getTime() + (1000 * 60 * 60 * 24 * 7 * this.state.currentPopulateWeekValue))
        const newCloses = new Date(TRAINING_0_CLOSES_DATE.getTime() + (1000 * 60 * 60 * 24 * 7 * this.state.currentPopulateWeekValue))
        const dateThursday = new Date(newOpens.getTime() + (1000 * 60 * 60 * 24 * 4))
        const dateFriday = new Date(newOpens.getTime() + (1000 * 60 * 60 * 24 * 5))
        const dateStrThu = `${dateThursday.getDate()}/${dateThursday.getMonth() + 1}`
        const dateStrFri = `${dateFriday.getDate()}/${dateFriday.getMonth() + 1}`
        const currentSessions = [
            this.createSession(`Thursday 6:30 (Beginners)`),
            this.createSession(`Thursday 7:30 (Beginners)`),
            this.createSession(`Friday 6:30 (Beginners)`),
            this.createSession(`Friday 6:30 (Advanced)`),

        ]
        this.setState({
            ...this.state,
            currentOpens: newOpens,
            currentCloses: newCloses,
            currentTitle: `Week ${this.state.currentPopulateWeekValue} Training Signups ${dateStrThu}-${dateStrFri}`,
            currentSessions
        })
    }
    componentDidMount = () => {
        this.onAddSessionClick()
    }
    generateSessionId = (length: number) => {
        const digits = '1234567890qwertyuiopasdfghjklzxcvbnm'
        let id = ''
        for (let i = 0; i < length; i ++) {
            id += digits[Math.floor(Math.random() * digits.length)]
        }
        return id
    }
    onPopulateWeekChange = (n: number | undefined) => {
        this.setState({...this.state, currentPopulateWeekValue: n || 1})
    }
    onOpenDateChange = (d: Date | undefined) => {
        if (d) {
            this.setState({
                ...this.state,
                currentOpens: d
            })
        }
    }
    onClosesDateChange = (d: Date | undefined) => {
        if (d) {
            this.setState({
                ...this.state,
                currentCloses: d
            })
        }
    }
    onTrainingTitleChange = (title: string) => {
        this.setState({
            ...this.state,
            currentTitle: title
        })
    }
    onNotesChange = (notes: string) => {
        this.setState({
            ...this.state,
            currentNotes: notes
        })
    }
    onSessionTitleChange = (title: string, sessionId: string) => {
        if (title) {
            this.state.currentSessions.forEach((s) => {
                if (s.sessionId === sessionId) {
                    s.title = title
                }
            })
            this.setState({
                ...this.state,
                currentSessions: this.state.currentSessions
            })
        }
    }
    onSessionLimitChange=  (limit: number | undefined, sessionId: string) => {
        if (limit) {
            this.state.currentSessions.forEach((s) => {
                if (s.sessionId === sessionId) {
                    s.limit = limit
                }
            })
        }
    }
    onRemoveSessionClick = (sessionId: string) => {
        this.setState({
            ...this.state,
            currentSessions: this.state.currentSessions.filter(s => s.sessionId !== sessionId)
        })
    }
    createSession = (sessionTitle: string) => {
        const newSession: AumtTrainingSession = {
            limit: DEFAULT_TRAINING_LIMIT,
            sessionId: this.generateSessionId(10),
            title: sessionTitle,
            trainers: [],
            members: {},
            waitlist: {}
        }
        return newSession
    }
    onAddSessionClick = () => {
        const newSession = this.createSession('')

        this.setState({
            ...this.state,
            currentSessions: this.state.currentSessions.concat([newSession])
        })
    }
    onSubmitForm = () => {
        if (!this.state.currentTitle) {
            notification.error({
                message: 'Form title required'
            })
            return
        } else if (!this.state.currentSessions.length) {
            notification.error({message: 'There must be at least one session option'})
            return
        } else if (this.state.currentSessions.find(s => !s.title)) {
            notification.error({message: 'All session options must have a title'})
            return
        }
        const sessionsObject: {[sessionId: string]: AumtTrainingSession} = {}
        for (const i of this.state.currentSessions) {
            sessionsObject[i.sessionId] = i
        }
        this.setState({
            ...this.state,
            isSubmitting: true,
            submitButtonText: 'Submitting'
        })
        db.submitNewForm({
            title: this.state.currentTitle,
            sessions: this.state.currentSessions,
            opens: this.state.currentOpens,
            closes: this.state.currentCloses,
            notes: this.state.currentNotes.split('\n').join('%%NEWLINE%%'),
            trainingId: this.state.currentTitle.split(' ').join('').slice(0, 13) + this.generateSessionId(7),
            feedback: []
        })
            .then(() => {
                this.setState({
                    ...this.state,
                    isSubmitting: false,
                    submitButtonText: 'Submitted!'
                })
                setTimeout(() => {
                    this.setState({
                        ...this.state,
                        submitButtonText: 'Submit Form'
                    })
                }, 2500)
            })
            .catch((err) => {
                this.setState({
                    ...this.state,
                    isSubmitting: false,
                    submitButtonText: 'Submit Form'
                })
                notification.error({message: 'Error submitting form to database: ' + err})
            })
    }
    render() {
        return (
            <div className='createTrainingContainer'>
                <span>Use weekly training template for week: </span><InputNumber onChange={this.onPopulateWeekChange} className='populateInput' defaultValue={1} min={1}/><Button onClick={this.populateWeeklyDefaults}>Populate</Button>
                <h4 className='formSectionTitle'>Form Options</h4>
                <Input placeholder="Form Title" value={this.state.currentTitle} onChange={e => this.onTrainingTitleChange(e.target.value)}></Input>
                <div>
                    <span className="formItemTitle">Opens: </span>
                    <DatePicker value={moment(this.state.currentOpens)} showTime onChange={d => this.onOpenDateChange(d?.toDate())} />
                </div>
                <div>
                    <span className="formItemTitle">Closes: </span>
                    <DatePicker value={moment(this.state.currentCloses)} showTime onChange={d => this.onClosesDateChange(d?.toDate())} />
                </div>
                <h4 className='formSectionTitle'>Sessions</h4>
                <div className="sessionSection">
                    <div className='addSessionButton'>
                        <Button onClick={this.onAddSessionClick}>Add Session +</Button>
                    </div>
                    {this.state.currentSessions.map((session) => {
                        return (
                            <div key={session.sessionId} className="eachSessionContainer">
                                <Input
                                    value={session.title}
                                    className='sessionTitleInput'
                                    placeholder="Session Title (e.g. Thursday 6:30 Beginners)"
                                    onChange={e => this.onSessionTitleChange(e.target.value, session.sessionId)}/>
                                Limit:<InputNumber defaultValue={DEFAULT_TRAINING_LIMIT} onChange={e=>this.onSessionLimitChange(e, session.sessionId)}/>
                                <MinusCircleOutlined onClick={e=>this.onRemoveSessionClick(session.sessionId)} className='minusIcon' />
                            </div>
                        )
                    })}
                </div>
                <h4 className='formSectionTitle'>Notes</h4>
                <div className="notesContainer">
                    <Input.TextArea
                        autoSize={{ minRows: 2, maxRows: 6 }}
                        onChange={e => this.onNotesChange(e.target.value)}
                        placeholder='Any notes you want displayed on the form (optional)'/>
                </div>
                <div className='submitTrainingContainer'>
                    <Button
                        type='primary'
                        loading={this.state.isSubmitting}
                        onClick={this.onSubmitForm}>{this.state.submitButtonText}</Button>
                </div>
            </div>
        )
    }
}
