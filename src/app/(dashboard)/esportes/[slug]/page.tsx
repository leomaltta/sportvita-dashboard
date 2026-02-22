import { notFound } from 'next/navigation'
import prisma from '../../../../../prisma/client'
import Image from 'next/image'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import LineImcYearComparisonChart from '@/components/charts/esportes/line-imc-year-comparison-chart'

interface SportDetailsPageProps {
  params:
    | {
        slug: string
      }
    | Promise<{
        slug: string
      }>
}

async function getSportDetails(route: string) {
  const sport = await prisma.sport.findFirst({
    where: { route },
  })

  if (!sport) return null

  const [students, ideal] = await Promise.all([
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

  const makeYearData = (idealValue: number, current: number) => [
    { name: 'Novembro', Media: 0, Ideal: idealValue },
    { name: 'Agosto', Media: 0, Ideal: idealValue },
    { name: 'Maio', Media: 0, Ideal: idealValue },
    { name: 'Fevereiro', Media: current, Ideal: idealValue },
  ]

  const mediaGeral = students.length ? totalBmi / students.length : 0

  return {
    sport,
    mediaGeral,
    statsBySub,
    idealBySub,
    chartDataYearComparison: makeYearData(18.16, mediaGeral),
    chartBySub: {
      'Sub-6': makeYearData(idealBySub['Sub-6'] ?? 0, statsBySub['Sub-6']?.media ?? 0),
      'Sub-8': makeYearData(idealBySub['Sub-8'] ?? 0, statsBySub['Sub-8']?.media ?? 0),
      'Sub-10': makeYearData(idealBySub['Sub-10'] ?? 0, statsBySub['Sub-10']?.media ?? 0),
      'Sub-12': makeYearData(idealBySub['Sub-12'] ?? 0, statsBySub['Sub-12']?.media ?? 0),
      'Sub-14': makeYearData(idealBySub['Sub-14'] ?? 0, statsBySub['Sub-14']?.media ?? 0),
      'Sub-17': makeYearData(idealBySub['Sub-17'] ?? 0, statsBySub['Sub-17']?.media ?? 0),
    },
  }
}

export default async function SportDetailsPage({ params }: SportDetailsPageProps) {
  const { slug } = await params
  const data = await getSportDetails(slug)

  if (!data) {
    notFound()
  }

  return (
    <main className="flex flex-col gap-10">
      <section className="flex flex-col gap-5">
        <div className="relative h-[13rem] w-full">
          <Image
            className="border-b-2 object-cover"
            alt={`${data.sport.alterName} Image`}
            src={data.sport.imageUrl}
            fill
            priority
          />
        </div>
      </section>

      <section className="mx-4">
        <Card className="h-auto">
          <CardHeader>
            <CardTitle className="text-3xl font-medium tracking-tight">
              Visão Geral
            </CardTitle>
            <CardDescription>
              Análise de dados baseados nas informações do esporte {data.sport.alterName}.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col gap-5 lg:grid lg:grid-cols-2">
              <Card className="h-[50vh] w-full pb-10 md:h-[60vh] md:pb-0 lg:h-[70vh]">
                <CardHeader>
                  <CardTitle className="text-2xl font-medium tracking-tight">
                    Média IMC Anual
                  </CardTitle>
                  <CardDescription>
                    Análise do progresso na média do IMC ao longo de um ano.
                  </CardDescription>
                </CardHeader>
                <CardContent className="mr-4 h-5/6 p-0">
                  <LineImcYearComparisonChart data={data.chartDataYearComparison} />
                </CardContent>
              </Card>

              <Card className="h-[50vh] w-full pb-10 md:h-[60vh] md:pb-0 lg:h-[70vh]">
                <CardHeader>
                  <CardTitle className="text-2xl font-medium tracking-tight">
                    Subcategoria Destaque
                  </CardTitle>
                  <CardDescription>
                    Distribuição atual por subcategoria e comparativo com IMC ideal.
                  </CardDescription>
                </CardHeader>
                <CardContent className="grid h-5/6 grid-cols-2 gap-3 overflow-auto">
                  {Object.entries(data.chartBySub).map(([sub, chart]) => (
                    <Card key={sub} className="h-[220px]">
                      <CardHeader className="pb-2">
                        <CardTitle className="text-base">{sub}</CardTitle>
                      </CardHeader>
                      <CardContent className="h-[150px] p-0">
                        <LineImcYearComparisonChart data={chart} />
                      </CardContent>
                    </Card>
                  ))}
                </CardContent>
              </Card>
            </div>
          </CardContent>
        </Card>
      </section>
    </main>
  )
}
