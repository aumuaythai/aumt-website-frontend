import { ExclamationCircleOutlined } from '@ant-design/icons'
import { Button, Divider, Modal, notification, Spin } from 'antd'
import { useState } from 'react'
import { Link } from 'react-router'
import { removeTraining } from '../../../services/db'
import { AumtWeeklyTraining } from '../../../types'

interface ManageTrainingsProps {
  onTrainingClick: (trainingId: string) => void
  trainings: AumtWeeklyTraining[]
  loadingTrainings: boolean
}

export default function ManageTrainings(props: ManageTrainingsProps) {
  const [removingTraining, setRemovingTraining] = useState<{
    [trainingId: string]: boolean
  }>({})

  function confirmDeleteTraining(title: string, trainingId: string) {
    Modal.confirm({
      title: `Delete ${title}?`,
      icon: <ExclamationCircleOutlined />,
      content: 'This will remove all signup data from the database.',
      okText: 'Delete',
      okType: 'danger',
      cancelText: 'Cancel',
      maskClosable: true,
      onOk: () => handleRemoveTraining(trainingId),
      onCancel: () => {},
    })
  }
  function handleRemoveTraining(trainingId: string) {
    setRemovingTraining((prev) => ({ ...prev, [trainingId]: true }))
    removeTraining(trainingId)
      .then(() => {
        setRemovingTraining((prev) => ({ ...prev, [trainingId]: false }))
      })
      .catch((err) => {
        notification.open({
          message: 'Error removing training: ' + err.toString(),
        })
        setRemovingTraining((prev) => ({ ...prev, [trainingId]: false }))
      })
  }

  if (props.loadingTrainings) {
    return (
      <div>
        Loading Trainings <Spin />
      </div>
    )
  }

  if (!props.trainings.length) {
    return <p>No Training Forms in DB</p>
  }

  return (
    <ul className="mt-6 overflow-y-auto max-h-96 md:max-h-none">
      {props.trainings.map((training) => (
        <>
          <button
            key={training.trainingId}
            className="flex items-center justify-between w-full hover:cursor-pointer group py-4"
            onClick={(e) => props.onTrainingClick(training.trainingId)}
          >
            <h4 className="group-hover:!text-gray-600 transition-colors !mb-0">
              {training.title}
            </h4>
            <div>
              <Link
                to={`/admin/trainings/${training.trainingId}`}
                className="mr-2"
              >
                <Button className="manageTrainingOptionButton">Edit</Button>
              </Link>
              <Button
                loading={removingTraining[training.trainingId]}
                onClick={(e) =>
                  confirmDeleteTraining(training.title, training.trainingId)
                }
                type="primary"
                danger
              >
                Remove
              </Button>
            </div>
          </button>
          <Divider className="!my-0" />
        </>
      ))}
    </ul>
  )
}
