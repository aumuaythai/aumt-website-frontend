import React, {Component} from 'react'
import { Button, Input, InputNumber, DatePicker, notification } from 'antd'
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
}

const DEFAULT_TRAINING_LIMIT = 30

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
            currentNotes: ''
        }
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
    onAddSessionClick = () => {
        const newSession: AumtTrainingSession = {
            limit: DEFAULT_TRAINING_LIMIT,
            sessionId: this.generateSessionId(10),
            title: '',
            trainers: {},
            members: {},
            waitlist: {},
            feedback: {}
        }

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
            sessions: sessionsObject,
            opens: this.state.currentOpens,
            closes: this.state.currentCloses,
            notes: this.state.currentNotes,
            trainingId: this.generateSessionId(20)
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
                }, 5000)
            })
            .catch((err) => {
                this.setState({
                    ...this.state,
                    isSubmitting: false,
                    submitButtonText: 'Submit Form'
                })
                notification.error({message: 'Error submitting form to database' + err})
            })
    }
    render() {
        return (
            <div className='createTrainingContainer'>
                <h4 className='formSectionTitle'>Form Options</h4>
                <Input placeholder="Form Title" onChange={e => this.onTrainingTitleChange(e.target.value)}></Input>
                <div>
                    <span className="formItemTitle">Opens: </span>
                    <DatePicker showTime onChange={d => this.onOpenDateChange(d?.toDate())} />
                </div>
                <div>
                    <span className="formItemTitle">Closes: </span>
                    <DatePicker showTime onChange={d => this.onClosesDateChange(d?.toDate())} />
                </div>
                <h4 className='formSectionTitle'>Sessions</h4>
                <div className="sessionSection">
                    <div className='addSessionButton'>
                        <Button onClick={this.onAddSessionClick}>Add Session +</Button>
                    </div>
                    {this.state.currentSessions.map((session) => {
                        return (
                            <div key={session.sessionId} className="eachSessionContainer">
                                <Input className='sessionTitleInput' placeholder="Session Title (e.g. Thursday 6:30 Beginners)" onChange={e => this.onSessionTitleChange(e.target.value, session.sessionId)}/>
                                Limit:<InputNumber defaultValue={DEFAULT_TRAINING_LIMIT} onChange={e=>this.onSessionLimitChange(e, session.sessionId)}/>
                                <MinusCircleOutlined onClick={e=>this.onRemoveSessionClick(session.sessionId)} className='minusIcon' />
                            </div>
                        )
                    })}
                </div>
                <h4 className='formSectionTitle'>Notes</h4>
                <div className="notesContainer">
                    <Input.TextArea onChange={e => this.onNotesChange(e.target.value)} placeholder='Any notes you want displayed on the form (optional)'/>
                </div>
                <div className='submitTrainingContainer'>
                    <Button type='primary' loading={this.state.isSubmitting} onClick={this.onSubmitForm}>{this.state.submitButtonText}</Button>
                </div>
            </div>
        )
    }
}