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

export default function SportSubcategoryComparisonChart({
  data,
}: SportSubcategoryComparisonChartProps) {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <ComposedChart
        data={data}
        margin={{ top: 16, right: 18, left: 10, bottom: 8 }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="sub" />
        <YAxis yAxisId="left" />
        <YAxis yAxisId="right" orientation="right" domain={[0, 100]} />
        <Tooltip
          contentStyle={{ backgroundColor: 'hsl(var(--primary-foreground))' }}
        />
        <Legend />
        <Bar
          yAxisId="left"
          dataKey="imcMedio"
          name="IMC médio"
          fill="hsl(var(--darkblue))"
          radius={[6, 6, 0, 0]}
        />
        <Bar
          yAxisId="left"
          dataKey="caloriasHora"
          name="Calorias/h"
          fill="hsl(var(--lightgreen))"
          radius={[6, 6, 0, 0]}
        />
        <Line
          yAxisId="right"
          type="monotone"
          dataKey="taxaNormal"
          name="% em faixa normal"
          stroke="#f59e0b"
          strokeWidth={2}
          dot={{ r: 3 }}
        />
      </ComposedChart>
    </ResponsiveContainer>
  )
}

