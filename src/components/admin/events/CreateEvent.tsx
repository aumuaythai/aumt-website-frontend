import { ArrowLeftOutlined } from '@ant-design/icons'
import { useQuery } from '@tanstack/react-query'
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
import { useEffect, useRef, useState } from 'react'
import { Link, useParams } from 'react-router'
import z from 'zod'
import { getEventById, submitEvent } from '../../../services/db'
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

  const { eventId } = useParams()
  const hasPopulated = useRef(false)

  const { data: event, isLoading: isLoadingEvent } = useQuery({
    queryKey: ['event', eventId],
    queryFn: () => getEventById(eventId!),
    enabled: !!eventId,
  })

  if (event && !hasPopulated.current) {
    hasPopulated.current = true
    setCurrentId(event.id)
    setCurrentUrlPath(event.urlPath)
    setCurrentTitle(event.title)
    setCurrentDescription(event.description)
    setCurrentPhotoPath(event.photoPath)
    setCurrentDate(event.date)
    setCurrentLocation(event.location)
    setCurrentLocationLink(event.locationLink)
    setCurrentFbLink(event.fbLink)
    setShowEditSignups(!!event.signups)
    setCurrentSignupLimit(event.signups?.limit || 30)
    setCurrentHasLimit(event.signups?.limit === null ? false : true)
    setCurrentSignupOpenDate(event.signups?.opens || new Date())
    setCurrentSignupClosesDate(event.signups?.closes || new Date())
    setCurrentNeedAdminConfirm(event.signups?.needAdminConfirm || false)
    setCurrentOpenToNonMembers(event.signups?.openToNonMembers || false)
    setCurrentIsCamp(event.signups?.isCamp || false)
    setCurrentMembers(event.signups?.members || {})
    setCurrentWaitlist(event.signups?.waitlist || {})
  }

  if (isLoadingEvent) {
    return (
      <div>
        Loading event <Spin />
      </div>
    )
  }

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
    <div className="mt-[30px] mx-auto">
      <h2>
        <Link className="mx-2.5" to="/admin/events">
          <ArrowLeftOutlined />
        </Link>
        Create Event
      </h2>
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
    </div>
  )
}
