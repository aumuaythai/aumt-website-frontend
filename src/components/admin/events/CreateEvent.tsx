// import {
//   Button,
//   Checkbox,
//   DatePicker,
//   Input,
//   InputNumber,
//   notification,
//   Spin,
// } from 'antd'
// import moment from 'moment'
// import React, { Component } from 'react'
// import { Link, RouteComponentProps, withRouter } from 'react-router-dom'
// import { submitEvent } from '../../../services/db'
// import { AumtEvent, AumtEventSignup } from '../../../types'
// import { MarkdownEditor } from '../../utility/MarkdownEditor'
// import AdminStore from '../AdminStore'
// import './CreateEvent.css'

// interface CreateEventProps extends RouteComponentProps {
//   defaultValues?: AumtEvent
// }

// interface CreateEventState {
//   currentId: string
//   currentUrlPath: string
//   currentTitle: string
//   currentDescription: string
//   currentPhotoPath: string
//   currentDate: Date
//   currentLocation: string
//   currentLocationLink: string
//   currentFbLink: string
//   isSubmitting: boolean
//   showEditSignups: boolean
//   currentHasLimit: boolean
//   currentSignupLimit: number
//   currentIsCamp: boolean
//   currentSignupOpenDate: Date
//   currentSignupClosesDate: Date
//   currentNeedAdminConfirm: boolean
//   currentOpenToNonMembers: boolean
//   currentMembers: AumtEventSignup
//   currentWaitlist: AumtEventSignup
//   loadingEvent: boolean
// }

// class CreateEvent extends Component<CreateEventProps, CreateEventState> {
//   constructor(props: CreateEventProps) {
//     super(props)
//     this.state = {
//       currentId: this.generateEventId(10),
//       currentUrlPath: '',
//       currentTitle: '',
//       currentDescription: '',
//       currentPhotoPath: '',
//       currentDate: new Date(),
//       currentLocation: '',
//       currentLocationLink: '',
//       currentFbLink: '',
//       currentSignupLimit: 30,
//       currentIsCamp: false,
//       currentHasLimit: true,
//       currentSignupOpenDate: new Date(),
//       currentSignupClosesDate: new Date(),
//       currentNeedAdminConfirm: false,
//       currentOpenToNonMembers: false,
//       isSubmitting: false,
//       loadingEvent: false,
//       currentMembers: {},
//       currentWaitlist: {},
//       showEditSignups: false,
//     }
//   }
//   componentDidMount = () => {
//     const paths = window.location.pathname.split('/')
//     const editEventIdx = paths.indexOf('editevent')
//     if (editEventIdx > -1) {
//       const eventId = paths[editEventIdx + 1]
//       this.setState({
//         ...this.state,
//         loadingEvent: true,
//       })
//       AdminStore.getEventById(eventId)
//         .then((loadedEvent) => {
//           this.setState({
//             ...this.state,
//             currentId: loadedEvent.id,
//             currentUrlPath: loadedEvent.urlPath,
//             currentTitle: loadedEvent.title,
//             currentDescription: loadedEvent.description,
//             currentPhotoPath: loadedEvent.photoPath,
//             currentDate: loadedEvent.date,
//             currentLocation: loadedEvent.location,
//             currentLocationLink: loadedEvent.locationLink,
//             currentFbLink: loadedEvent.fbLink,
//             showEditSignups: !!loadedEvent.signups,
//             currentSignupLimit: loadedEvent.signups?.limit || 30,
//             currentHasLimit: loadedEvent.signups?.limit === null ? false : true,
//             currentSignupOpenDate: loadedEvent.signups?.opens || new Date(),
//             currentSignupClosesDate: loadedEvent.signups?.closes || new Date(),
//             currentNeedAdminConfirm:
//               loadedEvent.signups?.needAdminConfirm || false,
//             currentOpenToNonMembers:
//               loadedEvent.signups?.openToNonMembers || false,
//             currentIsCamp: loadedEvent.signups?.isCamp || false,
//             currentMembers: loadedEvent.signups?.members || {},
//             currentWaitlist: loadedEvent.signups?.waitlist || {},
//           })
//         })
//         .catch((err) => {
//           notification.error({
//             message:
//               'Error retrieving event for id ' +
//               eventId +
//               ', redirecting to dashboard',
//           })
//           this.props.history.push('/admin/events')
//         })
//         .finally(() => {
//           this.setState({
//             ...this.state,
//             loadingEvent: false,
//           })
//         })
//     }
//   }
//   generateEventId = (length: number) => {
//     const digits = '1234567890qwertyuiopasdfghjklzxcvbnm'
//     let id = ''
//     for (let i = 0; i < length; i++) {
//       id += digits[Math.floor(Math.random() * digits.length)]
//     }
//     return id
//   }
//   onTitleChange = (title: string) => {
//     this.setState({
//       ...this.state,
//       currentTitle: title,
//     })
//   }
//   onUrlPathChange = (path: string) => {
//     this.setState({
//       ...this.state,
//       currentUrlPath: path,
//     })
//   }
//   onDateChange = (d: Date | undefined) => {
//     if (d) {
//       this.setState({
//         ...this.state,
//         currentDate: d,
//       })
//     }
//   }
//   onTrainingTitleChange = (title: string) => {
//     this.setState({
//       ...this.state,
//       currentTitle: title,
//     })
//   }
//   onDescriptionChange = (description: string) => {
//     this.setState({
//       ...this.state,
//       currentDescription: description,
//     })
//   }
//   onLocationChange = (location: string) => {
//     this.setState({
//       ...this.state,
//       currentLocation: location,
//     })
//   }

