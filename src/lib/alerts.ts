import { classifyBMI } from '@/lib/bmi'
import { IDEAL_BMI } from '@/lib/constants'

export type Severity = 'Crítico' | 'Atenção' | 'Monitorar'

export interface AlertItem {
  sportName: string
  sportDisplayName: string
  sportRoute: string
  subCategory: string
  studentsCount: number
  avgBmi: number
  idealBmi: number
  bmiGap: number
  outOfRangeRate: number
  normalRate: number
  severity: Severity
  recommendation: string
}

export interface AlertFilters {
  sports?: string[]
  subcategories?: string[]
  severities?: string[]
}

export function parseMultiParam(value?: string | null): string[] {
  if (!value) return []
  return value
    .split(',')
    .map((item) => item.trim())
    .filter(Boolean)
}

function getSeverity(outOfRangeRate: number, bmiGap: number): Severity {
  if (outOfRangeRate > 45 || bmiGap > 2) {
    return 'Crítico'
  }

  if (outOfRangeRate >= 30 || bmiGap >= 1) {
    return 'Atenção'
  }

  return 'Monitorar'
}

function getRecommendation(severity: Severity, outOfRangeRate: number): string {
  if (severity === 'Crítico') {
    return 'Reforçar acompanhamento semanal e alinhar plano com professor e coordenação.'
  }

  if (severity === 'Atenção') {
    return 'Monitorar evolução quinzenal e ajustar carga/rotina de acompanhamento.'
  }

  if (outOfRangeRate > 0) {
    return 'Manter monitoramento mensal para prevenir regressões.'
  }

  return 'Cenário estável. Manter rotina atual de monitoramento.'
}

function getSeveritySortWeight(severity: Severity) {
  if (severity === 'Crítico') return 0
  if (severity === 'Atenção') return 1
  return 2
}

export function getSeverityClassName(severity: Severity) {
  if (severity === 'Crítico') {
    return 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300'
  }

  if (severity === 'Atenção') {
    return 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-300'
  }

  return 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300'
}

export function filterAlerts(alerts: AlertItem[], filters: AlertFilters): AlertItem[] {
  const selectedSports = filters.sports ?? []
  const selectedSubs = filters.subcategories ?? []
  const selectedSeverities = filters.severities ?? []

  return alerts.filter((alert) => {
    if (selectedSports.length > 0 && !selectedSports.includes(alert.sportName)) return false
    if (selectedSubs.length > 0 && !selectedSubs.includes(alert.subCategory)) return false
    if (selectedSeverities.length > 0 && !selectedSeverities.includes(alert.severity)) {
      return false
    }
    return true
  })
}

export function buildFilterQuery(filters: AlertFilters): string {
  const params = new URLSearchParams()

  if (filters.sports && filters.sports.length > 0) {
    params.set('esporte', filters.sports.join(','))
  }
  if (filters.subcategories && filters.subcategories.length > 0) {
    params.set('sub', filters.subcategories.join(','))
  }
  if (filters.severities && filters.severities.length > 0) {
    params.set('severidade', filters.severities.join(','))
  }

  return params.toString()
}

export async function getAlertData(): Promise<AlertItem[]> {
  const { default: prisma } = await import('../../prisma/client')

  const [students, sports] = await Promise.all([
    prisma.student.findMany({
      select: {
        sportName: true,
        sportAlterName: true,
        subCategory: true,
        age: true,
        weight: true,
        height: true,
      },
    }),
    prisma.sport.findMany({
      select: {
        name: true,
        route: true,
      },
    }),
  ])

  const sportRouteByName = Object.fromEntries(sports.map((sport) => [sport.name, sport.route]))

  const grouped = new Map<
    string,
    {
      sportName: string
      sportDisplayName: string
      subCategory: string
      bmiSum: number
      outOfRangeCount: number
      studentsCount: number
    }
  >()

  for (const student of students) {
    const key = `${student.sportName}::${student.subCategory}`
    const bmi = student.weight / (student.height * student.height)
    const status = classifyBMI(bmi, student.age)
    const item = grouped.get(key) ?? {
      sportName: student.sportName,
      sportDisplayName: student.sportAlterName,
      subCategory: student.subCategory,
      bmiSum: 0,
      outOfRangeCount: 0,
      studentsCount: 0,
    }

    item.bmiSum += bmi
    item.studentsCount += 1
    if (status !== 'Normal') {
      item.outOfRangeCount += 1
    }

    grouped.set(key, item)
  }

  const alerts: AlertItem[] = []

  for (const item of grouped.values()) {
    const avgBmi = item.studentsCount > 0 ? item.bmiSum / item.studentsCount : 0
    const outOfRangeRate =
      item.studentsCount > 0 ? (item.outOfRangeCount / item.studentsCount) * 100 : 0
    const normalRate = Math.max(0, 100 - outOfRangeRate)
    const idealBmi = IDEAL_BMI[item.subCategory] ?? 0
    const bmiGap = Math.abs(avgBmi - idealBmi)
    const severity = getSeverity(outOfRangeRate, bmiGap)

    alerts.push({
      sportName: item.sportName,
      sportDisplayName: item.sportDisplayName,
      sportRoute: sportRouteByName[item.sportName] ?? '',
      subCategory: item.subCategory,
      studentsCount: item.studentsCount,
      avgBmi: Number(avgBmi.toFixed(2)),
      idealBmi: Number(idealBmi.toFixed(2)),
      bmiGap: Number(bmiGap.toFixed(2)),
      outOfRangeRate: Number(outOfRangeRate.toFixed(1)),
      normalRate: Number(normalRate.toFixed(1)),
      severity,
      recommendation: getRecommendation(severity, outOfRangeRate),
    })
  }

  return alerts.sort((a, b) => {
    const severityDiff = getSeveritySortWeight(a.severity) - getSeveritySortWeight(b.severity)
    if (severityDiff !== 0) return severityDiff
    if (b.outOfRangeRate !== a.outOfRangeRate) return b.outOfRangeRate - a.outOfRangeRate
    return b.bmiGap - a.bmiGap
  })
}
