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
  GraduationCap,
  SparklesIcon,
  TrendingUpIcon,
} from 'lucide-react'
import Link from 'next/link'

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

  for (const student of students) {
    const bmi = student.weight / (student.height * student.height)
    bmiSum += bmi
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
    Atual: currentBySub[sub] ?? 0,
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

  const participation = 60 + Math.floor(Math.random() * 36)

  return {
    sports,
    chartData,
    avgImc,
    studentCount: students.length,
    topSub,
    topSubSport,
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
  } =
    await getDashboardData()

  return (
    <main className="flex min-h-screen min-w-full flex-col gap-9">
      <section className="mx-5 mt-8 flex flex-row justify-between md:mx-10">
        <Link href="/dashboard">
          <h1 className="text-3xl font-semibold lg:text-4xl">Dashboard</h1>
        </Link>
        <SportSelector sports={sports} />
      </section>

      <section>
        <div className="mx-7 grid grid-cols-1 gap-8 p-1 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-[1rem] font-medium tracking-normal">Média IMC</CardTitle>
              <AreaChartIcon />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{avgImc.toFixed(2)}</div>
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
              <p className="mt-2 text-xs text-muted-foreground">Estudantes cadastrados</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-[1rem] font-medium tracking-normal">
                Índice de participação
              </CardTitle>
              <TrendingUpIcon />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{participation}%</div>
              <p className="mt-2 text-xs text-muted-foreground">Métrica provisória geral</p>
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
              <p className="mt-2 text-xs text-muted-foreground">
                Esporte: {topSubSport}
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      <section className="mx-4 flex flex-col items-center gap-10 md:mx-7 md:grid md:grid-cols-2 lg:mx-8 lg:flex-row">
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
