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
  Atual: number
}

interface LineImcComparisonChartDynamicProps {
  data: ChartDataItem[]
}

interface CustomTooltipProps {
  active?: boolean
  label?: string
  payload?: Array<{
    dataKey?: string
    value?: number | string
  }>
}

function CustomTooltip({ active, payload, label }: CustomTooltipProps) {
  if (!active || !payload?.length) return null

  const ideal = payload.find((item) => item.dataKey === 'Ideal')?.value
  const atual = payload.find((item) => item.dataKey === 'Atual')?.value

  return (
    <div className="min-w-[180px] rounded-lg border bg-background/95 p-3 shadow-lg backdrop-blur">
      <p className="text-xs font-medium text-muted-foreground">{label}</p>
      <div className="mt-2 space-y-1.5">
        <p className="flex items-center justify-between gap-2 text-sm">
          <span className="inline-flex items-center gap-1.5">
            <span
              className="h-2 w-2 rounded-full"
              style={{ backgroundColor: 'hsl(var(--lightgreen))' }}
            />
            IMC ideal
          </span>
          <span className="font-semibold">
            {typeof ideal === 'number' ? ideal.toFixed(2) : '-'}
          </span>
        </p>
        <p className="flex items-center justify-between gap-2 text-sm">
          <span className="inline-flex items-center gap-1.5">
            <span
              className="h-2 w-2 rounded-full"
              style={{ backgroundColor: 'hsl(var(--darkblue))' }}
            />
            IMC atual
          </span>
          <span className="font-semibold">
            {typeof atual === 'number' ? atual.toFixed(2) : '-'}
          </span>
        </p>
      </div>
    </div>
  )
}

export default function LineImcComparisonChartDynamic({
  data,
}: LineImcComparisonChartDynamicProps) {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <LineChart
        width={500}
        height={300}
        data={data}
        margin={{
          top: 12,
          right: 20,
          left: 4,
          bottom: 10,
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
          tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }}
        />
        <YAxis
          axisLine={false}
          tickLine={false}
          tickMargin={8}
          tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }}
          tickFormatter={(value) => Number(value).toFixed(1)}
        />
        <Tooltip content={<CustomTooltip />} cursor={{ stroke: 'hsl(var(--border))' }} />
        <Legend
          verticalAlign="top"
          align="right"
          iconType="circle"
          iconSize={8}
          wrapperStyle={{ fontSize: '12px', color: 'hsl(var(--muted-foreground))' }}
        />
        <Line
          type="monotone"
          dataKey="Ideal"
          stroke="hsl(var(--lightgreen))"
          strokeWidth={2.5}
          strokeDasharray="7 6"
          dot={{ r: 0 }}
          activeDot={{ r: 4, strokeWidth: 2, fill: 'hsl(var(--background))' }}
          animationDuration={900}
          animationEasing="ease-out"
        />
        <Line
          type="monotone"
          dataKey="Atual"
          stroke="hsl(var(--darkblue))"
          strokeWidth={3}
          dot={{ r: 0 }}
          activeDot={{ r: 5, strokeWidth: 2, fill: 'hsl(var(--background))' }}
          animationDuration={1100}
          animationEasing="ease-out"
        />
      </LineChart>
    </ResponsiveContainer>
  )
}
