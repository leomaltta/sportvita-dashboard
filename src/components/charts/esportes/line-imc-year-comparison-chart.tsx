'use client'

import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'

interface ChartDataItem {
  name: string
  Ideal: number
  Media: number
}

interface LineImcYearComparisonChartProps {
  data: ChartDataItem[]
}

export default function LineImcYearComparisonChart({
  data,
}: LineImcYearComparisonChartProps) {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <LineChart
        width={500}
        height={300}
        data={data}
        margin={{
          top: 25,
          right: 20,
          left: -5,
          bottom: 30,
        }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip
          contentStyle={{ backgroundColor: 'hsl(var(--primary-foreground))' }}
        />
        <Legend />
        <Line
          type="monotone"
          dataKey="Ideal"
          stroke="hsl(var(--lightgreen))"
          activeDot={{ r: 1 }}
          strokeDasharray="5 5"
          dot={false}
        />
        <Line type="monotone" dataKey="Media" stroke="hsl(var(--darkblue))" />
      </LineChart>
    </ResponsiveContainer>
  )
}
