import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import Link from 'next/link'
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
import { notFound } from 'next/navigation'
import prisma from '../../../../../prisma/client'
import { SubsTableOverviewDynamic } from '@/components/tables/subs/subs-table-overview-dynamic'
import SportSelectorDynamic from '@/components/selectors/sport-selector-dynamic'
import LineImcComparisonChartDynamic from '@/components/charts/line-imc-idade-comparison-chart-dynamic'
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

interface SportPageProps {
  params:
    | {
        slug: string
      }
    | Promise<{
        slug: string
      }>
}

async function getSportStats(route: string) {
  const sport = await prisma.sport.findFirst({
    where: { route },
  })

  if (!sport) return null

  const [sports, students, ideal] = await Promise.all([
    prisma.sport.findMany({
      orderBy: { name: 'asc' },
      select: { route: true, alterName: true },
    }),
    prisma.student.findMany({
      where: { sportName: sport.name },
      select: { subCategory: true, weight: true, height: true },
    }),
    prisma.idealBMI.findMany({
      select: { subCategory: true, bmiValue: true },
    }),
  ])

  const statsBySub: Record<string, { media: number; count: number }> = {}
  let totalBmi = 0
  let normalBmiCount = 0

  for (const student of students) {
    const bmi = student.weight / (student.height * student.height)
    const ageFromSub = Number(student.subCategory.replace('Sub-', ''))
    const status = classifyBMI(bmi, ageFromSub)
    totalBmi += bmi
    if (status === 'Normal') {
      normalBmiCount += 1
    }

    const current = statsBySub[student.subCategory] ?? { media: 0, count: 0 }
    current.media += bmi
    current.count += 1
    statsBySub[student.subCategory] = current
  }

  Object.keys(statsBySub).forEach((key) => {
    const item = statsBySub[key]
    statsBySub[key] = {
      media: item.count ? item.media / item.count : 0,
      count: item.count,
    }
  })

  const idealBySub = Object.fromEntries(
    ideal.map((item) => [item.subCategory, item.bmiValue]),
  )

  const subcategories = ['Sub-6', 'Sub-8', 'Sub-10', 'Sub-12', 'Sub-14', 'Sub-17']
  const chartData = subcategories.map((sub) => ({
    name: sub.replace('Sub-', '') + ' anos',
    Atual: Number((statsBySub[sub]?.media ?? 0).toFixed(2)),
    Ideal: idealBySub[sub] ?? 0,
  }))

  const mediaImc = students.length ? totalBmi / students.length : 0

  const subDestaque = subcategories.reduce((best, current) => {
    const bestGap = Math.abs((statsBySub[best]?.media ?? 0) - (idealBySub[best] ?? 0))
    const currentGap = Math.abs(
      (statsBySub[current]?.media ?? 0) - (idealBySub[current] ?? 0),
    )
    return currentGap < bestGap ? current : best
  }, 'Sub-6')
  const topGap = Math.abs(
    (statsBySub[subDestaque]?.media ?? 0) - (idealBySub[subDestaque] ?? 0),
  )

  return {
    sport,
    sports,
    chartData,
    statsBySub,
    idealBySub,
    mediaImc,
    count: students.length,
    subDestaque,
    topGap: Number(topGap.toFixed(2)),
    participationRate:
      students.length > 0
        ? Math.min(100, Math.max(0, Math.round((normalBmiCount / students.length) * 100)))
        : 0,
  }
}

export default async function SportOverview({ params }: SportPageProps) {
  const { slug } = await params
  const data = await getSportStats(slug)

  if (!data) {
    notFound()
  }

  const percentageIndice = data.participationRate
  const bmiStatus = getBmiStatus(data.mediaImc)
  const coverageStatus = getCoverageStatus(data.count)
  const participationStatus = getParticipationStatus(percentageIndice)
  const highlightStatus = getHighlightStatus(data.topGap)

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-screen-2xl flex-col gap-8 px-4 pb-8 pt-8 sm:px-6 lg:px-8">
      <section className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <Link href="/dashboard">
          <h1 className="text-3xl font-semibold tracking-tight lg:text-4xl">
            Dashboard
          </h1>
        </Link>
        <SportSelectorDynamic
          esporteDetails={data.sport.route}
          esporteTitle={data.sport.alterName}
          sports={data.sports}
        />
      </section>

      <section>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-[0.95rem] font-medium">Média IMC</CardTitle>
              <AreaChartIcon />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{data.mediaImc.toFixed(2)}</div>
              <div
                className={`mt-2 inline-flex items-center gap-1 rounded-full px-2 py-1 text-xs font-medium ${bmiStatus.className}`}
              >
                <bmiStatus.Icon className="h-3.5 w-3.5" />
                {bmiStatus.label}
              </div>
              <p className="mt-2 text-xs text-muted-foreground">Visão atual do esporte</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-[0.95rem] font-medium">Total Estudantes</CardTitle>
              <GraduationCap />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{data.count}</div>
              <div
                className={`mt-2 inline-flex items-center gap-1 rounded-full px-2 py-1 text-xs font-medium ${coverageStatus.className}`}
              >
                <coverageStatus.Icon className="h-3.5 w-3.5" />
                {coverageStatus.label}
              </div>
              <p className="mt-2 text-xs text-muted-foreground">Estudantes cadastrados no esporte</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-[0.95rem] font-medium">
                Taxa de IMC normal
              </CardTitle>
              <TrendingUpIcon />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{percentageIndice}%</div>
              <div
                className={`mt-2 inline-flex items-center gap-1 rounded-full px-2 py-1 text-xs font-medium ${participationStatus.className}`}
              >
                <participationStatus.Icon className="h-3.5 w-3.5" />
                {participationStatus.label}
              </div>
              <p className="mt-2 text-xs text-muted-foreground">
                Percentual atual de estudantes na faixa normal
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-[0.95rem] font-medium">
                Subcategoria Destaque
              </CardTitle>
              <SparklesIcon />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{data.subDestaque}</div>
              <div
                className={`mt-2 inline-flex items-center gap-1 rounded-full px-2 py-1 text-xs font-medium ${highlightStatus.className}`}
              >
                <highlightStatus.Icon className="h-3.5 w-3.5" />
                {highlightStatus.label}
              </div>
              <p className="mt-2 text-xs text-muted-foreground">
                Mais próxima do IMC ideal no cenário atual
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      <section className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Card className="h-[500px] min-h-[50vh] w-full max-w-full pb-10 lg:w-full min-[1155px]:h-[480px]">
          <CardHeader>
            <CardTitle className="text-2xl font-medium tracking-tight">
              Média IMC por Idade
            </CardTitle>
            <CardDescription>
              Selecione um esporte para poder visualizar seu respectivo IMC Atual.
            </CardDescription>
          </CardHeader>
          <CardContent className="mr-4 h-5/6 p-0">
            <LineImcComparisonChartDynamic data={data.chartData} />
          </CardContent>
        </Card>
        <Card className="h-[500px] min-h-[50vh] w-full max-w-full pb-10 lg:w-full min-[1155px]:h-[480px]">
          <CardHeader>
            <CardTitle className="text-2xl font-medium tracking-tight">
              Subcategorias
            </CardTitle>
            <CardDescription>
              Selecione um esporte para poder visualizar suas respectivas subcategorias.
            </CardDescription>
          </CardHeader>
          <CardContent className="mr-4">
            <SubsTableOverviewDynamic
              statsBySub={data.statsBySub}
              idealBySub={data.idealBySub}
            />
          </CardContent>
        </Card>
      </section>
    </main>
  )
}
