import { DeleteOutlined, EditOutlined, PlusOutlined } from '@ant-design/icons'
import { useQuery } from '@tanstack/react-query'
import { Button, Select, Spin } from 'antd'
import { useState } from 'react'
import { Link } from 'react-router'
import { getAllForms } from '../../../services/db'
import EditSignups from './EditSignups'
import ManageTrainings from './ManageTrainings'
import YearStats from './YearStats'

export default function TrainingDashboard() {
  const [selectedTrainingId, setSelectedTrainingId] = useState<string | null>(
    null
  )

  const { data: trainings, isPending: isLoadingTrainings } = useQuery({
    queryKey: ['trainings'],
    queryFn: () => getAllForms(),
  })

  if (selectedTrainingId === null && trainings) {
    setSelectedTrainingId(trainings[0].trainingId)
  }

  if (!trainings) {
    return (
      <div>
        Loading trainings
        <Spin />
      </div>
    )
  }

  const selectedTraining = trainings.find(
    (t) => t.trainingId === selectedTrainingId
  )

  const sortedTrainings = trainings
    .sort((a, b) => {
      return a.closes < b.closes ? 1 : -1
    })
    .slice()

  function handleTrainingClick(trainingId: string) {
    setSelectedTrainingId(trainingId)
  }

  return (
    <div className="p-4 h-full flex-1">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-x-2">
          <Select
            value={selectedTrainingId}
            options={trainings.map((training) => ({
              label: training.title,
              value: training.trainingId,
            }))}
            className="w-72"
            onChange={(value) => handleTrainingClick(value as string)}
          />
          {selectedTraining && (
            <>
              <Link to={`/admin/trainings/${selectedTraining.trainingId}`}>
                <Button>Edit</Button>
              </Link>
              <Button danger>Remove</Button>
              <Link
                to={`/admin/trainings/${selectedTraining.trainingId}/attendance`}
              >
                <Button type="primary" ghost>
                  Attendance
                </Button>
              </Link>
            </>
          )}
        </div>

        <Link to="/admin/trainings/create">
          <Button type="primary" shape="round" icon={<PlusOutlined />}>
            Create Training
          </Button>
        </Link>
      </div>

      <div className="flex flex-col md:flex-row mt-4">
        <div className="flex flex-col flex-1/3">
          <h2 className="text-xl">Edit Signups</h2>
          {selectedTraining ? (
            <EditSignups training={selectedTraining} />
          ) : (
            <p>No Form Selected</p>
          )}
        </div>

        <div className="flex flex-col flex-2/3">
          <h2 className="text-xl">Yearly Stats</h2>
          <YearStats trainings={sortedTrainings.slice().reverse()} />
        </div>
      </div>
    </div>
  )
}