//   onLocationLinkChange = (link: string) => {
//     this.setState({
//       ...this.state,
//       currentLocationLink: link,
//     })
//   }

//   onFbLinkChange = (link: string) => {
//     this.setState({
//       ...this.state,
//       currentFbLink: link,
//     })
//   }

//   onPhotoUrlChange = (url: string) => {
//     this.setState({
//       ...this.state,
//       currentPhotoPath: url,
//     })
//   }

//   onEnableSignupsCheck = (checked: boolean) => {
//     this.setState({
//       ...this.state,
//       showEditSignups: checked,
//     })
//   }
//   onIsCampChange = (checked: boolean) => {
//     this.setState({
//       ...this.state,
//       currentIsCamp: checked,
//     })
//   }
//   onHasLimitCheck = (checked: boolean) => {
//     this.setState({
//       ...this.state,
//       currentHasLimit: checked,
//     })
//   }

//   onSignupLimitChange = (limit: string | number | undefined) => {
//     if (limit) {
//       this.setState({
//         ...this.state,
//         currentSignupLimit: Number(limit),
//       })
//     }
//   }
//   onSignupOpenDateChange = (d: Date | undefined) => {
//     if (d) {
//       this.setState({
//         ...this.state,
//         currentSignupOpenDate: d,
//       })
//     }
//   }
//   onSignupClosesDateChange = (d: Date | undefined) => {
//     if (d) {
//       this.setState({ ...this.state, currentSignupClosesDate: d })
//     }
//   }
//   onNeedAdminConfirmCheck = (checked: boolean) => {
//     this.setState({
//       ...this.state,
//       currentNeedAdminConfirm: checked,
//     })
//   }

//   onOpenToNonMembersCheck = (checked: boolean) => {
//     this.setState({
//       ...this.state,
//       currentOpenToNonMembers: checked,
//     })
//   }

