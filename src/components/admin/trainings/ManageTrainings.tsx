import { TrainingWithId, useDeleteTraining } from '@/services/trainings'
import { ExclamationCircleOutlined } from '@ant-design/icons'
import { Button, Divider, Modal, Spin } from 'antd'
import { Link } from 'react-router'

interface ManageTrainingsProps {
  onTrainingClick: (trainingId: string) => void
  trainings: TrainingWithId[]
  loadingTrainings: boolean
}

export default function ManageTrainings(props: ManageTrainingsProps) {
  const removeTraining = useDeleteTraining()

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
    removeTraining.mutate(trainingId)
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
    <ul className="overflow-y-auto max-h-96 md:max-h-none mt-4">
      {props.trainings.map((training) => (
        <>
          <button
            key={training.id}
            className="flex items-center justify-between w-full hover:cursor-pointer group"
            onClick={(e) => props.onTrainingClick(training.id)}
          >
            <h4 className="group-hover:!text-gray-600 transition-colors !mb-0">
              {training.title}
            </h4>
            <div>
              <Link to={`/admin/trainings/${training.id}`} className="mr-2">
                <Button className="manageTrainingOptionButton">Edit</Button>
              </Link>
              <Button
                loading={removeTraining.isPending}
                onClick={(e) =>
                  confirmDeleteTraining(training.title, training.id)
                }
                type="primary"
                danger
              >
                Remove
              </Button>
            </div>
          </button>
          <Divider className="!my-4" />
        </>
      ))}
    </ul>
  )
}
