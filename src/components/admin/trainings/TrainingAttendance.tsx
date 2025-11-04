import {
  getTrainingAttendance,
  setMemberTrainingAttendance,
} from '@/services/db'
import { useTraining } from '@/services/trainings'
import { useMutation, useQuery } from '@tanstack/react-query'
import { Button, Select, Spin } from 'antd'
import { useState } from 'react'
import { Link, useParams } from 'react-router'

export default function TrainingAttendance() {
  const [sessionId, setSessionId] = useState<string | undefined>(undefined)
  const [attendance, setAttendance] = useState<string[] | undefined>(undefined)

  const { trainingId } = useParams()

  const { data: training, isPending: isLoadingTraining } = useTraining(
    trainingId!
  )

  const { data: trainingAttendance } = useQuery({
    queryKey: ['trainingAttendance', trainingId, sessionId],
    queryFn: () => getTrainingAttendance(trainingId!, sessionId!),
    enabled: !!trainingId && !!sessionId,
  })

  const { mutate: updateAttendance, variables } = useMutation({
    mutationFn: ({
      memberId,
      updatedMembers,
    }: {
      memberId: string
      updatedMembers: string[]
    }) =>
      setMemberTrainingAttendance(
        trainingId!,
        sessionId!,
        memberId,
        updatedMembers
      ),
  })

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

  if (trainingAttendance && !attendance) {
    setAttendance(trainingAttendance)
  }

  if (!sessionId) {
    const sortedSessions = Object.values(training.sessions).sort(
      (a, b) => a.position - b.position
    )
    setSessionId(sortedSessions[0].sessionId)
  }

  const session = sessionId ? training.sessions[sessionId] : undefined

  function handleMemberClick(memberId: string) {
    if (!attendance || !sessionId || !trainingId) {
      return
    }

    const updatedMembers = [...attendance]
    if (attendance.includes(memberId)) {
      updatedMembers.splice(updatedMembers.indexOf(memberId), 1)
    } else {
      updatedMembers.push(memberId)
    }

    setAttendance(updatedMembers)
    updateAttendance({ memberId, updatedMembers })
  }

  return (
    <div className="flex-1 pt-[30px]">
      <Link to={`/admin`}>
        <Button className="backButton">Back</Button>
      </Link>
      {training && (
        <div>
          <h2>{training.title} Attendance</h2>
          <Select
            className="w-full p-2.5 my-2.5 border border-gray-300 rounded-sm text-base bg-gray-100 text-black font-medium"
            value={sessionId}
            onChange={(value) => setSessionId(value)}
          >
            {Object.values(training.sessions)
              .sort((a, b) => a.position - b.position)
              .map((session) => (
                <Select.Option
                  key={session.sessionId}
                  value={session.sessionId}
                >
                  {session.title}
                </Select.Option>
              ))}
          </Select>

          {session && (
            <div className="memberCheckboxContainer">
              {Object.keys(session.members)
                .sort((a, b) => {
                  const aLastName = session.members[a].name.split(' ').pop()
                  const bLastName = session.members[b].name.split(' ').pop()

                  return (
                    aLastName
                      ?.toLowerCase()
                      .localeCompare(bLastName?.toLowerCase() || '') || 0
                  )
                })
                .map((key, index) => {
                  const checked = attendance && attendance.includes(key)
                  return (
                    <div
                      key={index}
                      className="grow shrink-0 basis-1/2 box-border p-[5px]"
                    >
                      <input
                        type="checkbox"
                        id={session.members[key].name}
                        onChange={() => {
                          handleMemberClick(key)
                        }}
                        checked={checked}
                        className="scale-200"
                      />
                      <label
                        htmlFor={session.members[key].name}
                        className="text-xl pl-5"
                      >
                        {session.members[key].name}
                      </label>
                    </div>
                  )
                })}
            </div>
          )}

          <div className="pt-2.5 text-xl">
            {session && (
              <p>
                {attendance?.length} / {Object.keys(session.members).length}{' '}
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
