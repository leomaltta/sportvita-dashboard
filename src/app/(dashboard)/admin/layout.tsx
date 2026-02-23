import { getServerSession } from 'next-auth'
import { redirect } from 'next/navigation'
import { authOptions } from '@/app/api/auth/[...nextauth]/options'
import { SidebarNav } from '@/components/navs/sidebar-nav'

const sidebarNavItems = [
  {
    title: 'Perfil',
    href: '/admin',
  },
  {
    title: 'Adicionar Estudante',
    href: '/admin/estudante',
  },
  {
    title: 'Adicionar Professor',
    href: '/admin/professor',
  },
]

export default async function SettingsLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await getServerSession(authOptions)

  if (!session) {
    redirect('/login')
  }

  if (session.user.role !== 'admin') {
    redirect('/denied')
  }

  return (
    <main className="space-y-6 p-5">
      <div className="space-y-0.5">
        <h2 className="text-2xl font-bold tracking-tight">Painel Administrativo</h2>
        <p className="text-muted-foreground">
          Gerencie o perfil administrativo e os cadastros da plataforma.
        </p>
      </div>
      <div className="space-y-6 lg:grid lg:grid-cols-[250px_1fr] lg:gap-8 lg:space-y-0">
        <aside>
          <SidebarNav items={sidebarNavItems} />
        </aside>
        <div className="flex-1 lg:max-w-3xl">{children}</div>
      </div>
    </main>
  )
}
