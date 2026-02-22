import { notFound } from 'next/navigation'
import Image from 'next/image'
import prisma from '../../../../../prisma/client'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { classifyBMI, getBMIColor } from '@/lib/bmi'
import { IDEAL_BMI } from '@/lib/constants'
import {
  getCalorieRanking,
  getSportCalorieProfile,
  getSportEducationalProfile,
} from '@/lib/sport-insights'
import SportSubcategoryComparisonChart from '@/components/charts/esportes/sport-subcategory-comparison-chart'
import SportCalorieRankingChart from '@/components/charts/esportes/sport-calorie-ranking-chart'
import {
  AlertTriangle,
  Flame,
  HeartPulse,
  Sparkles,
  Target,
  Users,
} from 'lucide-react'

interface SportDetailsPageProps {
  params:
    | {
        slug: string
      }
    | Promise<{
        slug: string
      }>
}

const subcategories = ['Sub-6', 'Sub-8', 'Sub-10', 'Sub-12', 'Sub-14', 'Sub-17']

function getStatusPill(classification: string) {
  switch (classification) {
    case 'Normal':
      return 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300'
    case 'Abaixo do peso':
      return 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300'
    case 'Sobrepeso':
      return 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-300'
    default:
      return 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300'
  }
}

async function getSportInsightData(route: string) {
  const sport = await prisma.sport.findFirst({
    where: { route },
  })

  if (!sport) return null

  const [students, sports] = await Promise.all([
    prisma.student.findMany({
      where: { sportName: sport.name },
      select: { subCategory: true, weight: true, height: true, age: true },
      orderBy: { name: 'asc' },
    }),
    prisma.sport.findMany({
      select: { name: true, alterName: true },
      orderBy: { name: 'asc' },
    }),
  ])

  const calorieProfile = getSportCalorieProfile(sport.name)
  const educationalProfile = getSportEducationalProfile(sport.route)
  const ranking = getCalorieRanking().map((item) => ({
    ...item,
    sportName: sports.find((s) => s.name === item.sportName)?.alterName ?? item.sportName,
  }))

  const statsBySub: Record<
    string,
    {
      count: number
      bmiSum: number
      avgBmi: number
      outOfRangeCount: number
      outOfRangeRate: number
      normalRate: number
      status: string
    }
  > = {}

  let totalBmi = 0
  let totalOutOfRange = 0

  for (const student of students) {
    const bmi = student.weight / (student.height * student.height)
    const status = classifyBMI(bmi, student.age)
    const outOfRange = status !== 'Normal'
    totalBmi += bmi
    if (outOfRange) totalOutOfRange += 1

    if (!statsBySub[student.subCategory]) {
      statsBySub[student.subCategory] = {
        count: 0,
        bmiSum: 0,
        avgBmi: 0,
        outOfRangeCount: 0,
        outOfRangeRate: 0,
        normalRate: 0,
        status: 'Normal',
      }
    }

    statsBySub[student.subCategory].count += 1
    statsBySub[student.subCategory].bmiSum += bmi
    if (outOfRange) statsBySub[student.subCategory].outOfRangeCount += 1
  }

  for (const sub of subcategories) {
    const entry = statsBySub[sub]
    if (!entry) {
      statsBySub[sub] = {
        count: 0,
        bmiSum: 0,
        avgBmi: 0,
        outOfRangeCount: 0,
        outOfRangeRate: 0,
        normalRate: 0,
        status: 'Sem dados',
      }
      continue
    }

    entry.avgBmi = entry.count ? Number((entry.bmiSum / entry.count).toFixed(2)) : 0
    entry.outOfRangeRate = entry.count
      ? Number(((entry.outOfRangeCount / entry.count) * 100).toFixed(1))
      : 0
    entry.normalRate = Number((100 - entry.outOfRangeRate).toFixed(1))
    entry.status = classifyBMI(entry.avgBmi, Number(sub.replace('Sub-', '')))
  }

  const avgBmiOverall = students.length ? Number((totalBmi / students.length).toFixed(2)) : 0
  const outOfRangeRateOverall = students.length
    ? Number(((totalOutOfRange / students.length) * 100).toFixed(1))
    : 0

  const topSub = subcategories.reduce((best, current) => {
    const bestDiff = Math.abs((statsBySub[best]?.avgBmi ?? 0) - (IDEAL_BMI[best] ?? 0))
    const currentDiff = Math.abs(
      (statsBySub[current]?.avgBmi ?? 0) - (IDEAL_BMI[current] ?? 0),
    )
    return currentDiff < bestDiff ? current : best
  }, 'Sub-6')

  const comparisonData = subcategories.map((sub) => ({
    sub: sub.replace('Sub-', ''),
    imcMedio: statsBySub[sub]?.avgBmi ?? 0,
    caloriasHora: calorieProfile.sub[sub] ?? 0,
    taxaNormal: statsBySub[sub]?.normalRate ?? 0,
  }))

  const alertSubs = subcategories.filter((sub) => (statsBySub[sub]?.outOfRangeRate ?? 0) > 30)

  return {
    sport,
    studentsCount: students.length,
    avgBmiOverall,
    outOfRangeRateOverall,
    statsBySub,
    topSub,
    alertSubs,
    calorieProfile,
    ranking,
    comparisonData,
    educationalProfile,
  }
}

