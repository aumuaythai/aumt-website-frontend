import { useAuth } from '@/context/use-auth'
import {
  useAddMemberToEvent,
  useEvent,
  useRemoveMemberFromEvent,
} from '@/services/events'
import {
  ArrowLeftOutlined,
  CalendarOutlined,
  ClockCircleOutlined,
  FacebookOutlined,
  HomeOutlined,
} from '@ant-design/icons'
import { Button, Divider, Result, Spin } from 'antd'
import moment from 'moment'
import { Link, useParams } from 'react-router'
import { Event } from '../../types'
import { RenderMarkdown } from '../utility/RenderMarkdown'
import EventSignupForm from './EventSignupForm'

export default function Event() {
  const { eventId } = useParams()
  const { data: event, isPending: isLoadingEvent } = useEvent(eventId!)

  if (isLoadingEvent) {
    return (
      <div>
        Retrieving event <Spin />
      </div>
    )
  }

  if (!event || !eventId) {
    return <div>Event not found</div>
  }

  return (
    <div className="max-w-2xl text-center mx-auto pt-8 p-6">
      <div className="flex justify-between">
        <p className="text-black !mt-[5px]">
          <Link title="Back to Events" to="/events">
            <ArrowLeftOutlined />
          </Link>
        </p>
        <h2>{event.title}</h2>
        <div className="w-[14px]" />
      </div>
      <div className="text-left mx-auto p-5">
        <div className="p-[5px]">
          <CalendarOutlined /> {event.date.toDate().toLocaleDateString()}
        </div>
        <div className="p-[5px]">
          <ClockCircleOutlined /> {event.date.toDate().toLocaleTimeString()}
        </div>
        <div className="p-[5px]">
          <HomeOutlined />{' '}
          {event.locationLink ? (
            <a
              href={event.locationLink}
              target="_blank"
              rel="noopener noreferrer"
            >
              {event.location}
            </a>
          ) : (
            event.location
          )}
        </div>
        {event.fbLink && (
          <div className="p-[5px]">
            <FacebookOutlined />{' '}
            <a href={event.fbLink} target="_blank" rel="noopener noreferrer">
              {event.fbLink}
            </a>
          </div>
        )}
      </div>
      <Divider />
      <div className="text-left">
        <RenderMarkdown source={event.description}></RenderMarkdown>
      </div>
      <Divider />
      <Signups eventId={eventId} event={event} />
    </div>
  )
}

function Signups({ eventId, event }: { eventId: string; event: Event }) {
  const { user } = useAuth()
  const addMember = useAddMemberToEvent()
  const removeMember = useRemoveMemberFromEvent()

  if (!user?.id) {
    return null
  }

  const isSignedUp = !!event.signups?.members?.[user.id]
  const isOnWaitlist = !!event.signups?.waitlist?.[user.id]
  const { signups } = event

  if (!signups) {
    return null
  }

  function handleSignup() {}

  function handleWithdraw() {}

  if (isSignedUp) {
    return (
      <div>
        <Result
          status="success"
          title="Thank you for signing up!"
          subTitle={
            !signups.members?.[user.id].confirmed
              ? 'Once the committee recieves your payment, you spot will be fully reserved'
              : signups.needAdminConfirm
              ? 'Our records show you have paid, your spot is confirmed'
              : ''
          }
        />
        <Button
          type="link"
          loading={removeMember.isPending}
          onClick={handleWithdraw}
        >
          Withdraw Signup
        </Button>
      </div>
    )
  }

  if (signups.opens?.seconds * 1000 > Date.now()) {
    return (
      <div>Signups will open {moment(signups.opens).format('MMMM Do')}</div>
    )
  }

  if (signups.closes?.seconds * 1000 < Date.now()) {
    return <div>Signups have closed!</div>
  }

  if (!user && !signups.openToNonMembers) {
    return (
      <div>
        <p>
          You must{' '}
          <Link to={`/login?from=/events/${event.urlPath}`}> log in </Link> to
          reserve your place.
        </p>
        <h4>Don't have an account?</h4>
        <p>
          Please create a free <Link to={`/join`}>account</Link> with us. Once
          you do you can signup to this event.
        </p>
      </div>
    )
  }

  if (
    signups.limit &&
    signups.limit <= Object.keys(signups.members ?? {}).length
  ) {
    return (
      <div>
        <h4>Signups are currently full</h4>
        <p className="text-left">
          Fill out the form below to join the waitlist and the committee will
          message you if a spot opens.
        </p>
        <EventSignupForm eventId={eventId} />
      </div>
    )
  }

  return (
    <div>
      <h2>Signups</h2>
      {signups.isCamp ? (
        <EventSignupForm eventId={eventId} />
      ) : (
        <Button
          loading={addMember.isPending}
          type="primary"
          block
          className="mt-2.5"
          onClick={handleSignup}
        >
          Reserve a Spot
        </Button>
      )}
    </div>
  )
}
