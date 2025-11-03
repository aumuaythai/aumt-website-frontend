import {
  ArrowLeftOutlined,
  CalendarOutlined,
  ClockCircleOutlined,
  FacebookOutlined,
  HomeOutlined,
} from '@ant-design/icons'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { Button, Divider, notification, Result, Spin } from 'antd'
import moment from 'moment'
import { Link, useParams } from 'react-router'
import { useAuth } from '../../context/AuthProvider'
import {
  getEventById,
  removeMemberFromEvent,
  signUpToEvent,
} from '../../services/db'
import { AumtCampSignupData, AumtEvent, AumtEventSignupData } from '../../types'
import { RenderMarkdown } from '../utility/RenderMarkdown'
import { CampSignupForm } from './CampSignupForm'

export default function Event() {
  const { eventId } = useParams()

  const { data: event, isPending } = useQuery({
    queryKey: ['event', eventId],
    queryFn: () => getEventById(eventId!),
    enabled: !!eventId,
  })

  if (isPending) {
    return (
      <div>
        Retrieving event <Spin />
      </div>
    )
  }

  if (!event) {
    return <div>Event not found</div>
  }

  return (
    <div className="max-w-[500px] text-center mx-auto p-[30px]">
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
          <CalendarOutlined /> {event.date.toLocaleDateString()}
        </div>
        <div className="p-[5px]">
          <ClockCircleOutlined /> {event.date.toLocaleTimeString()}
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
        {event.fbLink ? (
          <div className="p-[5px]">
            <FacebookOutlined />{' '}
            <a href={event.fbLink} target="_blank" rel="noopener noreferrer">
              {event.fbLink}
            </a>
          </div>
        ) : null}
      </div>
      <Divider />
      <div className="text-left">
        <RenderMarkdown source={event.description}></RenderMarkdown>
      </div>
      <Divider />
      <Signups event={event} />
    </div>
  )
}

function Signups({ event }: { event: AumtEvent }) {
  const { authedUser, authedUserId } = useAuth()
  const queryClient = useQueryClient()

  const removeMember = useMutation({
    mutationFn: (uid: string) => removeMemberFromEvent(uid, event.id),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['events'] })
    },
    onError: (error) => {
      notification.error({
        message: 'Error withdrawing from event: ' + error.toString(),
      })
    },
  })

  const signup = useMutation({
    mutationFn: ({
      uid,
      signupData,
      isWaitlist,
    }: {
      uid: string
      signupData: AumtEventSignupData
      isWaitlist: boolean
    }) => signUpToEvent(event.id, uid, signupData, isWaitlist),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['events'] })
    },
    onError: (error) => {
      notification.error({
        message: 'Error signing up to event: ' + error.toString(),
      })
    },
  })

  function onSignupFormSubmit(
    isWaitlist: boolean,
    signupData?: AumtCampSignupData
  ) {
    const displayName = authedUser
      ? `${authedUser.firstName} ${authedUser.lastName}`
      : signupData?.name
    const email = authedUser ? authedUser.email : signupData?.email

    signup.mutate({
      uid: authedUserId,
      signupData: {
        ...signupData,
        displayName,
        email,
        timeSignedUpMs: new Date().getTime(),
        confirmed: event.signups?.needAdminConfirm ? false : true,
      },
      isWaitlist,
    })
  }

  const isSignedUp = !!event.signups?.members[authedUserId]
  const isOnWaitlist = !!event.signups?.waitlist[authedUserId]
  const { signups } = event

  if (!signups) {
    return null
  }

  function handleWithdrawClick() {
    removeMember.mutate(authedUserId)
  }

  if (isSignedUp) {
    return (
      <div>
        <Result
          status="success"
          title="Thank you for signing up!"
          subTitle={
            !signups.members[authedUserId].confirmed
              ? 'Once the committee recieves your payment, you spot will be fully reserved'
              : signups.needAdminConfirm
              ? 'Our records show you have paid, your spot is confirmed'
              : ''
          }
        ></Result>
        <Button
          type="link"
          loading={removeMember.isPending}
          onClick={handleWithdrawClick}
        >
          Withdraw Signup
        </Button>
      </div>
    )
  }

  function getWaitlistPosition() {
    if (!signups) {
      return null
    }

    const waitlist = Object.keys(signups.waitlist)
    const sortedKeys = waitlist.sort((a, b) => {
      return (
        signups.waitlist[a].timeSignedUpMs - signups.waitlist[b].timeSignedUpMs
      )
    })
    const position = sortedKeys.indexOf(authedUserId) + 1
    return position > 0 ? position : null
  }

  if (isOnWaitlist) {
    return (
      <div>
        <p>You are currently {getWaitlistPosition()} on the event waitlist.</p>
        <p>If a spot frees up the committee will let you know!</p>
      </div>
    )
  }

  if (signups.opens > new Date()) {
    return (
      <div>Signups will open {moment(signups.opens).format('MMMM Do')}</div>
    )
  }

  if (signups.closes < new Date()) {
    return <div>Signups have closed!</div>
  }

  if (!authedUser && !signups.openToNonMembers) {
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

  if (signups.limit && signups.limit <= Object.keys(signups.members).length) {
    return (
      <div>
        <h4>Signups are currently full</h4>
        <p className="text-left">
          Fill out the form below to join the waitlist and the committee will
          message you if a spot opens.
        </p>
        <CampSignupForm
          isCamp={signups.isCamp}
          includeNameAndEmail={!authedUser}
          isWaitlist={true}
          onSubmit={(data) => onSignupFormSubmit(true, data)}
          submitting={signup.isPending}
        ></CampSignupForm>
      </div>
    )
  }

  return (
    <div>
      <h2>Signups</h2>
      {signups.isCamp ? (
        <CampSignupForm
          isCamp={signups.isCamp}
          includeNameAndEmail={!authedUser}
          isWaitlist={false}
          onSubmit={(data) => onSignupFormSubmit(false, data)}
          submitting={signup.isPending}
        ></CampSignupForm>
      ) : (
        <Button
          loading={signup.isPending}
          type="primary"
          block
          className="mt-2.5"
          onClick={(e) => onSignupFormSubmit(false)}
        >
          Reserve a Spot
        </Button>
      )}
    </div>
  )
}
