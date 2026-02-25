'use client'

import {
  Bar,
  CartesianGrid,
  ComposedChart,
  Legend,
  Line,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'

interface ComparisonPoint {
  sub: string
  imcMedio: number
  caloriasHora: number
  taxaNormal: number
}

interface SportSubcategoryComparisonChartProps {
  data: ComparisonPoint[]
}

interface CustomTooltipProps {
  active?: boolean
  label?: string | number
  payload?: Array<{
    name?: string
    dataKey?: string
    value?: number | string
    color?: string
  }>
}

function CustomTooltip({ active, payload, label }: CustomTooltipProps) {
  if (!active || !payload?.length) return null

  return (
    <div className="min-w-[190px] rounded-lg border bg-background/95 p-3 shadow-lg backdrop-blur">
      <p className="text-xs font-medium text-muted-foreground">Sub-{label}</p>
      <div className="mt-2 space-y-1.5 text-sm">
        {payload.map((item) => (
          <p key={`${item.name}`} className="flex items-center justify-between gap-2">
            <span className="inline-flex items-center gap-1.5">
              <span
                className="h-2 w-2 rounded-full"
                style={{ backgroundColor: item.color as string }}
              />
              {item.name}
            </span>
            <span className="font-semibold">
              {typeof item.value === 'number'
                ? item.dataKey === 'taxaNormal'
                  ? `${item.value.toFixed(1)}%`
                  : item.value.toFixed(2)
                : item.value}
            </span>
          </p>
        ))}
      </div>
    </div>
  )
}

export default function SportSubcategoryComparisonChart({
  data,
}: SportSubcategoryComparisonChartProps) {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <ComposedChart
        data={data}
        margin={{ top: 30, right: 18, left: 10, bottom: 10 }}
      >
        <CartesianGrid
          stroke="hsl(var(--border))"
          strokeDasharray="4 4"
          strokeOpacity={0.55}
          vertical={false}
        />
        <XAxis
          dataKey="sub"
          axisLine={false}
          tickLine={false}
          tickMargin={10}
          tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }}
        />
        <YAxis
          yAxisId="left"
          axisLine={false}
          tickLine={false}
          tickMargin={8}
          tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }}
        />
        <YAxis
          yAxisId="right"
          orientation="right"
          domain={[0, 100]}
          axisLine={false}
          tickLine={false}
          tickMargin={8}
          tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }}
          tickFormatter={(value) => `${value}%`}
        />
        <Tooltip
          content={<CustomTooltip />}
          cursor={{ fill: 'hsl(var(--accent) / 0.28)' }}
        />
        <Legend
          verticalAlign="top"
          align="right"
          iconType="circle"
          iconSize={8}
          wrapperStyle={{
            fontSize: '12px',
            color: 'hsl(var(--muted-foreground))',
            paddingBottom: '8px',
          }}
        />
        <Bar
          yAxisId="left"
          dataKey="imcMedio"
          name="IMC médio"
          fill="hsl(var(--darkblue))"
          radius={[8, 8, 0, 0]}
          maxBarSize={34}
          animationDuration={900}
        />
        <Bar
          yAxisId="left"
          dataKey="caloriasHora"
          name="Calorias/h"
          fill="hsl(var(--lightgreen))"
          radius={[8, 8, 0, 0]}
          maxBarSize={34}
          animationDuration={1050}
        />
        <Line
          yAxisId="right"
          type="monotone"
          dataKey="taxaNormal"
          name="% em faixa saudável"
          stroke="#f59e0b"
          strokeWidth={2.6}
          dot={{ r: 0 }}
          activeDot={{ r: 4, strokeWidth: 2, fill: 'hsl(var(--background))' }}
          animationDuration={1200}
          animationEasing="ease-out"
        />
      </ComposedChart>
    </ResponsiveContainer>
  )
}
