import {
  useAddAttendance,
  useAttendance,
  useRemoveAttendance,
} from '@/services/attendance'
import { useTraining } from '@/services/trainings'
import { ArrowLeftOutlined } from '@ant-design/icons'
import { Button, Checkbox, Select, Spin } from 'antd'
import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router'

export default function TrainingAttendance() {
  const [sessionId, setSessionId] = useState<string | undefined>(undefined)

  const { trainingId } = useParams()
  const { data: training, isPending: isLoadingTraining } = useTraining(
    trainingId!
  )
  const { data: attendance } = useAttendance(trainingId!)
  const addAttendance = useAddAttendance()
  const removeAttendance = useRemoveAttendance()

  if (isLoadingTraining) {
    return (
      <div>
        Loading training
        <Spin />
      </div>
    )
  }

  if (!training || !trainingId) {
    return <div>Training not found</div>
  }

  if (!sessionId) {
    const sortedSessions = Object.values(training.sessions).sort(
      (a, b) => a.position - b.position
    )
    setSessionId(sortedSessions[0].sessionId)
  }

  const session = sessionId ? training.sessions[sessionId] : undefined
  const sortedSessions = Object.values(training.sessions).sort(
    (a, b) => a.position - b.position
  )

  function handleMemberClick(checked: boolean, memberId: string) {
    if (!sessionId || !trainingId) {
      return
    }

    if (checked) {
      addAttendance.mutate({ memberId, trainingId, sessionId })
    } else {
      removeAttendance.mutate({ memberId, trainingId, sessionId })
    }
  }

  return (
    <div className="flex-1 p-4">
      <div className="flex items-center gap-x-2">
        <Link to={`/admin`}>
          <ArrowLeftOutlined />
        </Link>
        <h2 className="text-2xl">{training.title} Attendance</h2>
      </div>

      <Select
        value={sessionId}
        size="large"
        className="w-full p-2.5 !my-4 border border-gray-300 rounded-sm text-base bg-gray-100 text-black font-medium"
        onChange={(value) => setSessionId(value)}
      >
        {sortedSessions.map((session) => (
          <Select.Option key={session.sessionId} value={session.sessionId}>
            {session.title}
          </Select.Option>
        ))}
      </Select>

      {sessionId && session && (
        <>
          <div className="flex flex-col gap-y-2">
            {Object.keys(session.members)
              .sort((a, b) => {
                const aLastName = session.members[a].name.split(' ')[0]
                const bLastName = session.members[b].name.split(' ')[0]
                return (
                  aLastName
                    .toLowerCase()
                    .localeCompare(bLastName.toLowerCase() || '') || 0
                )
              })
              .map((memberId) => (
                <Checkbox
                  checked={attendance?.[sessionId]?.includes(memberId)}
                  className="!text-2xl"
                  onChange={(e) => {
                    handleMemberClick(e.target.checked, memberId)
                  }}
                >
                  {session.members[memberId].name}
                </Checkbox>
              ))}
          </div>
          <div className="pt-2.5 text-xl">
            <p>
              {attendance?.[sessionId]?.length} /{' '}
              {Object.keys(session.members).length}{' '}
            </p>
          </div>
        </>
      )}
    </div>
  )
}
