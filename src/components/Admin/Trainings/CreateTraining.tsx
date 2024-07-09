import React, { Component } from 'react'
import { Link, RouteComponentProps, withRouter } from 'react-router-dom'
import { Button, Input, InputNumber, DatePicker, notification, Radio, Spin } from 'antd'
import moment from 'moment'
import { MinusCircleOutlined } from '@ant-design/icons'
import './CreateTraining.css'
import { MarkdownEditor } from '../../utility/MarkdownEditor'
import { AumtTrainingSession, AumtWeeklyTraining } from '../../../types'
import AdminStore from '../AdminStore'
import db from '../../../services/db'


interface CreateTrainingProps extends RouteComponentProps { }

interface CreateTrainingState {
    currentTitle: string
    currentOpens: Date
    currentCloses: Date
    currentSessions: AumtTrainingSession[]
    isSubmitting: boolean
    currentNotes: string
    currentFeedback: string[]
    currentOpenToPublic: boolean
    currentPopulateWeekValue: number
    currentSignupMaxSessions: number
    currentTrainingId: string
    loadingTraining: boolean
    semester: string
    paymentLock: boolean
}


const CURRENT_YEAR = new Date().getFullYear();
const TRAINING_0_OPENS_DATE = new Date(CURRENT_YEAR, 6, 7, 0, 0, 0)
const TRAINING_0_CLOSES_DATE = new Date(CURRENT_YEAR, 6, 12, 20, 30, 0)

const MILLISECONDS_DAY = 1000 * 60 * 60 * 24;
const MILLISECONDS_WEEK = MILLISECONDS_DAY * 7;

const TRAINING_DEFAULT_NOTES = `RULES/ETIQUETTE
1.    Keep the training area free until your session starts.
2.    No shoes on the mat
3.    Let the trainer know if you need to leave early or take a rest due to injury, medical reasons, etc.
4.    Wipe inside and outside of gear using provided wipes at the end of class.
5.    Put ALL training gear back in its designated place after use.`

