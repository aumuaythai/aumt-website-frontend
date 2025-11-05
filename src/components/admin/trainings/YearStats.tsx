import {
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import { Training } from '../../../types'
import './YearStats.css'

interface YearStatsProps {
  trainings: Training[]
}

export default function YearStats({ trainings }: YearStatsProps) {
  const now = new Date()
  const graphData = trainings
    .filter((t) => t.opens < now)
    .map((t) => {
      const total = Object.values(t.sessions).reduce((sum, cur) => {
        return sum + Object.keys(cur.members).length
      }, 0)
      return {
        week: t.title,
        total,
      }
    })

  return (
    <ResponsiveContainer width="100%" height={400}>
      <LineChart data={graphData}>
        <XAxis
          dataKey="week"
          tickFormatter={(tick) => tick.substring(0, 6)}
          domain={['auto', 'auto']}
          name="Week"
        />
        <Tooltip />
        <YAxis />
        <Line dataKey="total" />
      </LineChart>
    </ResponsiveContainer>
  )
}