export default async function SportDetailsPage({ params }: SportDetailsPageProps) {
  const { slug } = await params
  const data = await getSportInsightData(slug)

  if (!data) notFound()

  return (
    <main className="space-y-6 pb-8">
      <section className="relative h-[220px] overflow-hidden rounded-xl border">
        <Image
          src={data.sport.imageUrl}
          alt={data.sport.alterName}
          fill
          priority
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
        <div className="absolute bottom-5 left-6">
          <h1 className="text-4xl font-bold tracking-tight text-white">{data.sport.alterName}</h1>
          <p className="text-sm text-white/90">
            Visão tática, saúde e desenvolvimento por subcategoria.
          </p>
        </div>
      </section>

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">IMC médio do esporte</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <span className="text-3xl font-semibold">{data.avgBmiOverall.toFixed(2)}</span>
              <HeartPulse className="h-5 w-5 text-darkblue" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total de estudantes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <span className="text-3xl font-semibold">{data.studentsCount}</span>
              <Users className="h-5 w-5 text-darkblue" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Subcategoria destaque</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <span className="text-2xl font-semibold">{data.topSub}</span>
              <Sparkles className="h-5 w-5 text-darkblue" />
            </div>
            <p className="mt-2 text-xs text-muted-foreground">Mais próxima do IMC ideal</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Calorias médias por hora</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <span className="text-2xl font-semibold">{data.calorieProfile.general} kcal/h</span>
              <Flame className="h-5 w-5 text-darkblue" />
            </div>
            <p className="mt-2 text-xs text-muted-foreground">
              Estimativa educacional por intensidade moderada
            </p>
          </CardContent>
        </Card>
      </section>

      {data.alertSubs.length > 0 ? (
        <Card className="border-orange-300 bg-orange-50/60 dark:border-orange-900 dark:bg-orange-950/30">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-orange-700 dark:text-orange-300">
              <AlertTriangle className="h-5 w-5" />
              Alerta de Saúde
            </CardTitle>
            <CardDescription>
              Subcategorias com mais de 30% de alunos fora da faixa de IMC normal.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-wrap gap-2">
            {data.alertSubs.map((sub) => (
              <span
                key={sub}
                className="rounded-full border border-orange-300 bg-white px-3 py-1 text-sm font-medium text-orange-700 dark:border-orange-700 dark:bg-orange-900/20 dark:text-orange-300"
              >
                {sub}: {data.statsBySub[sub].outOfRangeRate.toFixed(1)}%
              </span>
            ))}
          </CardContent>
        </Card>
      ) : null}

      <section className="grid gap-6 xl:grid-cols-3">
        <Card className="xl:col-span-2">
          <CardHeader>
            <CardTitle>Status por subcategoria</CardTitle>
            <CardDescription>
              Classificação com base no IMC médio da turma usando o mesmo critério do sistema.
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {subcategories.map((sub) => {
              const item = data.statsBySub[sub]
              return (
                <div key={sub} className="rounded-lg border p-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-semibold">{sub}</span>
                    <span
                      className={`rounded-full px-2 py-1 text-xs font-medium ${getStatusPill(
                        item.status,
                      )}`}
                    >
                      {item.status}
                    </span>
                  </div>
                  <div className="mt-3 space-y-1 text-sm">
                    <p className="flex items-center justify-between">
                      <span className="text-muted-foreground">IMC médio</span>
                      <span className={getBMIColor(item.status)}>{item.avgBmi.toFixed(2)}</span>
                    </p>
                    <p className="flex items-center justify-between">
                      <span className="text-muted-foreground">Faixa normal</span>
                      <span>{item.normalRate.toFixed(1)}%</span>
                    </p>
                    <p className="flex items-center justify-between">
                      <span className="text-muted-foreground">Total de alunos</span>
                      <span>{item.count}</span>
                    </p>
                  </div>
                </div>
              )
            })}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Perfil do esporte</CardTitle>
            <CardDescription>Bloco educacional para orientação de pais e responsáveis.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 text-sm">
            <div>
              <h4 className="mb-1 font-semibold">Músculos mais trabalhados</h4>
              <p className="text-muted-foreground">{data.educationalProfile.muscles.join(', ')}</p>
            </div>
            <div>
              <h4 className="mb-1 font-semibold">Benefícios físicos</h4>
              <p className="text-muted-foreground">
                {data.educationalProfile.physicalBenefits.join(', ')}
              </p>
            </div>
            <div>
              <h4 className="mb-1 font-semibold">Benefícios cognitivos</h4>
              <p className="text-muted-foreground">
                {data.educationalProfile.cognitiveBenefits.join(', ')}
              </p>
            </div>
            <div className="rounded-md bg-muted p-3">
              <p className="font-medium">
                Faixa etária ideal de início: {data.educationalProfile.idealStartAge}
              </p>
            </div>
          </CardContent>
        </Card>
      </section>

      <section className="grid gap-6 xl:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Comparativo entre subcategorias</CardTitle>
            <CardDescription>
              IMC médio, gasto calórico estimado e taxa de alunos em faixa normal.
            </CardDescription>
          </CardHeader>
          <CardContent className="h-[320px]">
            <SportSubcategoryComparisonChart data={data.comparisonData} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Gasto calórico por subcategoria</CardTitle>
            <CardDescription>
              Média estimada de calorias por hora para este esporte.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {subcategories.map((sub) => {
              const kcal = data.calorieProfile.sub[sub] ?? 0
              const width = Math.max(8, Math.round((kcal / data.calorieProfile.general) * 100))
              return (
                <div key={sub} className="space-y-1">
                  <div className="flex items-center justify-between text-sm">
                    <span>{sub}</span>
                    <span className="font-medium">{kcal} kcal/h</span>
                  </div>
                  <div className="h-2 rounded-full bg-muted">
                    <div
                      className="h-2 rounded-full bg-darkblue"
                      style={{ width: `${Math.min(100, width)}%` }}
                    />
                  </div>
                </div>
              )
            })}
            <div className="mt-4 rounded-md border border-dashed p-3 text-sm text-muted-foreground">
              Referência geral do esporte: <strong>{data.calorieProfile.general} kcal/h</strong>
            </div>
          </CardContent>
        </Card>
      </section>

      <Card>
        <CardHeader>
          <CardTitle>Ranking de gasto calórico entre esportes</CardTitle>
          <CardDescription>
            Comparativo médio de intensidade para apoiar recomendações educacionais.
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4 xl:grid-cols-3">
          <div className="h-[280px] xl:col-span-2">
            <SportCalorieRankingChart
              data={data.ranking}
              highlightSportName={data.sport.alterName}
            />
          </div>
          <div className="rounded-lg border p-4">
            <p className="text-sm text-muted-foreground">Esporte atual em foco</p>
            <p className="mt-1 text-xl font-semibold">{data.sport.alterName}</p>
            <p className="mt-3 text-sm text-muted-foreground">
              Taxa geral fora do ideal:
            </p>
            <p className="text-2xl font-bold">{data.outOfRangeRateOverall.toFixed(1)}%</p>
            <p className="mt-3 text-sm text-muted-foreground">
              Objetivo sugerido: reduzir para abaixo de 25% com plano de acompanhamento.
            </p>
            <div className="mt-4 flex items-center gap-2 rounded-md bg-muted p-2 text-sm">
              <Target className="h-4 w-4 text-darkblue" />
              Acompanhe evolução mensal por subcategoria.
            </div>
          </div>
        </CardContent>
      </Card>
    </main>
  )
}

