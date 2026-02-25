import prisma from '../../../../prisma/client'
import SportSelector from '@/components/selectors/sport-selector'
import LineImcComparisonChartDynamic from '@/components/charts/line-imc-idade-comparison-chart-dynamic'
import { SubsTableOverview } from '@/components/tables/subs/subs-table-overview'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  AreaChartIcon,
  AlertTriangle,
  CheckCircle2,
  CircleAlert,
  GraduationCap,
  Info,
  LucideIcon,
  SparklesIcon,
  TrendingUpIcon,
} from 'lucide-react'
import Link from 'next/link'
import { classifyBMI } from '@/lib/bmi'

interface StatusMeta {
  label: string
  className: string
  Icon: LucideIcon
}

function getBmiStatus(value: number): StatusMeta {
  if (value < 14) {
    return {
      label: 'Abaixo do ideal',
      className: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300',
      Icon: CircleAlert,
    }
  }
  if (value < 23) {
    return {
      label: 'Saudável',
      className: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300',
      Icon: CheckCircle2,
    }
  }
  if (value < 27) {
    return {
      label: 'Atenção',
      className: 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-300',
      Icon: AlertTriangle,
    }
  }
  return {
    label: 'Crítico',
    className: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300',
    Icon: AlertTriangle,
  }
}

function getParticipationStatus(value: number): StatusMeta {
  if (value >= 75) {
    return {
      label: 'Ótimo',
      className: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300',
      Icon: CheckCircle2,
    }
  }
  if (value >= 50) {
    return {
      label: 'Bom',
      className: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300',
      Icon: Info,
    }
  }
  if (value >= 30) {
    return {
      label: 'Atenção',
      className: 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-300',
      Icon: AlertTriangle,
    }
  }
  return {
    label: 'Crítico',
    className: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300',
    Icon: AlertTriangle,
  }
}

function getCoverageStatus(totalStudents: number): StatusMeta {
  const studentsPerSub = totalStudents / 6
  if (studentsPerSub >= 20) {
    return {
      label: 'Alta cobertura',
      className: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300',
      Icon: CheckCircle2,
    }
  }
  if (studentsPerSub >= 10) {
    return {
      label: 'Cobertura média',
      className: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300',
      Icon: Info,
    }
  }
  return {
    label: 'Baixa cobertura',
    className: 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-300',
    Icon: CircleAlert,
  }
}

function getHighlightStatus(gap: number): StatusMeta {
  if (gap <= 0.5) {
    return {
      label: 'Excelente',
      className: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300',
      Icon: CheckCircle2,
    }
  }
  if (gap <= 1) {
    return {
      label: 'Boa',
      className: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300',
      Icon: Info,
    }
  }
  if (gap <= 2) {
    return {
      label: 'Moderada',
      className: 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-300',
      Icon: CircleAlert,
    }
  }
  return {
    label: 'Distante',
    className: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300',
    Icon: AlertTriangle,
  }
}

async function getDashboardData() {
  const [sports, students, ideal] = await Promise.all([
    prisma.sport.findMany({
      orderBy: { name: 'asc' },
      select: { name: true, route: true, alterName: true },
    }),
    prisma.student.findMany({
      select: { subCategory: true, sportName: true, weight: true, height: true },
    }),
    prisma.idealBMI.findMany({
      select: { subCategory: true, bmiValue: true },
    }),
  ])

  const studentsBySub: Record<string, number> = {}
  const sumBySub: Record<string, number> = {}
  const sumBySportSub: Record<string, { total: number; count: number }> = {}
  let bmiSum = 0
  let normalBmiCount = 0

  for (const student of students) {
    const bmi = student.weight / (student.height * student.height)
    const bmiStatus = classifyBMI(bmi, Number(student.subCategory.replace('Sub-', '')))
    bmiSum += bmi
    if (bmiStatus === 'Saudável') {
      normalBmiCount += 1
    }
    studentsBySub[student.subCategory] = (studentsBySub[student.subCategory] ?? 0) + 1
    sumBySub[student.subCategory] = (sumBySub[student.subCategory] ?? 0) + bmi
    const key = `${student.sportName}::${student.subCategory}`
    const current = sumBySportSub[key] ?? { total: 0, count: 0 }
    current.total += bmi
    current.count += 1
    sumBySportSub[key] = current
  }

  const currentBySub = Object.fromEntries(
    Object.entries(studentsBySub).map(([sub, count]) => [sub, (sumBySub[sub] ?? 0) / count]),
  )

  const idealBySub = Object.fromEntries(ideal.map((item) => [item.subCategory, item.bmiValue]))
  const subcategories = ['Sub-6', 'Sub-8', 'Sub-10', 'Sub-12', 'Sub-14', 'Sub-17']

  const chartData = subcategories.map((sub) => ({
    name: sub.replace('Sub-', '') + ' anos',
    Ideal: idealBySub[sub] ?? 0,
    Atual: Number((currentBySub[sub] ?? 0).toFixed(2)),
  }))

  const avgImc = students.length ? bmiSum / students.length : 0
  const sportNameToAlterName = Object.fromEntries(
    sports.map((sport) => [sport.name, sport.alterName]),
  )

  let topSub = 'N/A'
  let topSubSport = 'N/A'
  let bestGap = Number.POSITIVE_INFINITY

  for (const [key, value] of Object.entries(sumBySportSub)) {
    const [sportName, subCategory] = key.split('::')
    const avg = value.count ? value.total / value.count : 0
    const gap = Math.abs(avg - (idealBySub[subCategory] ?? 0))
    if (gap < bestGap) {
      bestGap = gap
      topSub = subCategory
      topSubSport = sportNameToAlterName[sportName] || sportName
    }
  }

  const participation = students.length
    ? Math.round((normalBmiCount / students.length) * 100)
    : 0

  return {
    sports,
    chartData,
    avgImc,
    studentCount: students.length,
    topSub,
    topSubSport,
    topGap: Number(bestGap.toFixed(2)),
    participation,
    currentBySub,
    studentsBySub,
  }
}

