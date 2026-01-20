import { useMemo } from 'react'
import {
  CartesianGrid,
  Label,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import { Training } from '../../../types'

interface YearStatsProps {
  trainings: Training[]
}

export default function YearStats({ trainings }: YearStatsProps) {
  const graphData = useMemo(() => {
    const now = Date.now()
    return trainings
      .filter((t) => t.opens.toMillis() < now)
      .map((t) => {
        const total = Object.values(t.sessions).reduce((sum, cur) => {
          return sum + Object.keys(cur.members).length
        }, 0)
        return {
          week: t.title,
          total,
        }
      })
  }, [trainings])

  return (
    <div className="overflow-hidden [&_.recharts-surface]:outline-none">
      <ResponsiveContainer width="100%" height={400}>
        <LineChart data={graphData} margin={{ top: 10, right: 10, left: 10 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="week" tick={false}>
            <Label value="Week" position="insideBottom" />
          </XAxis>
          <YAxis>
            <Label value="Total" angle={-90} position="insideLeft" />
          </YAxis>
          <Tooltip
            animationDuration={150}
            wrapperStyle={{ pointerEvents: 'none', zIndex: 1000 }}
            allowEscapeViewBox={{ x: false, y: false }}
          />
          <Line dataKey="total" animationDuration={300} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}
