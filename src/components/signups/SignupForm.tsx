import { CheckSquareTwoTone } from '@ant-design/icons'
import { Alert, Button, Checkbox, Input, Spin, Tag, Tooltip } from 'antd'
import { CheckboxOptionType } from 'antd/lib/checkbox'
import { CheckboxValueType } from 'antd/lib/checkbox/Group'
import { useCallback, useEffect, useRef, useState } from 'react'
import { removeMemberFromForm, signUserUp } from '../../services/db'
import { AumtTrainingSession } from '../../types'
import { RenderMarkdown } from '../utility/RenderMarkdown'

export interface SignupFormProps {
  title: string
  id: string
  closes: Date
  sessions: Record<string, AumtTrainingSession>
  displayName: string | null
  submittingAsName?: string
  authedUserId: string | null
  notes: string
  openToPublic: boolean
  showNotes: boolean
  onSignupChanged?: () => void
  signupMaxSessions: number
}

const SPOTS_TAG_LIMIT = 5 // Infinity

export default function SignupForm(props: SignupFormProps) {
  const sessionHistory = useRef<string[]>([])
  const prevAuthedUserId = useRef<string | null>(props.authedUserId)

  const [currentSessionIds, setCurrentSessionIds] = useState<string[]>([])
  const [currentFeedback, setCurrentFeedback] = useState<string>('')
  const [currentDisplayName, setCurrentDisplayName] = useState<string>('')
  const [currentMockUid, setCurrentMockUid] = useState<string>('')
  const [errorMessage, setErrorMessage] = useState<string>('')
  const [signedUpOptions, setSignedUpOptions] = useState<string[]>([])
  const [submittingState, setSubmittingState] = useState<boolean>(false)
  const [removingState, setRemovingState] = useState<boolean>(false)

  const checkSignedUp = useCallback(() => {
    if (props.authedUserId) {
      const signedUpSessions: string[] = []
      Object.values(props.sessions).forEach((session) => {
        if (props.authedUserId && session.members[props.authedUserId]) {
          signedUpSessions.push(session.sessionId)
        }
      })
      setSignedUpOptions(signedUpSessions)
      setCurrentSessionIds(signedUpSessions)
    }
  }, [props.authedUserId, props.sessions])

  useEffect(() => {
    checkSignedUp()
  }, [checkSignedUp])

  if (prevAuthedUserId.current === '' && props.authedUserId) {
    checkSignedUp()
  }

  const isAdvancedSelected = () => {
    return currentSessionIds.some((sessionId) => {
      return (
        props.sessions[sessionId]?.title?.toLowerCase().indexOf('advanced') !==
        -1
      )
    })
  }
  const onOptionChange = (e: CheckboxValueType[]) => {
    let ids = e.map((i) => i.toString())
    const newId = ids.find((i) => !currentSessionIds.includes(i))
    if (newId) {
      sessionHistory.current = sessionHistory.current.filter((s) => s !== newId)
      sessionHistory.current.push(newId)
      if (ids.length > props.signupMaxSessions) {
        ids = sessionHistory.current.slice(
          sessionHistory.current.length - props.signupMaxSessions
        )
      }
    }
    setCurrentSessionIds(ids)
    setErrorMessage('')
  }

  const onFeedbackChange = (feedback: string) => {
    setCurrentFeedback(feedback)
  }

  const onDisplayNameChange = (name: string) => {
    setCurrentDisplayName(name)
  }

  const generateMockUid = () => {
    const alphabet = '1234567890qwertyuiopasdfghjklzxcvbnm'
    let uid = 'NONMEMBER'
    for (let i = 0; i < 10; i++) {
      uid += alphabet[Math.floor(Math.random() * alphabet.length)]
    }
    return uid
  }

  const onRemoveClick = () => {
    if (signedUpOptions.length && props.authedUserId) {
      setRemovingState(true)
      removeMemberFromForm(props.authedUserId, props.id, signedUpOptions)
        .then(() => {
          setSignedUpOptions([])
          setCurrentSessionIds([])
          setRemovingState(false)
          setErrorMessage('')

          if (props.onSignupChanged) {
            props.onSignupChanged()
          }
        })
        .catch((err) => {
          setRemovingState(false)
          setErrorMessage('Error removing signup: ' + err.toString())
        })
    }
  }

  const onSubmitClick = () => {
    const selectedSessions = currentSessionIds
    if (selectedSessions.length === 0) {
      setErrorMessage('You must select a session')
      return
    } else if (!props.authedUserId && !currentDisplayName) {
      setErrorMessage('You must provide your name')
      return
    }
    setErrorMessage('')
    setSubmittingState(true)

    const uid = props.authedUserId || currentMockUid || generateMockUid()

    signUserUp(
      uid,
      props.displayName || currentDisplayName,
      new Date(),
      props.id,
      selectedSessions,
      currentFeedback,
      signedUpOptions
    )
      .then(() => {
        setSignedUpOptions(selectedSessions)
        setCurrentMockUid(uid)
        setSubmittingState(false)
        if (props.onSignupChanged) {
          props.onSignupChanged()
        }
      })
      .catch((err) => {
        setSubmittingState(false)
        setErrorMessage('Error signing up: ' + err.toString())
      })
  }

  const getCheckboxGroup = (
    sessions: Record<string, AumtTrainingSession>
  ): CheckboxOptionType[] => {
    return Object.values(sessions)
      .sort((a, b) => a.position - b.position)
      .map((session) => {
        const isFull = session.limit <= Object.keys(session.members).length
        const spotsLeft = Math.max(
          0,
          session.limit - Object.keys(session.members).length
        )
        const label = (
          <span key={session.title} className="my-2.5 inline-block w-full">
            <Tooltip title={isFull ? 'Class full' : ''} placement="left">
              <span className="signupFormSessionTitle">
                {session.title}
                {signedUpOptions.includes(session.sessionId) ? (
                  <CheckSquareTwoTone
                    className="ml-2.5 text-[150%] align-middle"
                    twoToneColor="#52c41a"
                  />
                ) : null}
              </span>
              {spotsLeft <= SPOTS_TAG_LIMIT ? (
                <Tag
                  className="float-right -mr-2"
                  color={
                    spotsLeft === 0
                      ? 'error'
                      : spotsLeft < 10
                      ? 'warning'
                      : 'blue'
                  }
                >
                  {spotsLeft} spots left
                </Tag>
              ) : (
                ''
              )}
            </Tooltip>
          </span>
        )
        return {
          label,
          value: session.sessionId,
          disabled: isFull,
          style: {
            width: '100%',
            marginRight: 0,
            backgroundColor: signedUpOptions.includes(session.sessionId)
              ? '#1ac4a7'
              : isFull
              ? '#f9f9f9'
              : '#dddddd',
            padding: '10px 20px',
            margin: '5px 0',
          },
        }
      })
  }

  return (
    <div>
      <h2 className="formTitle text-xl">{props.title}</h2>
      {props.notes && props.showNotes && (
        <div className="my-5 mx-auto max-[400px] text-left">
          <RenderMarkdown source={props.notes} />
        </div>
      )}
      <div className="optionsContainer">
        <Checkbox.Group
          value={currentSessionIds}
          onChange={onOptionChange}
          options={getCheckboxGroup(props.sessions)}
        ></Checkbox.Group>
      </div>
      {props.authedUserId ? (
        <div className="text-left max-w-[400px] mx-auto my-7">
          <p>Thoughts on last training/feedback?</p>
          <Input.TextArea
            autoSize={{ maxRows: 6 }}
            placeholder="Feedback will be sent anonymously"
            onChange={(e) => onFeedbackChange(e.target.value)}
          />
        </div>
      ) : props.openToPublic ? (
        <div className="text-left max-w-[400px] mx-auto my-7">
          <p>Enter your Full Name</p>
          <Input
            placeholder={'Enter your Full Name'}
            onChange={(e) => onDisplayNameChange(e.target.value)}
          />
        </div>
      ) : (
        ''
      )}
      <div className="max-w-[300px] mx-auto my-1.5">
        {errorMessage && <Alert type="error" message={errorMessage} />}
      </div>
      {isAdvancedSelected() && (
        <Alert
          type="info"
          className="text-justify"
          showIcon
          message="Please make sure you have asked Victor before joining the advanced session and remember to bring a mouthguard - if one of these conditions isn't met we may stop you from training!"
        />
      )}
      {props.submittingAsName && (
        <div className="text-[10px] text-left mb-2.5">
          Submitting as {`${props.submittingAsName}`}
        </div>
      )}
      <Button
        block
        className="!font-joyride"
        type="primary"
        size="large"
        loading={submittingState}
        onClick={onSubmitClick}
      >
        SIGN UP TO CLASS
      </Button>
      {props.authedUserId ? (
        <Button
          disabled={!signedUpOptions.length}
          type="link"
          className="block mt-5"
          onClick={onRemoveClick}
          block
        >
          {removingState ? (
            <span>
              <Spin className="mr-1.5" />{' '}
            </span>
          ) : (
            ''
          )}{' '}
          Remove Signup{signedUpOptions.length > 1 ? 's' : ''}
        </Button>
      ) : (
        ''
      )}
    </div>
  )
}
