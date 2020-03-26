import React, {Component} from 'react'
import { Button, Input, InputNumber, DatePicker, notification } from 'antd'
import './CreateEvent.css'
import { AumtEvent } from '../../types'
import db from '../../services/db'


interface CreateEventProps {
}

interface CreateEventState {
    currentUrlPath: string
    currentTitle: string
    currentDescription: string
    currentPhotoPath: string
    currentDate: Date
    currentLocation: string
    currentFbLink: string
    isSubmitting: boolean
    submitButtonText: string
}

export class CreateEvent extends Component<CreateEventProps, CreateEventState> {
    constructor(props: CreateEventProps) {
        super(props)
        this.state = {
            currentUrlPath: '',
            currentTitle: '',
            currentDescription: '',
            currentPhotoPath: '',
            currentDate: new Date(),
            currentLocation: '',
            currentFbLink: '',
            isSubmitting: false,
            submitButtonText: 'Submit Event'
        }
    }
    generateEventId = (length: number) => {
        const digits = '1234567890qwertyuiopasdfghjklzxcvbnm'
        let id = ''
        for (let i = 0; i < length; i ++) {
            id += digits[Math.floor(Math.random() * digits.length)]
        }
        return id
    }
    onTitleChange = (title: string) => {
        this.setState({
            ...this.state,
            currentTitle: title
        })
    }
    onUrlPathChange = (path: string) => {
        this.setState({
            ...this.state,
            currentUrlPath: path
        })
    }
    onDateChange = (d: Date | undefined) => {
        if (d) {
            // this.setState({
            //     ...this.state,
            //     currentOpens: d
            // })
        }
    }
    onTrainingTitleChange = (title: string) => {
        this.setState({
            ...this.state,
            currentTitle: title
        })
    }
    onDescriptionChange = (description: string) => {
        this.setState({
            ...this.state,
            currentDescription: description
        })
    }

    onSubmitForm = () => {
        // if (!this.state.currentTitle) {
        //     notification.error({
        //         message: 'Form title required'
        //     })
        //     return
        // } else if (!this.state.currentSessions.length) {
        //     notification.error({message: 'There must be at least one session option'})
        //     return
        // } else if (this.state.currentSessions.find(s => !s.title)) {
        //     notification.error({message: 'All session options must have a title'})
        //     return
        // }
        // const sessionsObject: {[sessionId: string]: AumtTrainingSession} = {}
        // for (const i of this.state.currentSessions) {
        //     sessionsObject[i.sessionId] = i
        // }
        // this.setState({
        //     ...this.state,
        //     isSubmitting: true,
        //     submitButtonText: 'Submitting'
        // })
        // db.submitNewForm({
        //     title: this.state.currentTitle,
        //     sessions: this.state.currentSessions,
        //     opens: this.state.currentOpens,
        //     closes: this.state.currentCloses,
        //     notes: this.state.currentNotes.split('\n').join('%%NEWLINE%%'),
        //     trainingId: this.state.currentTitle.split(' ').join('').slice(0, 13) + this.generateSessionId(7),
        //     feedback: []
        // })
        //     .then(() => {
        //         this.setState({
        //             ...this.state,
        //             isSubmitting: false,
        //             submitButtonText: 'Submitted!'
        //         })
        //         setTimeout(() => {
        //             this.setState({
        //                 ...this.state,
        //                 submitButtonText: 'Submit Form'
        //             })
        //         }, 2500)
        //     })
        //     .catch((err) => {
        //         this.setState({
        //             ...this.state,
        //             isSubmitting: false,
        //             submitButtonText: 'Submit Form'
        //         })
        //         notification.error({message: 'Error submitting form to database: ' + err})
        //     })
    }
    render() {
        return (
            <div className='createTrainingContainer'>
                <h4>Event Basics</h4>
                <p>
                    Title: <Input className='shortInput' onChange={e => this.onTitleChange(e.target.value)}/>
                </p>
                <p>
                    Url Path: 
                    <Input className='shortInput' placeholder='aumt.co.nz/events/???' onChange={e => this.onUrlPathChange(e.target.value)}/>
                </p>
                <p>Description</p>
                <Input.TextArea onChange={e => this.onDescriptionChange(e.target.value)}/>
                <h4>Details</h4>
                <p>Time</p>

            </div>
        )
    }
}
