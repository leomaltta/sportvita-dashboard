'use client'

import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useSession } from 'next-auth/react'
import { cn } from '@/lib/utils'
import SheetMenu from './menu'
import UserProfile from './user-profile'

export default function Header() {
  const pathname = usePathname()
  const { data: session } = useSession()
  const isAdmin = session?.user.role === 'admin'
  const sportRoute = session?.user.sportRoute
  const dashboardHref = isAdmin
    ? '/dashboard'
    : sportRoute
      ? `/dashboard/${sportRoute}`
      : '/denied'
  const sportsHref = isAdmin
    ? '/esportes'
    : sportRoute
      ? `/esportes/${sportRoute}`
      : '/denied'
  const navItems = [
    { label: 'Início', href: dashboardHref, active: pathname.startsWith('/dashboard') },
    {
      label: isAdmin ? 'Esportes' : 'Esporte',
      href: sportsHref,
      active: pathname.startsWith('/esportes'),
    },
    ...(isAdmin
      ? [{ label: 'Alertas', href: '/alertas', active: pathname.startsWith('/alertas') }]
      : []),
    { label: 'Estudantes', href: '/estudantes', active: pathname.startsWith('/estudantes') },
    ...(isAdmin
      ? [
          {
            label: 'Professores',
            href: '/professores',
            active: pathname.startsWith('/professores'),
          },
        ]
      : []),
  ]

  return (
    <header className="mx-auto w-full max-w-screen-2xl px-4 pt-3 sm:px-6 lg:px-8">
      <div className="flex h-16 items-center rounded-xl border bg-background/90 px-3 shadow-sm backdrop-blur md:px-4">
        <div className="flex items-center md:hidden">
          <SheetMenu />
        </div>

        <div className="hidden items-center gap-3 md:flex">
          <Image width={34} height={34} src="/logo.png" alt="Logo SportVita" />
          <div className="leading-tight">
            <p className="text-sm font-semibold tracking-wide text-foreground">Sport Vita</p>
            <p className="text-xs text-muted-foreground">Dashboard</p>
          </div>
        </div>

        <div className="hidden flex-1 justify-center md:flex">
          <nav className="inline-flex items-center rounded-lg border bg-muted/35 p-1">
            {navItems.map((item) => (
              <Link
                key={`${item.label}-${item.href}`}
                href={item.href}
                className={cn(
                  'rounded-md px-3 py-1.5 text-sm transition-colors',
                  item.active
                    ? 'bg-background font-semibold text-foreground shadow-sm'
                    : 'font-normal text-muted-foreground hover:text-foreground',
                )}
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </div>

        <div className="ml-auto flex items-center gap-2 md:gap-3">
          <UserProfile />
        </div>
      </div>
    </header>
  )
}
