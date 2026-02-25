
'use client'

import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
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
          top: 12,
          right: 18,
          left: 4,
          bottom: 8,
        }}
      >
        <CartesianGrid
          stroke="hsl(var(--border))"
          strokeDasharray="4 4"
          strokeOpacity={0.55}
          vertical={false}
        />
        <XAxis
          dataKey="name"
          axisLine={false}
          tickLine={false}
          tickMargin={10}
          tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }}
        />
        <YAxis
          axisLine={false}
          tickLine={false}
          tickMargin={8}
          tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }}
          label={{
            value: 'IMC',
            angle: -90,
            position: 'insideLeft',
            style: { fill: 'hsl(var(--muted-foreground))', fontSize: 12 },
          }}
        />
        <Tooltip
          contentStyle={{
            backgroundColor: 'hsl(var(--background) / 0.96)',
            border: '1px solid hsl(var(--border))',
            borderRadius: '0.5rem',
            boxShadow: '0 8px 22px hsl(var(--foreground) / 0.08)',
          }}
          labelStyle={{ color: 'hsl(var(--foreground))' }}
          cursor={{ fill: 'hsl(var(--accent) / 0.32)' }}
          formatter={(value) =>
            typeof value === 'number' ? value.toFixed(2) : value
          }
        />
        <Legend
          verticalAlign="top"
          align="right"
          iconType="circle"
          iconSize={8}
          wrapperStyle={{ fontSize: '12px', color: 'hsl(var(--muted-foreground))' }}
        />
        <Bar
          dataKey="Ideal"
          fill="#ABEE7C"
          name="IMC Ideal"
          radius={[8, 8, 0, 0]}
          maxBarSize={40}
          animationDuration={900}
        />
        <Bar
          dataKey="Atual"
          fill="hsl(var(--primary))"
          name="IMC Atual"
          radius={[8, 8, 0, 0]}
          maxBarSize={40}
          animationDuration={1100}
        />
      </BarChart>
    </ResponsiveContainer>
  )
}
