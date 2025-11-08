import { useTrainings } from '@/services/trainings'
import { Divider, Spin } from 'antd'

export default function Feedback() {
  const { data: trainings, isPending: isLoadingTrainings } = useTrainings()

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
            <div key={form.id}>
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
