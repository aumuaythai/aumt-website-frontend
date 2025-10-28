import { ExclamationCircleOutlined } from '@ant-design/icons'
import { Alert, Button, Divider, Modal, notification, Spin } from 'antd'
import { useState } from 'react'
import { Link } from 'react-router'
import { removeTraining } from '../../../services/db'
import { AumtWeeklyTraining } from '../../../types'

interface ManageTrainingsProps {
  onTrainingClick: (trainingId: string) => void
  trainings: AumtWeeklyTraining[]
  loadingTrainings: boolean
}

interface ManageTrainingsState {
  errorText: string
  removingTraining: {
    [trainingId: string]: boolean
  }
}

export default function ManageTrainings(props: ManageTrainingsProps) {
  const [errorText, setErrorText] = useState('')
  const [removingTraining, setRemovingTraining] = useState<{
    [trainingId: string]: boolean
  }>({})

  function confirmDeleteTraiing(title: string, trainingId: string) {
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

  if (errorText) {
    return <Alert type="error" message={errorText}></Alert>
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
        <li key={training.trainingId}>
          <div className="flex flex-1 justify-between">
            <h4 onClick={(e) => props.onTrainingClick(training.trainingId)}>
              {training.title}
            </h4>
            <div>
              <Link
                to={`/admin/edittraining/${training.trainingId}`}
                className="mr-2"
              >
                <Button className="manageTrainingOptionButton">Edit</Button>
              </Link>
              <Button
                loading={removingTraining[training.trainingId]}
                onClick={(e) =>
                  confirmDeleteTraiing(training.title, training.trainingId)
                }
                type="primary"
                danger
              >
                Remove
              </Button>
            </div>
          </div>
          <Divider />
        </li>
      ))}
    </ul>
  )
}
