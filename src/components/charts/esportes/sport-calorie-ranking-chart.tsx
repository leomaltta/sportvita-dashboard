'use client'

import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'

interface RankingPoint {
  sportName: string
  calories: number
}

interface SportCalorieRankingChartProps {
  data: RankingPoint[]
  highlightSportName: string
}

export default function SportCalorieRankingChart({
  data,
  highlightSportName,
}: SportCalorieRankingChartProps) {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart
        data={data}
        layout="vertical"
        margin={{ top: 8, right: 16, left: 8, bottom: 8 }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis type="number" />
        <YAxis dataKey="sportName" type="category" width={90} />
        <Tooltip
          contentStyle={{ backgroundColor: 'hsl(var(--primary-foreground))' }}
        />
        <Bar dataKey="calories" name="kcal/h" radius={[0, 6, 6, 0]}>
          {data.map((entry) => (
            <Cell
              key={entry.sportName}
              fill={
                entry.sportName === highlightSportName
                  ? 'hsl(var(--darkblue))'
                  : 'hsl(var(--muted))'
              }
            />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  )
}

