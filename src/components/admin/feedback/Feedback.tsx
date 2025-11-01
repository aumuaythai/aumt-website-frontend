import { useQuery } from '@tanstack/react-query'
import { Divider, Spin } from 'antd'
import { getAllForms } from '../../../services/db'

export default function Feedback() {
  const { data: trainings, isPending: isLoadingTrainings } = useQuery({
    queryKey: ['trainings'],
    queryFn: getAllForms,
  })

  if (isLoadingTrainings || !trainings) {
    return (
      <div>
        Retrieving feedback <Spin />
      </div>
    )
  }

  const sortedForms = trainings.slice().sort((a, b) => {
    return a.closes < b.closes ? 1 : -1
  })

  return (
    <div className="max-w-2xl mx-auto pt-8">
      <h1 className="text-2xl">Feedback</h1>

      <ul className="mt-6">
        {sortedForms.map((form) => {
          const feedback = form.feedback.reverse()
          return (
            <div key={form.trainingId}>
              <h3 className="text-base">{form.title}</h3>
              {feedback.length ? (
                feedback.map((line, index) => {
                  return <p key={index}>{line}</p>
                })
              ) : (
                <p>No Feedback</p>
              )}
              <Divider />
            </div>
          )
        })}
      </ul>
    </div>
  )
}
