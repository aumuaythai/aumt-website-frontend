import { PlusOutlined } from '@ant-design/icons'
import { useQuery } from '@tanstack/react-query'
import { Button, Select, Spin } from 'antd'
import { useState } from 'react'
import { Link } from 'react-router'
import { getAllForms } from '../../../services/db'
import { AumtWeeklyTraining } from '../../../types'
import { EditSignups } from './EditSignups'
import ManageTrainings from './ManageTrainings'
import { YearStats } from './YearStats'

interface TrainingDashboardProps {
  forms: AumtWeeklyTraining[]
}

export default function TrainingDashboard(props: TrainingDashboardProps) {
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
    <div className="p-3.5 h-full flex-1">
      <div className="flex items-center justify-between">
        <div>
          <Select
            className="w-64"
            value={selectedTrainingId}
            onChange={(value) => handleTrainingClick(value as string)}
          >
            {trainings.map((training) => (
              <Select.Option
                key={training.trainingId}
                value={training.trainingId}
              >
                {training.title.length > 50 && window.innerWidth < 600
                  ? training.title.slice(0, 47) + '...'
                  : training.title}
              </Select.Option>
            ))}
          </Select>
          {selectedTraining && (
            <Link
              to={`/admin/attendance/${
                selectedTraining ? selectedTraining.trainingId : null
              }`}
              className="ml-2"
            >
              <Button type="primary" size="large">
                Attendance
              </Button>
            </Link>
          )}
        </div>

        <Link to="/admin/createtraining">
          <Button type="default" shape="round" size="large">
            Create Training <PlusOutlined />
          </Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 md:grid-rows-2 h-full mt-6 gap-6">
        <div className="flex flex-col">
          <h2 className="text-xl">
            Manage {sortedTrainings.length || ''} Trainings
          </h2>
          <ManageTrainings
            trainings={sortedTrainings}
            loadingTrainings={isLoadingTrainings}
            onTrainingClick={handleTrainingClick}
          />
        </div>

        <div className="flex flex-col">
          <h2 className="text-xl">Edit Members</h2>
          {isLoadingTrainings ? (
            <div>
              Loading current forms <Spin />
            </div>
          ) : selectedTraining ? (
            <EditSignups form={selectedTraining} />
          ) : (
            <p>No Form Selected</p>
          )}
        </div>

        <div className="md:col-span-2 flex flex-col h-full">
          <h2 className="text-xl">Yearly Stats</h2>
          <YearStats
            forms={sortedTrainings}
            onTrainingClick={handleTrainingClick}
          />
        </div>
      </div>
    </div>
  )
}