class CreateTraining extends Component<CreateTrainingProps, CreateTrainingState> {
    constructor(props: CreateTrainingProps) {
        super(props)
        this.state = {
            currentTitle: '',
            currentOpens: new Date(),
            currentCloses: new Date(),
            currentSessions: [],
            currentOpenToPublic: false,
            isSubmitting: false,
            currentNotes: '',
            currentFeedback: [],
            currentPopulateWeekValue: 1,
            currentSignupMaxSessions: 1,
            currentTrainingId: '',
            loadingTraining: false,
            semester: '',
            paymentLock: true,
        }
    }
    populateWeeklyDefaults = () => {
        // assume semester breaks at week 6
        const weekMuliplier = this.state.currentPopulateWeekValue > 5 ? this.state.currentPopulateWeekValue + 2 : this.state.currentPopulateWeekValue

        console.log(TRAINING_0_OPENS_DATE);
        console.log(new Date(TRAINING_0_OPENS_DATE.getTime() + (MILLISECONDS_WEEK * weekMuliplier)));

        const newOpens = new Date(TRAINING_0_OPENS_DATE.getTime() + (MILLISECONDS_WEEK * weekMuliplier))
        const newCloses = new Date(TRAINING_0_CLOSES_DATE.getTime() + (MILLISECONDS_WEEK * weekMuliplier))

        const dateMonday = new Date(newOpens.getTime() + MILLISECONDS_DAY);
        const dateFriday = new Date(newOpens.getTime() + MILLISECONDS_DAY * 5);
        const dateStrMon = `${dateMonday.getDate()}/${dateFriday.getMonth() + 1}`
        const dateStrFri = `${dateFriday.getDate()}/${dateFriday.getMonth() + 1}`

        const title = `Week ${this.state.currentPopulateWeekValue} Training Signups`;

        const sessions = [
            this.createSession(`Monday 6:30 (Womens Beginners)`, 40, 0),
            this.createSession(`Tuesday 4:30 (Intermediate)`, 40, 1),
            this.createSession(`Wednesday 4:30 (Beginners)`, 40, 2),
            this.createSession(`Thursday 4:30 (Beginners)`, 40, 3),
            this.createSession(`Friday 7:30 (Beginners)`, 40, 4),
        ]

        this.setState({
            ...this.state,
            currentOpens: newOpens,
            currentCloses: newCloses,
            currentTitle: title,
            currentNotes: TRAINING_DEFAULT_NOTES,
            currentSessions: sessions
        })
    }
    componentDidMount = () => {
        const paths = window.location.pathname.split('/')
        const editTrainingIdx = paths.indexOf('edittraining')
        if (editTrainingIdx > -1) {
            this.setState({
                ...this.state,
                loadingTraining: true
            })
            AdminStore.getTrainingById(paths[editTrainingIdx + 1])
                .then((training: AumtWeeklyTraining) => {
                    const sessions: AumtTrainingSession[] = []
                    Object.keys(training.sessions).forEach((sessionId) => {
                        sessions.push(training.sessions[sessionId])
                    })
                    this.setState({
                        ...this.state,
                        currentTitle: training.title,
                        currentOpens: training.opens,
                        currentCloses: training.closes,
                        currentSessions: sessions.sort((a, b) => a.position - b.position),
                        currentNotes: training.notes,
                        currentOpenToPublic: training.openToPublic,
                        currentFeedback: training.feedback,
                        currentTrainingId: training.trainingId,
                        currentSignupMaxSessions: training.signupMaxSessions,
                        loadingTraining: false,
                        semester: training.semester,
                        paymentLock: training.paymentLock
                    })
                })
                .catch((err) => {
                    notification.error({ message: 'Error getting training by id: ' + paths[editTrainingIdx + 1] + ', redirecting to dashboard' })
                    this.setState({
                        ...this.state,
                        loadingTraining: false
                    })
                    this.props.history.push('/admin')
                })
        } else {
            // empty form
            this.onAddSessionClick()
        }
    }
    generateSessionId = (length: number) => {
        const digits = '1234567890qwertyuiopasdfghjklzxcvbnm'
        let id = ''
        for (let i = 0; i < length; i++) {
            id += digits[Math.floor(Math.random() * digits.length)]
        }
        return id
    }
    onPopulateWeekChange = (n: string | number | undefined) => {
        this.setState({ ...this.state, currentPopulateWeekValue: Number(n) || 1 })
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
    onOpenToPublicChange = (open: boolean) => {
        this.setState({
            ...this.state,
            currentOpenToPublic: open
        })
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
    onSessionLimitChange = (limit: string | number | undefined, sessionId: string) => {
        if (typeof limit === 'number') {
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
    onSignupMaxSessionsChange = (maxSessions: string | number | undefined) => {
        const numMaxSessions = Number(maxSessions || 1)
        this.setState({
            ...this.state,
            currentSignupMaxSessions: numMaxSessions
        })

    }
    createSession = (sessionTitle: string, limit: number, position: number) => {
        const newSession: AumtTrainingSession = {
            limit: limit,
            sessionId: this.generateSessionId(10),
            title: sessionTitle,
            position,
            trainers: [],
            members: {},
            waitlist: {}
        }
        return newSession
    }
    onAddSessionClick = () => {
        const newSession = this.createSession('', 30, this.state.currentSessions.length)

        this.setState({
            ...this.state,
            currentSessions: this.state.currentSessions.concat([newSession])
        })
    }
    onSemesterChange = (semester: string) => {
        console.log('semester change', semester);
        this.setState({
            ...this.state,
            semester: semester
        })
    }
    onPaymentLockChange = (lock: boolean) => {
        this.setState({
            ...this.state,
            paymentLock: lock
        })
    }
    onSubmitForm = () => {
        if (!this.state.currentTitle) {
            notification.error({
                message: 'Form title required'
            })
            return
        } else if (!this.state.currentSessions.length) {
            notification.error({ message: 'There must be at least one session option' })
            return
        } else if (this.state.currentSessions.find(s => !s.title)) {
            notification.error({ message: 'All session options must have a title' })
            return
        } else if (this.state.semester === '') {
            notification.error({
                message: 'Semester selection required'
            })
            return
        }
        this.setState({
            ...this.state,
            isSubmitting: true,
        })
        const sessions: Record<string, AumtTrainingSession> = {}
        this.state.currentSessions.forEach((session) => {
            sessions[session.sessionId] = session
        })
        db.submitNewForm({
            title: this.state.currentTitle,
            sessions,
            signupMaxSessions: this.state.currentSignupMaxSessions,
            opens: this.state.currentOpens,
            closes: this.state.currentCloses,
            openToPublic: this.state.currentOpenToPublic,
            notes: this.state.currentNotes,
            trainingId: this.state.currentTrainingId || this.state.currentTitle.split(' ').join('').slice(0, 13) + this.generateSessionId(7),
            feedback: this.state.currentFeedback,
            semester: this.state.semester,
            paymentLock: this.state.paymentLock
        })
            .then(() => {
                this.setState({
                    ...this.state,
                    isSubmitting: false,
                })
                notification.success({
                    message: 'Training Saved'
                })
                this.props.history.push('/admin')
            })
            .catch((err) => {
                this.setState({
                    ...this.state,
                    isSubmitting: false
                })
                notification.error({ message: 'Error submitting form to database: ' + err })
            })
    }
    render() {
        if (this.state.loadingTraining) {
            return <Spin />
        }
        return (
            <div className='createTrainingContainer'>
                <span>Use weekly training template for week: </span><InputNumber onChange={this.onPopulateWeekChange} className='populateInput' defaultValue={1} min={1} /><Button onClick={this.populateWeeklyDefaults}>Populate</Button>
                <h4 className='formSectionTitle'>Title</h4>
                <Input placeholder="Form Title" value={this.state.currentTitle} onChange={e => this.onTrainingTitleChange(e.target.value)}></Input>
                <div>
                    <span className="formItemTitle">Opens: </span>
                    <DatePicker value={moment(this.state.currentOpens)} showTime onChange={d => this.onOpenDateChange(d?.toDate())} />
                </div>
                <div>
                    <span className="formItemTitle">Closes: </span>
                    <DatePicker value={moment(this.state.currentCloses)} showTime onChange={d => this.onClosesDateChange(d?.toDate())} />
                </div>
                <div>
                    Open to Non-Members:
                    <Radio.Group value={this.state.currentOpenToPublic} onChange={e => this.onOpenToPublicChange(e.target.value)}>
                        <Radio.Button value={true}>Yes</Radio.Button>
                        <Radio.Button value={false}>No</Radio.Button>
                    </Radio.Group>
                </div>
                <h4 className='formSectionTitle'>Sessions</h4>
                Members can sign up to <InputNumber value={this.state.currentSignupMaxSessions} onChange={this.onSignupMaxSessionsChange} className='createTrainingMaxSessionInput' defaultValue={1} min={1} /> session(s).
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
                                    onChange={e => this.onSessionTitleChange(e.target.value, session.sessionId)} />
                                Limit:<InputNumber min={0} defaultValue={session.limit} onChange={e => this.onSessionLimitChange(e, session.sessionId)} />
                                <MinusCircleOutlined onClick={e => this.onRemoveSessionClick(session.sessionId)} className='minusIcon' />
                            </div>
                        )
                    })}
                </div>

                <h4 className='formSectionTitle'>Semester</h4>
                <Radio.Group buttonStyle="solid" name="semesterRadio" value={this.state.semester} onChange={e => this.onSemesterChange(e.target.value)}>
                    <Radio.Button value={'S1'}>Semester 1</Radio.Button>
                    <Radio.Button value={'S2'}>Semester 2</Radio.Button>
                    <Radio.Button value={'SS'}>Summer School</Radio.Button>
                </Radio.Group>

                <h4 className='formSectionTitle'>Payment Lock</h4>
                <Radio.Group buttonStyle="solid" name="semesterRadio" value={this.state.paymentLock} onChange={e => this.onPaymentLockChange(e.target.value)}>
                    <Radio.Button value={true}>On</Radio.Button>
                    <Radio.Button value={false}>Off</Radio.Button>
                </Radio.Group>

                <h4 className='formSectionTitle'>Notes</h4>
                <div className="notesContainer">
                    <MarkdownEditor
                        onChange={this.onNotesChange}
                        value={this.state.currentNotes}
                    ></MarkdownEditor>
                </div>
                <div className='submitTrainingContainer'>
                    <Button
                        className='createTrainingSubmitButton'
                        type='primary'
                        loading={this.state.isSubmitting}
                        onClick={this.onSubmitForm}>Save Training</Button>
                    <Link to='/admin'>
                        <Button>Cancel</Button>
                    </Link>
                </div>
            </div>
        )
    }
}
export default withRouter(CreateTraining)