//   onSubmitEvent = () => {
//     if (!this.state.currentTitle) {
//       notification.error({
//         message: 'Event title required',
//       })
//       return
//     } else if (!this.state.currentUrlPath) {
//       // TODO: validate url path
//       notification.error({ message: 'Url Path required' })
//       return
//     } else if (!this.state.currentLocation) {
//       notification.error({ message: 'Location required' })
//       return
//     }
//     this.setState({
//       ...this.state,
//       isSubmitting: true,
//     })
//     submitEvent({
//       id: this.state.currentId,
//       urlPath: this.state.currentUrlPath,
//       title: this.state.currentTitle,
//       date: this.state.currentDate,
//       description: this.state.currentDescription,
//       fbLink: this.state.currentFbLink,
//       photoPath: this.state.currentPhotoPath,
//       location: this.state.currentLocation,
//       locationLink: this.state.currentLocationLink,
//       signups: !this.state.showEditSignups
//         ? null
//         : {
//             opens: this.state.currentSignupOpenDate,
//             closes: this.state.currentSignupClosesDate,
//             openToNonMembers: this.state.currentOpenToNonMembers,
//             limit: this.state.currentHasLimit
//               ? this.state.currentSignupLimit
//               : null,
//             needAdminConfirm: this.state.currentNeedAdminConfirm,
//             isCamp: this.state.currentIsCamp,
//             members: this.state.currentMembers || {},
//             waitlist: this.state.currentWaitlist || {},
//           },
//     })
//       .then(() => {
//         this.setState({
//           ...this.state,
//           isSubmitting: false,
//         })
//         notification.success({
//           message: 'Event Submitted',
//         })
//         this.props.history.push('/admin/events')
//       })
//       .catch((err) => {
//         this.setState({
//           ...this.state,
//           isSubmitting: false,
//         })
//         notification.error({
//           message: 'Error submitting event to database: ' + err,
//         })
//       })
//   }
//   render() {
//     if (this.state.loadingEvent) {
//       return (
//         <div>
//           <Spin />
//         </div>
//       )
//     }
//     return (
//       <div className="h-auto text-left px-5">
//         <h4 className="formSectionTitle">Event</h4>
//         <p>
//           Title:{' '}
//           <Input
//             value={this.state.currentTitle}
//             className="shortInput"
//             onChange={(e) => this.onTitleChange(e.target.value)}
//           />
//         </p>
//         <p>
//           Url Path:
//           <Input
//             className="shortInput"
//             value={this.state.currentUrlPath}
//             placeholder="aumt.co.nz/events/<url-path>"
//             onChange={(e) => this.onUrlPathChange(e.target.value)}
//           />
//         </p>
//         <h4 className="formSectionTitle">Description</h4>
//         <MarkdownEditor
//           onChange={this.onDescriptionChange}
//           value={this.state.currentDescription}
//         ></MarkdownEditor>
//         <h4 className="formSectionTitle">Details</h4>
//         <div>
//           Date:{' '}
//           <DatePicker
//             value={moment(this.state.currentDate)}
//             showTime
//             onChange={(e) => this.onDateChange(e?.toDate())}
//           />
//         </div>
//         <p>
//           Location:{' '}
//           <Input
//             value={this.state.currentLocation}
//             className="shortInput"
//             onChange={(e) => this.onLocationChange(e.target.value)}
//           />
//         </p>
//         <p>
//           Maps Link:{' '}
//           <Input
//             placeholder="optional"
//             value={this.state.currentLocationLink}
//             className="shortInput"
//             onChange={(e) => this.onLocationLinkChange(e.target.value)}
//           />
//         </p>
//         <p>
//           FB Link:{' '}
//           <Input
//             value={this.state.currentFbLink}
//             placeholder="optional"
//             className="shortInput"
//             onChange={(e) => this.onFbLinkChange(e.target.value)}
//           />
//         </p>
//         <p>
//           Photo URL:{' '}
//           <Input
//             value={this.state.currentPhotoPath}
//             placeholder="optional"
//             className="shortInput"
//             onChange={(e) => this.onPhotoUrlChange(e.target.value)}
//           />
//         </p>
//         <h4 className="formSectionDetail">Signups</h4>
//         <Checkbox
//           checked={this.state.showEditSignups}
//           onChange={(e) => this.onEnableSignupsCheck(e.target.checked)}
//         >
//           Enable Signups
//         </Checkbox>
//         {this.state.showEditSignups ? (
//           <div className="editEventSignupsContainer">
//             <div>
//               Signups Open:
//               <DatePicker
//                 value={moment(this.state.currentSignupOpenDate)}
//                 onChange={(e) => this.onSignupOpenDateChange(e?.toDate())}
//               />
//             </div>
//             <div>
//               Signups Close:
//               <DatePicker
//                 value={moment(this.state.currentSignupClosesDate)}
//                 onChange={(e) => this.onSignupClosesDateChange(e?.toDate())}
//               />
//             </div>
//             <div>
//               <Checkbox
//                 checked={this.state.currentHasLimit}
//                 onChange={(e) => this.onHasLimitCheck(e.target.checked)}
//               >
//                 Limit:
//               </Checkbox>
//               <InputNumber
//                 disabled={!this.state.currentHasLimit}
//                 min={0}
//                 defaultValue={this.state.currentSignupLimit}
//                 onChange={this.onSignupLimitChange}
//               />
//             </div>
//             <div>
//               <Checkbox
//                 checked={this.state.currentNeedAdminConfirm}
//                 onChange={(e) => this.onNeedAdminConfirmCheck(e.target.checked)}
//               >
//                 Need Admin Confirmation?
//               </Checkbox>
//               (Confirm spot when paid, etc)
//             </div>
//             <div>
//               <Checkbox
//                 checked={this.state.currentIsCamp}
//                 onChange={(e) => this.onIsCampChange(e.target.checked)}
//               >
//                 Include Drivers and Dietary Requirement Form
//               </Checkbox>
//             </div>
//             <div>
//               <Checkbox
//                 checked={this.state.currentOpenToNonMembers}
//                 onChange={(e) => this.onOpenToNonMembersCheck(e.target.checked)}
//               >
//                 Non Members can sign themselves up (admin can sign up anyone
//                 regardless)
//               </Checkbox>
//             </div>
//           </div>
//         ) : null}
//         <div className="submitEventContainer">
//           <Button
//             className="createEventSubmitButton"
//             type="primary"
//             loading={this.state.isSubmitting}
//             onClick={this.onSubmitEvent}
//           >
//             Submit Event
//           </Button>
//           <Link to="/admin/events">
//             <Button>Cancel</Button>
//           </Link>
//         </div>
//       </div>
//     )
//   }
// }

