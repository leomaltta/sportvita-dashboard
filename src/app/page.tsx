import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/[...nextauth]/options'
import Link from 'next/link'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import ContactForm from '@/components/landing/contact-form'
import HeroDashboardVisual from '@/components/landing/hero-dashboard-visual'
import {
  AlertTriangle,
  ArrowUpRight,
  CheckCircle2,
  Download,
  Filter,
  HeartPulse,
  LineChart,
  Layers,
  Lock,
  Rocket,
  MessageSquare,
  Mail,
  Linkedin,
  Github,
  PanelsTopLeft,
  Search,
  RefreshCw,
  School,
  ShieldCheck,
  SlidersHorizontal,
  Sparkles,
  FileCode2,
  Database,
  BarChart3,
  Users,
} from 'lucide-react'

function ThemeImage({
  lightSrc,
  darkSrc,
  alt,
  className,
  priority = false,
}: {
  lightSrc: string
  darkSrc: string
  alt: string
  className?: string
  priority?: boolean
}) {
  return (
    <>
      <Image
        src={lightSrc}
        alt={alt}
        width={1800}
        height={1000}
        priority={priority}
        className={`block dark:hidden ${className ?? ''}`}
      />
      <Image
        src={darkSrc}
        alt={alt}
        width={1800}
        height={1000}
        priority={priority}
        className={`hidden dark:block ${className ?? ''}`}
      />
    </>
  )
}

