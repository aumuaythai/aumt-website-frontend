import { useDeleteTraining, useTrainings } from '@/services/trainings'
import { PlusOutlined } from '@ant-design/icons'
import { Button, Select, Spin } from 'antd'
import { useState } from 'react'
import { Link } from 'react-router'
import EditSignups from './EditSignups'
import YearStats from './YearStats'

export default function TrainingDashboard() {
  const [selectedTrainingId, setSelectedTrainingId] = useState<string | null>(
    null
  )

  const { data: trainings, isPending: isLoadingTrainings } = useTrainings()
  const removeTraining = useDeleteTraining()

  if (!trainings) {
    return (
      <div>
        Loading trainings
        <Spin />
      </div>
    )
  }

  const sortedTrainings = trainings
    .sort((a, b) => {
      return a.closes < b.closes ? 1 : -1
    })
    .slice()

  if (selectedTrainingId === null && trainings) {
    setSelectedTrainingId(sortedTrainings[0].id)
  }

  const selectedTraining = trainings.find((t) => t.id === selectedTrainingId)

  function handleTrainingClick(trainingId: string) {
    setSelectedTrainingId(trainingId)
  }

  function handleRemoveTraining() {
    if (!selectedTrainingId) {
      return
    }

    removeTraining.mutate(selectedTrainingId)
  }

  return (
    <div className="p-4 flex-1 w-full">
      <div className="flex flex-col-reverse lg:flex-row gap-y-2 lg:gap-y-0 items-center justify-between">
        <div className="flex items-center gap-x-2 w-full">
          <Select
            value={selectedTrainingId}
            options={sortedTrainings.map((training) => ({
              label: training.title,
              value: training.id,
            }))}
            className="lg:w-72 w-full"
            onChange={(value) => handleTrainingClick(value as string)}
          />
          {selectedTraining && (
            <>
              <Link to={`/admin/trainings/${selectedTraining.id}`}>
                <Button>Edit</Button>
              </Link>
              <Button
                danger
                loading={removeTraining.isPending}
                onClick={handleRemoveTraining}
              >
                Remove
              </Button>
              <Link to={`/admin/trainings/${selectedTraining.id}/attendance`}>
                <Button type="primary" ghost>
                  Attendance
                </Button>
              </Link>
            </>
          )}
        </div>

        <Link to="/admin/trainings/create" className="w-full lg:w-auto">
          <Button icon={<PlusOutlined />} className="w-full lg:w-auto">
            Create Training
          </Button>
        </Link>
      </div>

      <div className="mt-6">
        <div className="flex flex-col flex-1/3">
          <h2 className="text-xl">Edit Signups</h2>
          {selectedTraining ? (
            <EditSignups training={selectedTraining} />
          ) : (
            <p>No Form Selected</p>
          )}
        </div>

        <div className="mt-8 w-full">
          <h2 className="text-xl">Yearly Stats</h2>
          {/* <YearStats trainings={sortedTrainings.slice().reverse()} /> */}
        </div>
      </div>
    </div>
  )
}
