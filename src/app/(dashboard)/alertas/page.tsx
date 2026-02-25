import Link from 'next/link'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { AlertTriangle, ArrowUpRight, BellRing, CheckCircle2, Download, ShieldAlert } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  AlertFilters,
  Severity,
  buildFilterQuery,
  filterAlerts,
  getAlertData,
  getSeverityClassName,
  parseMultiParam,
} from '@/lib/alerts'

interface AlertPageProps {
  searchParams:
    | {
        esporte?: string
        sub?: string
        severidade?: string
      }
    | Promise<{
        esporte?: string
        sub?: string
        severidade?: string
      }>
}

const subcategories = ['Sub-6', 'Sub-8', 'Sub-10', 'Sub-12', 'Sub-14', 'Sub-17']

function toggleValue(values: string[], value: string) {
  return values.includes(value)
    ? values.filter((item) => item !== value)
    : [...values, value]
}

function buildFilterHref(
  sports: string[],
  subs: string[],
  severities: string[],
): string {
  const query = buildFilterQuery({
    sports,
    subcategories: subs,
    severities,
  })
  return query ? `/alertas?${query}` : '/alertas'
}

export default async function AlertsPage({ searchParams }: AlertPageProps) {
  const filters = await searchParams
  const allAlerts = await getAlertData()
  const selectedSports = parseMultiParam(filters.esporte)
  const selectedSubs = parseMultiParam(filters.sub)
  const selectedSeverities = parseMultiParam(filters.severidade)
  const sportOptions = Array.from(
    new Set(allAlerts.map((alert) => `${alert.sportName}::${alert.sportDisplayName}`)),
  )
    .map((item) => {
      const [name, displayName] = item.split('::')
      return { name, displayName }
    })
    .sort((a, b) => a.displayName.localeCompare(b.displayName, 'pt-BR'))

  const activeFilters: AlertFilters = {
    sports: selectedSports,
    subcategories: selectedSubs,
    severities: selectedSeverities,
  }
  const hasActiveFilters =
    selectedSports.length > 0 || selectedSubs.length > 0 || selectedSeverities.length > 0
  const filteredAlerts = filterAlerts(allAlerts, activeFilters)

  const criticalCount = filteredAlerts.filter((alert) => alert.severity === 'Crítico').length
  const warningCount = filteredAlerts.filter((alert) => alert.severity === 'Atenção').length
  const topRisk = filteredAlerts[0]
  const globalNormalRate =
    filteredAlerts.length > 0
      ? Number(
          (
            filteredAlerts.reduce((acc, alert) => acc + alert.normalRate, 0) /
            filteredAlerts.length
          ).toFixed(1),
        )
      : 0

  const actionSummary = filteredAlerts
    .filter((alert) => alert.severity !== 'Monitorar')
    .slice(0, 3)
  const exportQuery = buildFilterQuery(activeFilters)
  const exportHref = exportQuery
    ? `/api/alertas/export?${exportQuery}`
    : '/api/alertas/export'

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-screen-2xl flex-col gap-8 px-4 pb-8 pt-8 sm:px-6 lg:px-8">
      <section className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div className="space-y-2">
          <h1 className="text-3xl font-semibold tracking-tight lg:text-4xl">Alertas de Saúde</h1>
          <p className="text-sm text-muted-foreground">
            Priorização global por esporte e subcategoria para apoiar decisões rápidas da
            coordenação.
          </p>
        </div>
        <Button asChild className="self-start">
          <Link href={exportHref}>
            <Download className="h-4 w-4" />
            Exportar CSV
          </Link>
        </Button>
      </section>

      <section className="flex flex-wrap gap-2">
        <Link
          href="/alertas"
          className={`rounded-full border px-3 py-1 text-xs font-medium transition ${
            hasActiveFilters
              ? 'hover:bg-accent'
              : 'border-primary bg-primary text-primary-foreground hover:bg-primary/90'
          }`}
        >
          Todos
        </Link>
        {sportOptions.map((sport) => (
          <Link
            key={sport.name}
            href={buildFilterHref(
              toggleValue(selectedSports, sport.name),
              selectedSubs,
              selectedSeverities,
            )}
            className={`rounded-full border px-3 py-1 text-xs font-medium transition ${
              selectedSports.includes(sport.name)
                ? 'border-primary bg-primary text-primary-foreground hover:bg-primary/90'
                : 'hover:bg-accent'
            }`}
          >
            {selectedSports.includes(sport.name) ? ' × ' : ''}
            {sport.displayName}
          </Link>
        ))}
        {subcategories.map((sub) => (
          <Link
            key={sub}
            href={buildFilterHref(
              selectedSports,
              toggleValue(selectedSubs, sub),
              selectedSeverities,
            )}
            className={`rounded-full border px-3 py-1 text-xs font-medium transition ${
              selectedSubs.includes(sub)
                ? 'border-primary bg-primary text-primary-foreground hover:bg-primary/90'
                : 'hover:bg-accent'
            }`}
          >
            {selectedSubs.includes(sub) ? ' × ' : ''}
            {sub}
          </Link>
        ))}
        {(['Crítico', 'Atenção', 'Monitorar'] as Severity[]).map((severity) => (
          <Link
            key={severity}
            href={buildFilterHref(
              selectedSports,
              selectedSubs,
              toggleValue(selectedSeverities, severity),
            )}
            className={`rounded-full border px-3 py-1 text-xs font-medium transition ${
              selectedSeverities.includes(severity)
                ? 'border-primary bg-primary text-primary-foreground hover:bg-primary/90'
                : 'hover:bg-accent'
            }`}
          >
            {selectedSeverities.includes(severity) ? ' × ' : ''}
            {severity}
          </Link>
        ))}
      </section>

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Alertas críticos</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <span className="text-2xl font-semibold">{criticalCount}</span>
              <ShieldAlert className="h-5 w-5 text-red-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Subcategorias em atenção</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <span className="text-2xl font-semibold">{warningCount}</span>
              <AlertTriangle className="h-5 w-5 text-orange-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Maior risco atual</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-semibold leading-tight tracking-tight">
              {topRisk
                ? `${topRisk.sportDisplayName} • ${topRisk.subCategory}`
                : 'Sem alertas no filtro atual'}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Taxa média de IMC saudável</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <span className="text-2xl font-semibold">{globalNormalRate}%</span>
              <CheckCircle2 className="h-5 w-5 text-emerald-500" />
            </div>
          </CardContent>
        </Card>
      </section>

      <section className="grid gap-6 xl:grid-cols-3">
        <Card className="xl:col-span-2">
          <CardHeader>
            <CardTitle>Fila de priorização</CardTitle>
            <CardDescription>
              Alertas ordenados por severidade e impacto para definir ação imediata.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="max-h-[560px] overflow-y-auto pr-2">
              <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Severidade</TableHead>
                  <TableHead>Esporte</TableHead>
                  <TableHead>Sub</TableHead>
                  <TableHead className="text-right">% fora</TableHead>
                  <TableHead className="text-right">Gap IMC</TableHead>
                  <TableHead className="text-right">Total</TableHead>
                  <TableHead className="text-center">Ação</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredAlerts.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center text-muted-foreground">
                      Nenhum alerta encontrado com os filtros atuais.
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredAlerts.map((alert) => (
                    <TableRow key={`${alert.sportName}-${alert.subCategory}`}>
                      <TableCell>
                        <span
                          className={`inline-flex rounded-full px-2 py-1 text-xs font-medium ${getSeverityClassName(alert.severity)}`}
                        >
                          {alert.severity}
                        </span>
                      </TableCell>
                      <TableCell>{alert.sportDisplayName}</TableCell>
                      <TableCell>{alert.subCategory}</TableCell>
                      <TableCell className="text-right">{alert.outOfRangeRate}%</TableCell>
                      <TableCell className="text-right">{alert.bmiGap.toFixed(2)}</TableCell>
                      <TableCell className="text-right">{alert.studentsCount}</TableCell>
                      <TableCell className="text-center">
                        <Button asChild size="sm">
                          <Link href={`/esportes/${alert.sportRoute}`}>
                            Esporte
                            <ArrowUpRight className="h-3.5 w-3.5" />
                          </Link>
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>

        <Card className="self-start">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BellRing className="h-4 w-4" />
              Resumo de ação da semana
            </CardTitle>
            <CardDescription>Três frentes com maior prioridade operacional.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {actionSummary.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                Sem frentes críticas no filtro atual.
              </p>
            ) : (
              actionSummary.map((alert, index) => (
                <div key={`${alert.sportName}-${alert.subCategory}`} className="rounded-lg border p-3">
                  <p className="text-sm font-semibold">
                    {index + 1}. {alert.sportDisplayName} • {alert.subCategory}
                  </p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    {alert.recommendation}
                  </p>
                </div>
              ))
            )}
          </CardContent>
        </Card>
      </section>
    </main>
  )
}
