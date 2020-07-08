import React, {Component} from 'react'
import { withRouter, Link, RouteComponentProps } from 'react-router-dom'
import { Button, Input, InputNumber, DatePicker, notification, Checkbox } from 'antd'
import moment from 'moment'
import './CreateEvent.css'
import { AumtEvent } from '../../../types'


interface CreateEventProps extends RouteComponentProps {
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
    showEditSignups: boolean
    currentHasLimit: boolean
    currentSignupLimit: number
    currentSignupOpenDate: Date
    currentNeedAdminConfirm: boolean
    currentOpenToNonMembers: boolean
}

class CreateEvent extends Component<CreateEventProps, CreateEventState> {
    constructor(props: CreateEventProps) {
        super(props)
        this.state = {
            currentId: this.props.defaultValues?.id || this.generateEventId(10),
            currentUrlPath: this.props.defaultValues?.urlPath || '',
            currentTitle: this.props.defaultValues?.title || '',
            currentDescription: this.props.defaultValues?.description || '',
            currentPhotoPath: this.props.defaultValues?.photoPath || '',
            currentDate: this.props.defaultValues?.date || new Date(),
            currentLocation: this.props.defaultValues?.location || '',
            currentFbLink: this.props.defaultValues?.fbLink || '',
            currentSignupLimit: this.props.defaultValues?.signups?.limit || 30,
            currentHasLimit: this.props.defaultValues?.signups?.limit === null ? false : true,
            currentSignupOpenDate: this.props.defaultValues?.signups?.opens || new Date(),
            currentNeedAdminConfirm: this.props.defaultValues?.signups?.needAdminConfirm || false,
            currentOpenToNonMembers: this.props.defaultValues?.signups?.openToNonMembers || false,
            isSubmitting: false,
            showEditSignups: !!this.props.defaultValues?.signups
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

    onEnableSignupsCheck = (checked: boolean) => {
        this.setState({
            ...this.state,
            showEditSignups: checked
        })
    }
    onHasLimitCheck = (checked: boolean) => {
        this.setState({
            ...this.state,
            currentHasLimit: checked
        })
    }

    onSignupLimitChange = (limit: number | undefined) => {
        if (limit) {
            this.setState({
                ...this.state,
                currentSignupLimit: limit
            })
        }
    }
    onSignupOpenDateChange = (d: Date | undefined) => {
        if (d) {
            this.setState({
                ...this.state,
                currentSignupOpenDate: d
            })
        }
    }
    onNeedAdminConfirmCheck = (checked: boolean) => {
        this.setState({
            ...this.state,
            currentNeedAdminConfirm: checked
        })
    }

    onOpenToNonMembersCheck = (checked: boolean) => {
        this.setState({
            ...this.state,
            currentOpenToNonMembers: checked
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
            isSubmitting: true
        })
        this.props.onCreateEventSubmit({
            id: this.state.currentId,
            urlPath: this.state.currentUrlPath,
            title: this.state.currentTitle,
            date: this.state.currentDate,
            description: this.state.currentDescription,
            fbLink: this.state.currentFbLink,
            photoPath: this.state.currentPhotoPath,
            location: this.state.currentLocation,
            signups: !this.state.showEditSignups ? null : {
                opens: this.state.currentSignupOpenDate,
                openToNonMembers: this.state.currentOpenToNonMembers,
                limit: this.state.currentHasLimit ? this.state.currentSignupLimit : null,
                needAdminConfirm: this.state.currentNeedAdminConfirm,
                members: {},
                waitlist: {}
            }
        })
            .then(() => {
                this.setState({
                    ...this.state,
                    isSubmitting: false
                })
                notification.success({
                    message: 'Event Submitted'
                })
                this.props.history.push('/admin/events')
            })
            .catch((err) => {
                this.setState({
                    ...this.state,
                    isSubmitting: false
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
                <h4 className="formSectionDetail">Signups</h4>
                <Checkbox checked={this.state.showEditSignups} onChange={e => this.onEnableSignupsCheck(e.target.checked)}>Enable Signups</Checkbox>
                {this.state.showEditSignups ?
                    <div className='editEventSignupsContainer'>
                        <div>
                            Signups Open: 
                            <DatePicker value={moment(this.state.currentSignupOpenDate)} onChange={e => this.onSignupOpenDateChange(e?.toDate())}/>
                        </div>
                        <div>
                            <Checkbox checked={this.state.currentHasLimit} onChange={e => this.onHasLimitCheck(e.target.checked)}>
                                Limit: 
                            </Checkbox>
                            <InputNumber disabled={!this.state.currentHasLimit} min={0} defaultValue={this.state.currentSignupLimit} onChange={this.onSignupLimitChange}/>
                        </div>
                        <div>
                            <Checkbox checked={this.state.currentNeedAdminConfirm} onChange={e => this.onNeedAdminConfirmCheck(e.target.checked)}>Need Admin Confirmation?</Checkbox>
                            (Confirm spot when paid, etc)
                        </div>
                        <div>
                            <Checkbox checked={this.state.currentOpenToNonMembers} onChange={e => this.onOpenToNonMembersCheck(e.target.checked)}>Non Members can sign themselves up (admin can sign up anyone regardless)</Checkbox>
                        </div>
                    </div>
                : ''}
                <div className='submitEventContainer'>
                    <Button
                        className='createEventSubmitButton'
                        type='primary'
                        loading={this.state.isSubmitting}
                        onClick={this.onSubmitEvent}>Submit Event</Button>
                    <Link to='/admin/events'>
                        <Button>Cancel</Button>
                    </Link>
                </div>
            </div>
        )
    }
}

export default withRouter(CreateEvent)