// export default withRouter(CreateEvent)

import {
  Button,
  Checkbox,
  DatePicker,
  Input,
  InputNumber,
  notification,
  Spin,
} from 'antd'
import moment from 'moment'
import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { submitEvent } from '../../../services/db'
import MarkdownEditor from '../../utility/MarkdownEditor'
import AdminStore from '../AdminStore'
import './CreateEvent.css'

export default function CreateEvent() {
  const [currentId, setCurrentId] = useState(generateEventId(10))
  const [currentUrlPath, setCurrentUrlPath] = useState('')
  const [currentTitle, setCurrentTitle] = useState('')
  const [currentDescription, setCurrentDescription] = useState('')
  const [currentPhotoPath, setCurrentPhotoPath] = useState('')
  const [currentDate, setCurrentDate] = useState(new Date())
  const [currentLocation, setCurrentLocation] = useState('')
  const [currentLocationLink, setCurrentLocationLink] = useState('')
  const [currentFbLink, setCurrentFbLink] = useState('')
  const [currentSignupLimit, setCurrentSignupLimit] = useState(30)
  const [currentIsCamp, setCurrentIsCamp] = useState(false)
  const [currentHasLimit, setCurrentHasLimit] = useState(true)
  const [currentSignupOpenDate, setCurrentSignupOpenDate] = useState(new Date())
  const [currentSignupClosesDate, setCurrentSignupClosesDate] = useState(
    new Date()
  )
  const [currentNeedAdminConfirm, setCurrentNeedAdminConfirm] = useState(false)
  const [currentOpenToNonMembers, setCurrentOpenToNonMembers] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [loadingEvent, setLoadingEvent] = useState(false)
  const [currentMembers, setCurrentMembers] = useState({})
  const [currentWaitlist, setCurrentWaitlist] = useState({})
  const [showEditSignups, setShowEditSignups] = useState(false)

  useEffect(() => {
    const paths = window.location.pathname.split('/')
    const editEventIdx = paths.indexOf('editevent')
    if (editEventIdx > -1) {
      const eventId = paths[editEventIdx + 1]
      setLoadingEvent(true)

      AdminStore.getEventById(eventId)
        .then((loadedEvent) => {
          setCurrentId(loadedEvent.id)
          setCurrentUrlPath(loadedEvent.urlPath)
          setCurrentTitle(loadedEvent.title)
          setCurrentDescription(loadedEvent.description)
          setCurrentPhotoPath(loadedEvent.photoPath)
          setCurrentDate(loadedEvent.date)
          setCurrentLocation(loadedEvent.location)
          setCurrentLocationLink(loadedEvent.locationLink)
          setCurrentFbLink(loadedEvent.fbLink)
          setShowEditSignups(!!loadedEvent.signups)
          setCurrentSignupLimit(loadedEvent.signups?.limit || 30)
          setCurrentHasLimit(loadedEvent.signups?.limit === null ? false : true)
          setCurrentSignupOpenDate(loadedEvent.signups?.opens || new Date())
          setCurrentSignupClosesDate(loadedEvent.signups?.closes || new Date())
          setCurrentNeedAdminConfirm(
            loadedEvent.signups?.needAdminConfirm || false
          )
          setCurrentOpenToNonMembers(
            loadedEvent.signups?.openToNonMembers || false
          )
          setCurrentIsCamp(loadedEvent.signups?.isCamp || false)
          setCurrentMembers(loadedEvent.signups?.members || {})
          setCurrentWaitlist(loadedEvent.signups?.waitlist || {})
        })
        .catch((err) => {
          notification.error({
            message:
              'Error retrieving event for id ' +
              eventId +
              ', redirecting to dashboard',
          })
        })
        .finally(() => {
          setLoadingEvent(false)
        })
    }
  }, [])

  function generateEventId(length: number) {
    const digits = '1234567890qwertyuiopasdfghjklzxcvbnm'
    let id = ''
    for (let i = 0; i < length; i++) {
      id += digits[Math.floor(Math.random() * digits.length)]
    }
    return id
  }

  const onTitleChange = (title: string) => {
    setCurrentTitle(title)
  }
  const onUrlPathChange = (path: string) => {
    setCurrentUrlPath(path)
  }
  const onDateChange = (d: Date | undefined) => {
    if (d) {
      setCurrentDate(d)
    }
  }
  const onTrainingTitleChange = (title: string) => {
    setCurrentTitle(title)
  }
  const onDescriptionChange = (description: string) => {
    setCurrentDescription(description)
  }
  const onLocationChange = (location: string) => {
    setCurrentLocation(location)
  }

  const onLocationLinkChange = (link: string) => {
    setCurrentLocationLink(link)
  }

  const onFbLinkChange = (link: string) => {
    setCurrentFbLink(link)
  }

  const onPhotoUrlChange = (url: string) => {
    setCurrentPhotoPath(url)
  }

  const onEnableSignupsCheck = (checked: boolean) => {
    setShowEditSignups(checked)
  }
  const onIsCampChange = (checked: boolean) => {
    setCurrentIsCamp(checked)
  }
  const onHasLimitCheck = (checked: boolean) => {
    setCurrentHasLimit(checked)
  }

  const onSignupLimitChange = (limit: string | number | undefined) => {
    if (limit) {
      setCurrentSignupLimit(Number(limit))
    }
  }
  const onSignupOpenDateChange = (d: Date | undefined) => {
    if (d) {
      setCurrentSignupOpenDate(d)
    }
  }
  const onSignupClosesDateChange = (d: Date | undefined) => {
    if (d) {
      setCurrentSignupClosesDate(d)
    }
  }
  const onNeedAdminConfirmCheck = (checked: boolean) => {
    setCurrentNeedAdminConfirm(checked)
  }

  const onOpenToNonMembersCheck = (checked: boolean) => {
    setCurrentOpenToNonMembers(checked)
  }

  const onSubmitEvent = () => {
    if (!currentTitle) {
      notification.error({
        message: 'Event title required',
      })
      return
    } else if (!currentUrlPath) {
      // TODO: validate url path
      notification.error({ message: 'Url Path required' })
      return
    } else if (!currentLocation) {
      notification.error({ message: 'Location required' })
      return
    }
    setIsSubmitting(true)
    submitEvent({
      id: currentId,
      urlPath: currentUrlPath,
      title: currentTitle,
      date: currentDate,
      description: currentDescription,
      fbLink: currentFbLink,
      photoPath: currentPhotoPath,
      location: currentLocation,
      locationLink: currentLocationLink,
      signups: !showEditSignups
        ? null
        : {
            opens: currentSignupOpenDate,
            closes: currentSignupClosesDate,
            openToNonMembers: currentOpenToNonMembers,
            limit: currentHasLimit ? currentSignupLimit : null,
            needAdminConfirm: currentNeedAdminConfirm,
            isCamp: currentIsCamp,
            members: currentMembers || {},
            waitlist: currentWaitlist || {},
          },
    })
      .then(() => {
        setIsSubmitting(false)
        notification.success({
          message: 'Event Submitted',
        })
      })
      .catch((err) => {
        setIsSubmitting(false)
        notification.error({
          message: 'Error submitting event to database: ' + err,
        })
      })
  }

  if (loadingEvent) {
    return (
      <div>
        <Spin />
      </div>
    )
  }

  return (
    <div className="h-auto text-left px-5">
      <h4 className="formSectionTitle">Event</h4>
      <p>
        Title:{' '}
        <Input
          value={currentTitle}
          className="shortInput"
          onChange={(e) => onTitleChange(e.target.value)}
        />
      </p>
      <p>
        Url Path:
        <Input
          className="shortInput"
          value={currentUrlPath}
          placeholder="aumt.co.nz/events/<url-path>"
          onChange={(e) => onUrlPathChange(e.target.value)}
        />
      </p>
      <h4 className="formSectionTitle">Description</h4>
      <MarkdownEditor
        onChange={onDescriptionChange}
        value={currentDescription}
      ></MarkdownEditor>
      <h4 className="formSectionTitle">Details</h4>
      <div>
        Date:{' '}
        <DatePicker
          value={moment(currentDate)}
          showTime
          onChange={(e) => onDateChange(e?.toDate())}
        />
      </div>
      <p>
        Location:{' '}
        <Input
          value={currentLocation}
          className="shortInput"
          onChange={(e) => onLocationChange(e.target.value)}
        />
      </p>
      <p>
        Maps Link:{' '}
        <Input
          placeholder="optional"
          value={currentLocationLink}
          className="shortInput"
          onChange={(e) => onLocationLinkChange(e.target.value)}
        />
      </p>
      <p>
        FB Link:{' '}
        <Input
          value={currentFbLink}
          placeholder="optional"
          className="shortInput"
          onChange={(e) => onFbLinkChange(e.target.value)}
        />
      </p>
      <p>
        Photo URL:{' '}
        <Input
          value={currentPhotoPath}
          placeholder="optional"
          className="shortInput"
          onChange={(e) => onPhotoUrlChange(e.target.value)}
        />
      </p>
      <h4 className="formSectionDetail">Signups</h4>
      <Checkbox
        checked={showEditSignups}
        onChange={(e) => onEnableSignupsCheck(e.target.checked)}
      >
        Enable Signups
      </Checkbox>
      {showEditSignups ? (
        <div className="editEventSignupsContainer">
          <div>
            Signups Open:
            <DatePicker
              value={moment(currentSignupOpenDate)}
              onChange={(e) => onSignupOpenDateChange(e?.toDate())}
            />
          </div>
          <div>
            Signups Close:
            <DatePicker
              value={moment(currentSignupClosesDate)}
              onChange={(e) => onSignupClosesDateChange(e?.toDate())}
            />
          </div>
          <div>
            <Checkbox
              checked={currentHasLimit}
              onChange={(e) => onHasLimitCheck(e.target.checked)}
            >
              Limit:
            </Checkbox>
            <InputNumber
              disabled={!currentHasLimit}
              min={0}
              defaultValue={currentSignupLimit}
              onChange={onSignupLimitChange}
            />
          </div>
          <div>
            <Checkbox
              checked={currentNeedAdminConfirm}
              onChange={(e) => onNeedAdminConfirmCheck(e.target.checked)}
            >
              Need Admin Confirmation?
            </Checkbox>
            (Confirm spot when paid, etc)
          </div>
          <div>
            <Checkbox
              checked={currentIsCamp}
              onChange={(e) => onIsCampChange(e.target.checked)}
            >
              Include Drivers and Dietary Requirement Form
            </Checkbox>
          </div>
          <div>
            <Checkbox
              checked={currentOpenToNonMembers}
              onChange={(e) => onOpenToNonMembersCheck(e.target.checked)}
            >
              Non Members can sign themselves up (admin can sign up anyone
              regardless)
            </Checkbox>
          </div>
        </div>
      ) : null}
      <div className="submitEventContainer">
        <Button
          className="createEventSubmitButton"
          type="primary"
          loading={isSubmitting}
          onClick={onSubmitEvent}
        >
          Submit Event
        </Button>
        <Link to="/admin/events">
          <Button>Cancel</Button>
        </Link>
      </div>
    </div>
  )
}