export default async function Dashboard() {
  const {
    sports,
    chartData,
    avgImc,
    studentCount,
    topSub,
    topSubSport,
    participation,
    currentBySub,
    studentsBySub,
    topGap,
  } =
    await getDashboardData()

  const bmiStatus = getBmiStatus(avgImc)
  const coverageStatus = getCoverageStatus(studentCount)
  const participationStatus = getParticipationStatus(participation)
  const highlightStatus = getHighlightStatus(topGap)

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-screen-2xl flex-col gap-8 px-4 pb-8 pt-8 sm:px-6 lg:px-8">
      <section className="flex flex-row items-center justify-between">
        <Link href="/dashboard">
          <h1 className="text-3xl font-semibold lg:text-4xl">Dashboard</h1>
        </Link>
        <SportSelector sports={sports} />
      </section>

      <section>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-[1rem] font-medium tracking-normal">Média IMC</CardTitle>
              <AreaChartIcon />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{avgImc.toFixed(2)}</div>
              <div
                className={`mt-2 inline-flex items-center gap-1 rounded-full px-2 py-1 text-xs font-medium ${bmiStatus.className}`}
              >
                <bmiStatus.Icon className="h-3.5 w-3.5" />
                {bmiStatus.label}
              </div>
              <p className="mt-2 text-xs text-muted-foreground">Visão geral dos estudantes</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-[1rem] font-medium tracking-normal">
                Total Estudantes
              </CardTitle>
              <GraduationCap />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{studentCount}</div>
              <div
                className={`mt-2 inline-flex items-center gap-1 rounded-full px-2 py-1 text-xs font-medium ${coverageStatus.className}`}
              >
                <coverageStatus.Icon className="h-3.5 w-3.5" />
                {coverageStatus.label}
              </div>
              <p className="mt-2 text-xs text-muted-foreground">Estudantes cadastrados</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-[1rem] font-medium tracking-normal">
                Taxa de IMC saudável
              </CardTitle>
              <TrendingUpIcon />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{participation}%</div>
              <div
                className={`mt-2 inline-flex items-center gap-1 rounded-full px-2 py-1 text-xs font-medium ${participationStatus.className}`}
              >
                <participationStatus.Icon className="h-3.5 w-3.5" />
                {participationStatus.label}
              </div>
              <p className="mt-2 text-xs text-muted-foreground">
                Percentual atual de estudantes na faixa saudável
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-[1rem] font-medium tracking-normal">
                Subcategoria Destaque
              </CardTitle>
              <SparklesIcon />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{topSub}</div>
              <div
                className={`mt-2 inline-flex items-center gap-1 rounded-full px-2 py-1 text-xs font-medium ${highlightStatus.className}`}
              >
                <highlightStatus.Icon className="h-3.5 w-3.5" />
                {highlightStatus.label}
              </div>
              <p className="mt-2 text-xs text-muted-foreground">
                Esporte: {topSubSport}
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      <section className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Card className="h-[500px] min-h-[50vh] w-full max-w-full pb-10">
          <CardHeader>
            <CardTitle className="text-2xl font-medium tracking-normal">
              Média IMC por Idade
            </CardTitle>
            <CardDescription>
              Selecione um esporte para visualizar os detalhes por categoria.
            </CardDescription>
          </CardHeader>
          <CardContent className="mr-4 h-5/6 p-0">
            <LineImcComparisonChartDynamic data={chartData} />
          </CardContent>
        </Card>
        <Card className="h-[500px] min-h-[50vh] w-full max-w-full pb-10">
          <CardHeader>
            <CardTitle className="text-2xl font-medium tracking-normal">Subcategorias</CardTitle>
            <CardDescription>Resumo por IMC ideal, atual e total de estudantes.</CardDescription>
          </CardHeader>
          <CardContent className="mr-4">
            <SubsTableOverview currentBySub={currentBySub} studentsBySub={studentsBySub} />
          </CardContent>
        </Card>
      </section>
    </main>
  )
}
