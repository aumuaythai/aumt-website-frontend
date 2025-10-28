import { Divider, Spin } from 'antd'
import { useEffect } from 'react'
import { AumtWeeklyTraining } from '../../../types'
import AdminStore from '../AdminStore'
import './Feedback.css'

interface FeedbackProps {
  forms: AumtWeeklyTraining[]
}

export default function Feedback(props: FeedbackProps) {
  useEffect(() => {
    AdminStore.requestTrainings()
  }, [])

  const loadingForms = props.forms.length === 0

  if (loadingForms) {
    return (
      <div className="retrievingFeedbackText">
        Retrieving feedback <Spin />
      </div>
    )
  }

  const sortedForms = props.forms.slice().sort((a, b) => {
    return a.closes < b.closes ? 1 : -1
  })

  return (
    <div className="allFeedbackContainer">
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
      <div className="clearBoth"></div>
    </div>
  )
}
