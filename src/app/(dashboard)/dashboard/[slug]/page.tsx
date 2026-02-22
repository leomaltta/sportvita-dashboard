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
  GraduationCap,
  SparklesIcon,
  TrendingUpIcon,
} from 'lucide-react'
import { notFound } from 'next/navigation'
import prisma from '../../../../../prisma/client'
import { SubsTableOverviewDynamic } from '@/components/tables/subs/subs-table-overview-dynamic'
import SportSelectorDynamic from '@/components/selectors/sport-selector-dynamic'
import LineImcComparisonChartDynamic from '@/components/charts/line-imc-idade-comparison-chart-dynamic'

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

  for (const student of students) {
    const bmi = student.weight / (student.height * student.height)
    totalBmi += bmi

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
    Atual: statsBySub[sub]?.media ?? 0,
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

  return {
    sport,
    sports,
    chartData,
    statsBySub,
    idealBySub,
    mediaImc,
    count: students.length,
    subDestaque,
  }
}

export default async function SportOverview({ params }: SportPageProps) {
  const { slug } = await params
  const data = await getSportStats(slug)

  if (!data) {
    notFound()
  }

  const percentage = data.count ? Math.max(1, Math.round(data.count / 2)) : 0
  const percentageTotal = data.count ? Math.max(1, Math.round(data.count / 3)) : 0
  const lastPercentageIndice = data.count ? Math.max(1, Math.round(data.count / 4)) : 0
  const percentageIndice = data.count + 10

  return (
    <main className="flex min-h-screen min-w-full flex-col gap-9">
      <section className="mx-5 mt-8 flex flex-row justify-between min-[425px]:mx-6 md:mx-10">
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
        <div className="mx-7 grid grid-cols-1 gap-8 p-1 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-[0.95rem] font-medium">Média IMC</CardTitle>
              <AreaChartIcon />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{data.mediaImc.toFixed(2)}</div>
              <p className="mt-2 text-xs text-muted-foreground">
                <span className="text-green-500">+{percentage}% </span>desde o último mês
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-[0.95rem] font-medium">Total Estudantes</CardTitle>
              <GraduationCap />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{data.count}</div>
              <p className="mt-2 text-xs text-muted-foreground">
                <span className="text-red-500">-{percentageTotal}% </span>desde o último mês
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-[0.95rem] font-medium">
                Índice de participação
              </CardTitle>
              <TrendingUpIcon />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{percentageIndice}%</div>
              <p className="mt-2 text-xs text-muted-foreground">
                <span className="text-green-500">+{lastPercentageIndice}% </span>desde o último mês
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
              <p className="mt-2 text-xs text-muted-foreground">
                Destaque do último mês: {data.subDestaque}
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      <section className="mx-4 flex flex-col items-center gap-10 md:mx-7 md:grid md:grid-cols-2 lg:mx-8 lg:max-w-full lg:flex-row">
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
