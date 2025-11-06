import { generateMockUid } from '@/lib/utils'
import {
  TrainingWithId,
  useAddMemberToSession,
  useRemoveMemberFromSession,
} from '@/services/trainings'
import { Button, Collapse, CollapseProps, Input, notification } from 'antd'
import { CircleMinus, LoaderCircle } from 'lucide-react'
import { FormEvent, useState } from 'react'

type EditSignupsProps = {
  training: TrainingWithId
}

export default function EditSignups({ training }: EditSignupsProps) {
  const sortedSessions = Object.values(training.sessions).sort(
    (a, b) => a.position - b.position
  )

  const items: CollapseProps['items'] = sortedSessions.map((session) => ({
    key: session.sessionId,
    label: session.title,
    children: (
      <MemberList
        trainingId={training.id}
        sessionId={session.sessionId}
        members={session.members}
      />
    ),
    extra: (
      <span>
        {Object.keys(session.members).length} / {session.limit}
      </span>
    ),
  }))

  return (
    <ul className="flex flex-col justify-between items-center mt-2">
      <Collapse items={items} expandIconPosition="end" className="w-full" />
    </ul>
  )
}

function MemberList({
  trainingId,
  sessionId,
  members,
}: {
  trainingId: string
  sessionId: string
  members: { [uid: string]: { name: string; timeAdded: Date } }
}) {
  const [memberName, setMemberName] = useState<string>('')

  const addMemberToSession = useAddMemberToSession()
  const removeMemberFromSession = useRemoveMemberFromSession()

  async function handleAddMember(e: FormEvent) {
    e.preventDefault()

    if (memberName.length < 1) {
      return notification.error({ message: 'Name required' })
    }

    await addMemberToSession.mutateAsync({
      userId: generateMockUid(),
      displayName: memberName,
      trainingId,
      sessionId,
    })
    setMemberName('')
  }

  async function handleRemoveMember(userId: string) {
    await removeMemberFromSession.mutateAsync({
      userId,
      trainingId,
      sessionId,
    })
  }

  return (
    <div>
      <ul className="flex flex-col gap-y-1">
        {Object.entries(members).map(([userId, member]) => (
          <li key={userId} className="flex justify-between items-center">
            <span>{member.name}</span>
            <button
              onClick={() => handleRemoveMember(userId)}
              className="size-4 group"
            >
              {removeMemberFromSession.isPending ? (
                <LoaderCircle className="size-full animate-spin text-blue-500" />
              ) : (
                <CircleMinus className="size-full cursor-pointer text-gray-400 group-hover:text-red-500 transition-colors" />
              )}
            </button>
          </li>
        ))}
      </ul>
      <form className="flex mt-2" onSubmit={handleAddMember}>
        <Input
          value={memberName}
          onChange={(e) => setMemberName(e.target.value)}
        />
        <Button
          htmlType="submit"
          loading={addMemberToSession.isPending}
          className="!border-l-0"
        >
          Add
        </Button>
      </form>
    </div>
  )
}
