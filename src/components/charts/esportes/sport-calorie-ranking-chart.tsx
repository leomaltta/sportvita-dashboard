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
        margin={{ top: 8, right: 18, left: 8, bottom: 8 }}
      >
        <CartesianGrid
          stroke="hsl(var(--border))"
          strokeDasharray="4 4"
          strokeOpacity={0.55}
          horizontal={false}
        />
        <XAxis
          type="number"
          axisLine={false}
          tickLine={false}
          tickMargin={8}
          tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }}
        />
        <YAxis
          dataKey="sportName"
          type="category"
          width={94}
          axisLine={false}
          tickLine={false}
          tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }}
        />
        <Tooltip
          contentStyle={{
            backgroundColor: 'hsl(var(--background) / 0.96)',
            border: '1px solid hsl(var(--border))',
            borderRadius: '0.5rem',
            boxShadow: '0 8px 22px hsl(var(--foreground) / 0.08)',
            color: 'hsl(var(--foreground))',
          }}
          labelStyle={{ color: 'hsl(var(--foreground))' }}
          itemStyle={{ color: 'hsl(var(--foreground))' }}
          formatter={(value) =>
            typeof value === 'number' ? `${value.toFixed(0)} kcal/h` : value
          }
          cursor={{ fill: 'hsl(var(--accent) / 0.28)' }}
        />
        <Bar
          dataKey="calories"
          name="kcal/h"
          radius={[0, 8, 8, 0]}
          barSize={22}
          animationDuration={1000}
        >
          {data.map((entry) => (
            <Cell
              key={entry.sportName}
              fill={
                entry.sportName === highlightSportName
                  ? 'hsl(var(--darkblue))'
                  : 'hsl(var(--muted-foreground) / 0.35)'
              }
            />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  )
}
