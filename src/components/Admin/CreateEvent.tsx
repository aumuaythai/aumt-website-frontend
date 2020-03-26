import React, {Component} from 'react'
import { Button, Input, DatePicker, notification } from 'antd'
import moment from 'moment'
import './CreateEvent.css'
import { AumtEvent } from '../../types'


interface CreateEventProps {
    onCreateEventSubmit: (eventData: AumtEvent) => Promise<void>
    defaultValues?: AumtEvent
}

interface CreateEventState {
    currentId: string
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
            currentId: this.generateEventId(10),
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
        if (this.props.defaultValues) {
            this.state = {
                ...this.state,
                currentId: this.props.defaultValues.id,
                currentTitle: this.props.defaultValues.title,
                currentDescription: this.props.defaultValues.description,
                currentPhotoPath: this.props.defaultValues.photoPath,
                currentDate: this.props.defaultValues.date,
                currentFbLink: this.props.defaultValues.fbLink,
                currentLocation: this.props.defaultValues.location,
                currentUrlPath: this.props.defaultValues.urlPath
            }
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
            this.setState({
                ...this.state,
                currentDate: d
            })
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
    onLocationChange = (location: string) => {
        this.setState({
            ...this.state,
            currentLocation: location,
        })
    }

    onFbLinkChange = (link: string) => {
        this.setState({
            ...this.state,
            currentFbLink: link
        })
    }

    onPhotoUrlChange = (url: string) => {
        this.setState({
            ...this.state,
            currentPhotoPath: url
        })
    }

    onSubmitEvent = () => {
        if (!this.state.currentTitle) {
            notification.error({
                message: 'Event title required'
            })
            return
        } else if (!this.state.currentUrlPath) {
            // TODO: validate url path
            notification.error({message: 'Url Path required'})
            return
        } else if (!this.state.currentLocation) {
            notification.error({message: 'Location required'})
            return
        }
        this.setState({
            ...this.state,
            isSubmitting: true,
            submitButtonText: 'Submitting'
        })
        this.props.onCreateEventSubmit({
            id: this.state.currentId,
            urlPath: this.state.currentUrlPath,
            title: this.state.currentTitle,
            date: this.state.currentDate,
            description: this.state.currentDescription,
            fbLink: this.state.currentFbLink,
            photoPath: this.state.currentPhotoPath,
            location: this.state.currentLocation
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
                        submitButtonText: 'Submit Event'
                    })
                }, 2500)
            })
            .catch((err) => {
                this.setState({
                    ...this.state,
                    isSubmitting: false,
                    submitButtonText: 'Submit Event'
                })
                notification.error({message: 'Error submitting event to database: ' + err})
            })
    }
    render() {
        return (
            <div className='createTrainingContainer'>
                <h4 className='formSectionTitle'>Event</h4>
                <p>
                    Title: <Input value={this.state.currentTitle} className='shortInput' onChange={e => this.onTitleChange(e.target.value)}/>
                </p>
                <p>
                    Url Path: 
                    <Input className='shortInput' value={this.state.currentUrlPath} placeholder='aumt.co.nz/events/<url-path>' onChange={e => this.onUrlPathChange(e.target.value)}/>
                </p>
                <p>Description</p>
                <Input.TextArea
                    autoSize={{ minRows: 2, maxRows: 6 }}
                    value={this.state.currentDescription}
                    onChange={e => this.onDescriptionChange(e.target.value)}/>
                <h4 className='formSectionTitle'>Details</h4>
                <div>
                    Date: <DatePicker value={moment(this.state.currentDate)} showTime onChange={e => this.onDateChange(e?.toDate())}/>
                </div>
                <p>
                    Location: <Input value={this.state.currentLocation} className='shortInput' onChange={e => this.onLocationChange(e.target.value)}/>
                </p>
                <p>
                    FB Link: <Input value={this.state.currentFbLink} placeholder='optional' className='shortInput' onChange={e=>this.onFbLinkChange(e.target.value)}/>
                </p>
                <p>
                    Photo URL: <Input value={this.state.currentPhotoPath} placeholder='optional' className='shortInput' onChange={e=>this.onPhotoUrlChange(e.target.value)}/>
                </p>
                <div className='submitEventContainer'>
                    <Button
                        type='primary'
                        loading={this.state.isSubmitting}
                        onClick={this.onSubmitEvent}>{this.state.submitButtonText}</Button>
                </div>
            </div>
        )
    }
}