export default async function Home() {
  const session = await getServerSession(authOptions)
  const isAdmin = session?.user?.role === 'admin'
  const sportRoute = session?.user?.sportRoute
  const dashboardHref = isAdmin
    ? '/dashboard'
    : sportRoute
      ? `/dashboard/${sportRoute}`
      : '/denied'

  return (
    <main className="relative overflow-hidden">
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute -left-24 top-0 h-72 w-72 rounded-full bg-primary/10 blur-3xl" />
        <div className="absolute -right-20 top-[14%] h-80 w-80 rounded-full bg-darkblue/10 blur-3xl" />
        <div className="absolute left-[8%] top-[30%] h-64 w-64 rounded-full bg-primary/10 blur-3xl" />
        <div className="absolute right-[6%] top-[44%] h-72 w-72 rounded-full bg-darkblue/10 blur-3xl" />
        <div className="absolute left-[14%] top-[61%] h-80 w-80 rounded-full bg-primary/10 blur-3xl" />
        <div className="absolute -right-24 top-[76%] h-72 w-72 rounded-full bg-darkblue/10 blur-3xl" />
        <div className="absolute left-[10%] bottom-[6%] h-64 w-64 rounded-full bg-primary/10 blur-3xl" />
        <div className="absolute right-[12%] bottom-0 h-56 w-56 rounded-full bg-darkblue/10 blur-3xl" />
      </div>

      <div className="mx-auto flex min-h-screen w-full max-w-screen-2xl flex-col px-4 pb-16 pt-6 sm:px-6 lg:px-8">
        <header className="mb-10 flex items-center justify-between rounded-xl border bg-background/90 px-4 py-3 backdrop-blur sm:px-5">
          <div className="flex items-center gap-3">
            <Image src="/logo.png" alt="Sport Vita Logo" width={30} height={30} />
            <div>
              <p className="text-sm font-semibold tracking-wide">Sport Vita</p>
              <p className="text-xs text-muted-foreground">Inteligência em saúde escolar</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button asChild variant="ghost" className="hidden sm:inline-flex">
              <a
                href="https://github.com/leomaltta/sport-vita-dashboard-v1"
                target="_blank"
                rel="noreferrer"
              >
                Repositório
              </a>
            </Button>
            <Button asChild>
              <Link href={session ? dashboardHref : '/login'}>
                {session ? 'Dashboard' : 'Entrar'}
              </Link>
            </Button>
          </div>
        </header>

        <section className="grid items-center gap-8 py-4 lg:grid-cols-[1fr_1.18fr] lg:gap-10">
          <div className="space-y-5">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
              Monitoramento de saúde escolar em escala
            </p>
            <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl lg:text-6xl">
              Sua escola decide no escuro?{' '}
              <span className="text-primary">Oriente-se por dados. Proteja a saúde.</span>
            </h1>
            <p className="max-w-2xl text-base text-muted-foreground sm:text-lg">
              O Sport Vita organiza indicadores de saúde e performance por esporte em uma leitura
              clara para coordenação, professores e famílias. Menos planilha, menos ruído e mais
              ação pedagógica com base concreta.
            </p>
            <div className="flex flex-wrap items-center gap-3">
              <Button asChild size="lg">
                <Link href={session ? dashboardHref : '/login'}>
                  {session ? 'Ir para o dashboard' : 'Acessar a plataforma'}
                  <ArrowUpRight />
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg">
                <a href="#por-que-parceria">Por que virar parceiro?</a>
              </Button>
            </div>
          </div>

          <div className="hidden lg:block lg:pl-4">
            <HeroDashboardVisual />
          </div>
        </section>

        <section id="por-que-parceria" className="mt-12 space-y-5">
          <div className="space-y-2">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">
              Valor para a escola
            </p>
            <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">
              Por que uma instituição escolheria o{' '}
              <span className="text-primary">Sport Vita</span>
            </h2>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            <article className="rounded-xl border bg-card p-5">
              <div className="mb-3 inline-flex rounded-md bg-indigo-500/10 p-2 text-indigo-700 dark:text-indigo-400">
                <School className="h-4 w-4" />
              </div>
              <p className="text-base font-semibold">Mais clareza para coordenação</p>
              <p className="mt-1 text-sm text-muted-foreground">
                Panorama único da saúde esportiva por subcategoria, com foco em gestão escolar real.
              </p>
            </article>
            <article className="rounded-xl border bg-card p-5">
              <div className="mb-3 inline-flex rounded-md bg-emerald-500/10 p-2 text-emerald-600 dark:text-emerald-400">
                <HeartPulse className="h-4 w-4" />
              </div>
              <p className="text-base font-semibold">Acompanhamento com contexto</p>
              <p className="mt-1 text-sm text-muted-foreground">
                Não é só número de IMC. É leitura de tendência, risco e evolução por esporte.
              </p>
            </article>
            <article className="rounded-xl border bg-card p-5">
              <div className="mb-3 inline-flex rounded-md bg-sky-500/10 p-2 text-sky-700 dark:text-sky-400">
                <Users className="h-4 w-4" />
              </div>
              <p className="text-base font-semibold">Melhor conversa com famílias</p>
              <p className="mt-1 text-sm text-muted-foreground">
                Dados objetivos ajudam a orientar recomendações de prática esportiva com confiança.
              </p>
            </article>
          </div>
        </section>

        <section className="mt-12 space-y-6">
          <div className="space-y-2">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">
              Funcionalidades do produto
            </p>
            
          </div>

          <article className="grid items-center gap-6 overflow-hidden rounded-2xl border bg-card p-5 shadow-2xl lg:grid-cols-[0.95fr_1.05fr] lg:p-7">
            <div className="space-y-3">
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">
                1. Visão de modalidades
              </p>
              <h3 className="text-2xl font-semibold tracking-tight sm:text-3xl">
                Galeria de esportes com navegação clara 
              </h3>
              <p className="text-sm text-muted-foreground sm:text-base">
                Entrada visual direta para cada esporte, reduzindo fricção para coordenação e
                professores acessarem rapidamente os dados da modalidade desejada.
              </p>
              <div className="pt-2">
                <p className="flex items-start gap-2 rounded-md border bg-background px-3 py-2 text-xs text-muted-foreground">
                  <Lock className="mt-0.5 h-3.5 w-3.5 shrink-0 text-amber-600 dark:text-amber-400" />
                  <span>
                    Quando o login é de <strong className="text-foreground">professor</strong>, o
                    acesso fica restrito apenas ao esporte vinculado ao perfil. Demais modalidades
                    permanecem bloqueadas.
                  </span>
                </p>
              </div>
            </div>
            <div className="relative [perspective:1600px]">
              <div className="relative overflow-hidden rounded-xl shadow-xl lg:[transform:perspective(1600px)_rotateY(-6deg)_rotateX(2deg)]">
                <Image
                  src="/landing/gallery-sports.webp"
                  alt="Galeria de esportes do Sport Vita"
                  width={1800}
                  height={1000}
                  className="h-[340px] w-full rounded-xl object-contain lg:h-[380px]"
                />
                <div className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-background/80 to-transparent" />
              </div>
            </div>
          </article>

          <article className="grid items-center gap-8 rounded-2xl border bg-card px-5 py-7 shadow-xl lg:grid-cols-2 lg:px-8">
            <div className="space-y-3">
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">
                2. Decisão por modalidade
              </p>
              <h3 className="text-2xl font-semibold tracking-tight sm:text-3xl">
                Insights por esporte com profundidade real
              </h3>
              <p className="text-sm text-muted-foreground sm:text-base">
                Comparativo por subcategoria, intensidade e status para orientar recomendações mais
                assertivas para cada perfil de estudante.
              </p>
              <div className="w-full max-w-[31rem] rounded-xl border bg-gradient-to-b from-background to-muted/20 p-4 shadow-sm">
                <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
                  Como interpretar este painel
                </p>
                <p className="mt-2 text-sm text-muted-foreground">
                  Esta área existe para transformar dados técnicos em decisão pedagógica: a escola
                  enxerga o <strong className="text-foreground">estado atual</strong>, identifica
                  tendência por faixa etária e define prioridade de acompanhamento com base em
                  evidência.
                </p>
                <ul className="mt-3 space-y-2 text-xs text-muted-foreground sm:text-sm">
                  <li className="rounded-md border bg-background/90 px-3 py-2">
                    <p className="flex items-start gap-2">
                      <CheckCircle2 className="mt-0.5 h-3.5 w-3.5 shrink-0 text-emerald-600 dark:text-emerald-400" />
                      <span>
                        <strong className="text-foreground">Comparativo por subcategoria:</strong>{' '}
                        mostra como Sub-6, Sub-8, Sub-12, Sub-14 e Sub-17 respondem dentro do mesmo
                        esporte, evitando análises genéricas.
                      </span>
                    </p>
                  </li>
                  <li className="rounded-md border bg-background/90 px-3 py-2">
                    <p className="flex items-start gap-2">
                      <CheckCircle2 className="mt-0.5 h-3.5 w-3.5 shrink-0 text-emerald-600 dark:text-emerald-400" />
                      <span>
                        <strong className="text-foreground">Status de IMC por grupo:</strong> acelera
                        a leitura de risco e facilita a priorização de onde a intervenção deve
                        começar.
                      </span>
                    </p>
                  </li>
                  <li className="rounded-md border bg-background/90 px-3 py-2">
                    <p className="flex items-start gap-2">
                      <CheckCircle2 className="mt-0.5 h-3.5 w-3.5 shrink-0 text-emerald-600 dark:text-emerald-400" />
                      <span>
                        <strong className="text-foreground">Gráficos de gasto calórico:</strong> dão
                        contexto de intensidade da modalidade para orientar escolha esportiva de forma
                        educacional, equilibrando objetivo de saúde, idade da turma e capacidade de
                        cada grupo.
                      </span>
                    </p>
                  </li>
                  <li className="rounded-md border bg-background/90 px-3 py-2">
                    <p className="flex items-start gap-2">
                      <CheckCircle2 className="mt-0.5 h-3.5 w-3.5 shrink-0 text-emerald-600 dark:text-emerald-400" />
                      <span>
                        <strong className="text-foreground">Perfil do esporte:</strong> complementa os
                        dados com uma leitura educacional da modalidade, destacando músculos
                        predominantes, benefícios físicos/cognitivos e faixa etária recomendada para
                        início.
                      </span>
                    </p>
                  </li>
                </ul>
              </div>
            </div>
            <div className="relative grid gap-3 [perspective:1400px]">
              <div className="pointer-events-none absolute -inset-3 rounded-2xl bg-darkblue/10 blur-2xl" />
              <div className="relative overflow-hidden rounded-xl shadow-2xl transition-transform duration-500 lg:[transform:perspective(1400px)_rotateY(-10deg)_rotateX(2deg)] lg:hover:[transform:perspective(1400px)_rotateY(-6deg)_rotateX(1deg)]">
                <ThemeImage
                  lightSrc="/landing/1sportsinsights-light.webp"
                  darkSrc="/landing/1sportsinsights-dark.webp"
                  alt="Insights por esporte - visão 1"
                  className="h-auto w-full bg-muted/30 object-contain"
                />
              </div>
              <div className="relative overflow-hidden rounded-xl shadow-2xl transition-transform duration-500 lg:[transform:perspective(1400px)_rotateY(8deg)_rotateX(2deg)] lg:hover:[transform:perspective(1400px)_rotateY(4deg)_rotateX(1deg)]">
                <ThemeImage
                  lightSrc="/landing/1sportsinsights-2-light.webp"
                  darkSrc="/landing/1sportsinsights-2-dark.webp"
                  alt="Insights por esporte - visão 2"
                  className="h-auto w-full bg-muted/30 object-contain"
                />
              </div>
            </div>
          </article>

          <article className="grid items-center gap-8 rounded-2xl border bg-card px-5 py-7 shadow-xl lg:grid-cols-2 lg:px-8">
            <div className="order-2 relative [perspective:1400px] lg:order-1">
              <div className="pointer-events-none absolute -inset-3 rounded-2xl bg-primary/10 blur-2xl" />
              <div className="relative overflow-hidden rounded-xl shadow-2xl transition-transform duration-500 lg:[transform:perspective(1400px)_rotateY(14deg)_rotateX(3deg)] lg:hover:[transform:perspective(1400px)_rotateY(8deg)_rotateX(1deg)]">
                <ThemeImage
                  lightSrc="/landing/1alertspage-light.webp"
                  darkSrc="/landing/1alertspage-dark.webp"
                  alt="Alertas de saúde"
                  className="h-auto w-full object-contain"
                />
              </div>
            </div>
            <div className="order-1 space-y-3 lg:order-2">
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">
                3. Resposta rápida
              </p>
              <h3 className="text-2xl font-semibold tracking-tight sm:text-3xl">
                Alertas priorizados para ação imediata
              </h3>
              <p className="text-sm text-muted-foreground sm:text-base">
                A coordenação visualiza riscos por severidade e consegue organizar o acompanhamento
                semanal com foco nas turmas que realmente precisam de atenção.
              </p>
              <div className="grid gap-2 pt-1 sm:grid-cols-2">
                <p className="flex items-start gap-2 rounded-md border bg-background px-3 py-2 text-xs text-muted-foreground">
                  <Filter className="mt-0.5 h-3.5 w-3.5 shrink-0 text-sky-600 dark:text-sky-400" />
                  <span>
                    <strong className="text-foreground">Filtro dinâmico:</strong> combine esporte e
                    subcategoria para localizar rapidamente os alertas relevantes.
                  </span>
                </p>
                <p className="flex items-start gap-2 rounded-md border bg-background px-3 py-2 text-xs text-muted-foreground">
                  <Download className="mt-0.5 h-3.5 w-3.5 shrink-0 text-emerald-600 dark:text-emerald-400" />
                  <span>
                    <strong className="text-foreground">Exportação CSV:</strong> gere relatórios para
                    reuniões pedagógicas e acompanhamento externo.
                  </span>
                </p>
              </div>
            </div>
          </article>

          <article className="grid items-center gap-8 rounded-2xl border bg-card px-5 py-7 shadow-xl lg:grid-cols-[0.9fr_1.1fr] lg:px-8">
            <div className="space-y-3">
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">
                4. Operação diária
              </p>
              <h3 className="text-2xl font-semibold tracking-tight sm:text-3xl">
                Gestão de estudantes e professores em fluxo único
              </h3>
              <p className="text-sm text-muted-foreground sm:text-base">
                Cadastro, atualização, exclusão em lote e exportação CSV para dar velocidade à rotina
                administrativa sem perder rastreabilidade.
              </p>
              <div className="max-w-xl rounded-md border border-amber-300/60 bg-amber-50/70 px-3 py-2 text-xs leading-relaxed text-amber-800/90 dark:border-amber-900/70 dark:bg-amber-950/30 dark:text-amber-200/90">
                <p className="flex items-center gap-2">
                  <AlertTriangle className="h-4 w-4 shrink-0 text-amber-700 dark:text-amber-300" />
                  <span>
                    <strong>Aviso:</strong> na área de estudantes, os dados exibidos nesta demonstração
                    são artificiais e anonimizados, sem vínculo com pessoas reais, em respeito à
                    privacidade e às diretrizes da LGPD.
                  </span>
                </p>
              </div>
            </div>
            <div className="grid gap-4">
              <div className="relative [perspective:1400px]">
                <div className="relative overflow-hidden rounded-xl border shadow-2xl transition-transform duration-500 lg:[transform:perspective(1400px)_rotateY(-10deg)_rotateX(2deg)]">
                  <ThemeImage
                    lightSrc="/landing/1estudantes-table-light.webp"
                    darkSrc="/landing/1estudantes-table-dark.webp"
                    alt="Gestão de estudantes"
                    className="h-auto w-full object-contain"
                  />
                </div>
              </div>
              <div className="relative [perspective:1400px]">
                <div className="relative overflow-hidden rounded-xl border shadow-2xl transition-transform duration-500 lg:[transform:perspective(1400px)_rotateY(10deg)_rotateX(2deg)]">
                  <ThemeImage
                    lightSrc="/landing/1professores-table-dark.webp"
                    darkSrc="/landing/1professores-table-dark.webp"
                    alt="Gestão de professores"
                    className="h-auto w-full object-contain"
                  />
                </div>
              </div>
            </div>
          </article>
        </section>

        <section className="mt-12 grid gap-4 lg:grid-cols-3">
          <article className="rounded-xl border bg-card p-5 lg:col-span-2">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">
              Segurança e privacidade
            </p>
            <h3 className="mt-2 text-2xl font-semibold tracking-tight">
              Compromisso com dados sensíveis
            </h3>
            <p className="mt-2 text-sm text-muted-foreground">
              O Sport Vita foi estruturado para tratar dados em contexto escolar com responsabilidade.
              O acesso é segmentado por perfil e as operações sensíveis são validadas no servidor.
            </p>
            <div className="mt-4 grid gap-2 sm:grid-cols-2">
              <p className="flex items-start gap-2 rounded-md border bg-background px-3 py-2 text-sm">
                <Lock className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600 dark:text-emerald-400" />
                <span>Princípio de privilégio mínimo por perfil.</span>
              </p>
              <p className="flex items-start gap-2 rounded-md border bg-background px-3 py-2 text-sm">
                <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600 dark:text-emerald-400" />
                <span>Regras de acesso e escrita validadas no backend.</span>
              </p>
              <p className="flex items-start gap-2 rounded-md border bg-background px-3 py-2 text-sm">
                <Users className="mt-0.5 h-4 w-4 shrink-0 text-sky-600 dark:text-sky-400" />
                <span>Dados de demonstração anonimizados na apresentação pública.</span>
              </p>
              <p className="flex items-start gap-2 rounded-md border bg-background px-3 py-2 text-sm">
                <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-indigo-600 dark:text-indigo-400" />
                <span>Evolução contínua de boas práticas alinhadas à LGPD.</span>
              </p>
            </div>
          </article>

          <article className="rounded-xl border bg-card p-5">
            <div className="mb-2 inline-flex rounded-md bg-emerald-500/10 p-2 text-emerald-600 dark:text-emerald-400">
              <ShieldCheck className="h-4 w-4" />
            </div>
            <p className="text-base font-semibold">Governança e conformidade (LGPD)</p>
            <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
              <li className="flex items-start gap-2">
                <Lock className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600 dark:text-emerald-400" />
                Autenticação e autorização baseadas em perfil.
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600 dark:text-emerald-400" />
                Fluxos administrativos com rastreabilidade auditável.
              </li>
              <li className="flex items-start gap-2">
                <Sparkles className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600 dark:text-emerald-400" />
                Tratamento de informações de sáude com finalidade educacional.
              </li>
            </ul>
          </article>
        </section>

        <section className="mt-12 grid gap-4 lg:grid-cols-3">
          <article className="rounded-xl border bg-card p-5 lg:col-span-2">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">
              Plataforma adaptável
            </p>
            <h3 className="mt-2 text-2xl font-semibold tracking-tight">
              Personalização conforme a necessidade da escola
            </h3>
            <p className="mt-2 text-sm text-muted-foreground">
              O Sport Vita é modular: a implantação pode evoluir por prioridade pedagógica e operação
              interna de cada instituição, sem travar a escola em um pacote fixo.
            </p>
            <div className="mt-4 grid gap-3 sm:grid-cols-3">
              <div className="rounded-md border bg-background px-3 py-3 text-sm text-muted-foreground">
                <p className="mb-1 flex items-center gap-2 font-semibold text-foreground">
                  <Layers className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                  Ativação por fases
                </p>
                <p>Indicadores, alertas, relatórios e acompanhamento no ritmo da escola.</p>
              </div>
              <div className="rounded-md border bg-background px-3 py-3 text-sm text-muted-foreground">
                <p className="mb-1 flex items-center gap-2 font-semibold text-foreground">
                  <SlidersHorizontal className="h-4 w-4 text-sky-600 dark:text-sky-400" />
                  Regras e painéis
                </p>
                <p>Ajuste de filtros, regras de leitura e visão conforme estrutura pedagógica.</p>
              </div>
              <div className="rounded-md border bg-background px-3 py-3 text-sm text-muted-foreground">
                <p className="mb-1 flex items-center gap-2 font-semibold text-foreground">
                  <RefreshCw className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
                  Evolução contínua
                </p>
                <p>Novas funções definidas com coordenação e gestão ao longo da operação.</p>
              </div>
            </div>
          </article>

          <article className="rounded-xl border bg-card p-5">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">
              Stack atual
            </p>
            <h3 className="mt-2 text-xl font-semibold tracking-tight">
              Base técnica preparada para operação em escala grande
            </h3>
            <div className="mt-4 grid gap-2">
              <p className="flex items-center gap-2 rounded-md border bg-background px-3 py-2 text-sm">
                <PanelsTopLeft className="h-4 w-4 shrink-0 text-slate-700 dark:text-slate-300" />
                <span>Next.js 16 (App Router)</span>
              </p>
              <p className="flex items-center gap-2 rounded-md border bg-background px-3 py-2 text-sm">
                <FileCode2 className="h-4 w-4 shrink-0 text-sky-600 dark:text-sky-400" />
                <span>TypeScript + NextAuth</span>
              </p>
              <p className="flex items-center gap-2 rounded-md border bg-background px-3 py-2 text-sm">
                <Database className="h-4 w-4 shrink-0 text-emerald-600 dark:text-emerald-400" />
                <span>PostgreSQL + Prisma</span>
              </p>
              <p className="flex items-center gap-2 rounded-md border bg-background px-3 py-2 text-sm">
                <BarChart3 className="h-4 w-4 shrink-0 text-indigo-600 dark:text-indigo-400" />
                <span>Tailwind + shadcn/ui + Recharts</span>
              </p>
            </div>
          </article>
        </section>

        <section className="mt-12 overflow-hidden rounded-2xl border bg-card p-6 sm:p-8">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">
            Parceria institucional
          </p>
          <h2 className="mt-2 text-3xl font-semibold tracking-tight">
            Leve o Sport Vita para sua escola com um plano de implantação claro
          </h2>
          <p className="mt-2 max-w-3xl text-sm text-muted-foreground sm:text-base">
            Nossa proposta é construir um piloto com começo, meio e resultado mensurável para a
            coordenação. Sem projeto aberto demais e sem complexidade desnecessária.
          </p>

          <div className="mt-6 grid gap-4 lg:grid-cols-2">
            <div className="rounded-xl border bg-background p-4 sm:p-5">
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">
                Modelo de parceria
              </p>
              <ul className="mt-3 space-y-2.5 text-sm text-muted-foreground">
                <li className="rounded-md border bg-card px-3.5 py-2.5">
                  <div className="grid grid-cols-[auto_1fr] items-start gap-2">
                    <Search className="mt-0.5 h-4 w-4 shrink-0 text-sky-600 dark:text-sky-400" />
                    <span className="block leading-relaxed">
                      <strong className="text-foreground">Diagnóstico:</strong> mapeamento dos
                      esportes, subcategorias e rotina operacional atual.
                    </span>
                  </div>
                </li>
                <li className="rounded-md border bg-card px-3.5 py-2.5">
                  <div className="grid grid-cols-[auto_1fr] items-start gap-2">
                    <Rocket className="mt-0.5 h-4 w-4 shrink-0 text-indigo-600 dark:text-indigo-400" />
                    <span className="block leading-relaxed">
                      <strong className="text-foreground">Implantação guiada:</strong> setup da
                      operação e treinamento de uso para coordenação e professores.
                    </span>
                  </div>
                </li>
                <li className="rounded-md border bg-card px-3.5 py-3">
                  <div className="grid grid-cols-[auto_1fr] items-start gap-2">
                    <LineChart className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600 dark:text-emerald-400" />
                    <span className="block leading-relaxed">
                      <strong className="text-foreground">Acompanhamento:</strong> leitura semanal
                      de alertas e suporte para evolução contínua do processo.
                    </span>
                  </div>
                </li>
              </ul>
            </div>

            <div className="rounded-xl border bg-background p-4 sm:p-5">
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">
                Entrega para a gestão
              </p>
              <div className="mt-3 grid gap-2.5 sm:grid-cols-2">
                <div className="rounded-md border bg-card px-3.5 py-3">
                  <p className="flex items-center gap-2 text-sm font-semibold leading-tight">
                    <PanelsTopLeft className="h-4 w-4 shrink-0 text-slate-700 dark:text-slate-300" />
                    Visão executiva
                  </p>
                  <p className="mt-1.5 text-xs leading-relaxed text-muted-foreground">
                    Visão consolidada de desempenho por esporte e subcategoria.
                  </p>
                </div>
                <div className="rounded-md border bg-card px-3.5 py-3">
                  <p className="flex items-center gap-2 text-sm font-semibold leading-tight">
                    <Layers className="h-4 w-4 shrink-0 text-indigo-600 dark:text-indigo-400" />
                    Base para escala
                  </p>
                  <p className="mt-1.5 text-xs leading-relaxed text-muted-foreground">
                    Arquitetura modular preparada para expansão institucional.
                  </p>
                </div>
                <div className="rounded-md border bg-card px-3.5 py-2.5">
                  <p className="flex items-center gap-2 text-sm font-semibold leading-tight">
                    <Lock className="h-4 w-4 shrink-0 text-emerald-600 dark:text-emerald-400" />
                    Governança de acesso
                  </p>
                  <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
                    Controle de acesso segmentado por perfil (RBAC).
                  </p>
                </div>
                <div className="rounded-md border bg-card px-3.5 py-2.5">
                  <p className="flex items-center gap-2 text-sm font-semibold leading-tight">
                    <AlertTriangle className="h-4 w-4 shrink-0 text-amber-600 dark:text-amber-400" />
                    Priorização de risco
                  </p>
                  <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
                    Fila de alertas para tomada de decisão rápida.
                  </p>
                </div>
                <div className="rounded-md border bg-card px-3.5 py-3 sm:col-span-2">
                  <p className="flex items-center gap-2 text-sm font-semibold leading-tight">
                    <SlidersHorizontal className="h-4 w-4 shrink-0 text-sky-600 dark:text-sky-400" />
                    Personalização institucional
                  </p>
                  <p className="mt-1.5 text-xs leading-relaxed text-muted-foreground">
                    Regras, relatórios e parâmetros ajustáveis à realidade operacional de cada
                    instituição.
                  </p>
                </div>
              </div>
            </div>
          </div>

        </section>

        <section id="contato-parceria" className="mt-12 grid gap-4 lg:grid-cols-2">
          <article className="rounded-xl border bg-card p-6">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">
              Contato
            </p>
            <h3 className="mt-2 text-2xl font-semibold tracking-tight">
              Fale conosco sobre parceria e evolução do produto
            </h3>
            <p className="mt-2 text-sm text-muted-foreground">
              Use o formulário para conversar sobre implementação, piloto ou colaboração.
            </p>
            <div className="mt-6 space-y-3 text-sm">
              <p className="flex items-start gap-2 rounded-md border bg-background px-3 py-2">
                <MessageSquare className="mt-0.5 h-4 w-4 shrink-0 text-slate-700 dark:text-slate-300" />
                <span>
                  <strong>Canal:</strong> formulário desta página
                </span>
              </p>
              <p className="flex items-start gap-2 rounded-md border bg-background px-3 py-2">
                <Mail className="mt-0.5 h-4 w-4 shrink-0 text-sky-600 dark:text-sky-400" />
                <span>
                  <strong>E-mail:</strong>{' '}
                  <a
                    href="mailto:leonardo.maltta@icloud.com"
                    target="_blank"
                    rel="noreferrer"
                    className="underline decoration-muted-foreground/50 underline-offset-4 hover:text-foreground"
                  >
                    leonardo.maltta@icloud.com
                  </a>
                </span>
              </p>
              <p className="flex items-start gap-2 rounded-md border bg-background px-3 py-2">
                <Linkedin className="mt-0.5 h-4 w-4 shrink-0 text-indigo-600 dark:text-indigo-400" />
                <span>
                  <strong>LinkedIn:</strong>{' '}
                  <a
                    href="https://www.linkedin.com/in/leonardomaltta/"
                    target="_blank"
                    rel="noreferrer"
                    className="underline decoration-muted-foreground/50 underline-offset-4 hover:text-foreground"
                  >
                    linkedin.com/in/leonardomaltta
                  </a>
                </span>
              </p>
              <p className="flex items-start gap-2 rounded-md border bg-background px-3 py-2">
                <Github className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600 dark:text-emerald-400" />
                <span>
                  <strong>GitHub:</strong>{' '}
                  <a
                    href="https://github.com/leomaltta"
                    target="_blank"
                    rel="noreferrer"
                    className="underline decoration-muted-foreground/50 underline-offset-4 hover:text-foreground"
                  >
                    github.com/leomaltta
                  </a>
                </span>
              </p>
            </div>
          </article>

          <article className="rounded-xl border bg-card p-6">
            <p className="mb-3 text-sm font-semibold">Envie sua mensagem</p>
            <ContactForm />
          </article>
        </section>
      </div>
    </main>
  )
}
