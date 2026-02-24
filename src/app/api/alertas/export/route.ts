import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/[...nextauth]/options'
import { filterAlerts, getAlertData, parseMultiParam } from '@/lib/alerts'

export async function GET(request: Request) {
  const session = await getServerSession(authOptions)
  if (!session || session.user.role !== 'admin') {
    return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
  }

  const { searchParams } = new URL(request.url)
  const selectedSports = parseMultiParam(searchParams.get('esporte'))
  const selectedSubs = parseMultiParam(searchParams.get('sub'))
  const selectedSeverities = parseMultiParam(searchParams.get('severidade'))

  const allAlerts = await getAlertData()
  const filteredAlerts = filterAlerts(allAlerts, {
    sports: selectedSports,
    subcategories: selectedSubs,
    severities: selectedSeverities,
  })

  const header = [
    'Severidade',
    'Esporte',
    'Subcategoria',
    '% Fora',
    'IMC Médio',
    'IMC Ideal',
    'Gap IMC',
    'Taxa Normal',
    'Total Estudantes',
    'Recomendação',
  ]

  const rows = filteredAlerts.map((alert) => [
    alert.severity,
    alert.sportDisplayName,
    alert.subCategory,
    `${alert.outOfRangeRate.toFixed(1)}%`,
    alert.avgBmi.toFixed(2),
    alert.idealBmi.toFixed(2),
    alert.bmiGap.toFixed(2),
    `${alert.normalRate.toFixed(1)}%`,
    String(alert.studentsCount),
    alert.recommendation.replaceAll('"', '""'),
  ])

  const csvBody = [header, ...rows]
    .map((cols) => cols.map((col) => `"${col}"`).join(','))
    .join('\n')

  const csv = `\uFEFF${csvBody}`
  const timestamp = new Date().toISOString().slice(0, 19).replaceAll(':', '-')

  return new NextResponse(csv, {
    status: 200,
    headers: {
      'Content-Type': 'text/csv; charset=utf-8',
      'Content-Disposition': `attachment; filename="alertas-${timestamp}.csv"`,
    },
  })
}
