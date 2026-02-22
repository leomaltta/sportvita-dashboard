

'use client'

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts'
import { ChartDataPoint } from '@/types'

interface BMIChartProps {
  data: ChartDataPoint[]
}

export default function BMIChart({ data }: BMIChartProps) {
  return (
    <ResponsiveContainer width="100%" height={400}>
      <BarChart
        data={data}
        margin={{
          top: 20,
          right: 30,
          left: 20,
          bottom: 5,
        }}
      >
        <CartesianGrid strokeDasharray="3 3" className="stroke-gray-200 dark:stroke-gray-700" />
        <XAxis
          dataKey="name"
          className="text-sm"
          tick={{ fill: 'currentColor' }}
        />
        <YAxis
          className="text-sm"
          tick={{ fill: 'currentColor' }}
          label={{
            value: 'IMC',
            angle: -90,
            position: 'insideLeft',
            style: { fill: 'currentColor' },
          }}
        />
        <Tooltip
          contentStyle={{
            backgroundColor: 'hsl(var(--background))',
            border: '1px solid hsl(var(--border))',
            borderRadius: '0.5rem',
          }}
          labelStyle={{ color: 'hsl(var(--foreground))' }}
        />
        <Legend />
        <Bar
          dataKey="Ideal"
          fill="#ABEE7C"
          name="IMC Ideal"
          radius={[8, 8, 0, 0]}
        />
        <Bar
          dataKey="Atual"
          fill="hsl(var(--primary))"
          name="IMC Atual"
          radius={[8, 8, 0, 0]}
        />
      </BarChart>
    </ResponsiveContainer>
  )
}