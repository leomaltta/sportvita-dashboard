'use client'

import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useSession } from 'next-auth/react'
import { cn } from '@/lib/utils'
import { ModeToggle } from '@/components/ui/mode-toggle'
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

  return (
    <header className="mx-auto my-2 flex w-full max-w-[40rem] items-center justify-between p-3 md:grid md:max-w-screen-2xl md:grid-cols-[1fr_auto_1fr] md:items-center lg:max-w-[90rem]">
      <div className="flex md:hidden">
        <div className="relative mx-5 flex items-center">
          <SheetMenu />
        </div>
      </div>

      <div className="hidden items-center justify-start pl-2 md:flex">
        <Image width={42} height={42} src="/logo.png" alt="Logo SportVita" />
      </div>

      <nav className="hidden items-center justify-center gap-4 text-base md:flex lg:gap-6">
        <Link
          className={cn(
            pathname.startsWith('/dashboard')
              ? 'font-semibold text-foreground'
              : 'font-normal text-muted-foreground transition-colors hover:text-foreground',
          )}
          href={dashboardHref}
        >
          Início
        </Link>
        <Link
          className={cn(
            pathname.startsWith('/estudantes')
              ? 'font-semibold text-foreground'
              : 'font-normal text-muted-foreground transition-colors hover:text-foreground',
          )}
          href="/estudantes"
        >
          Estudantes
        </Link>
        {isAdmin ? (
          <Link
            className={cn(
              pathname.startsWith('/professores')
                ? 'font-semibold text-foreground'
                : 'font-normal text-muted-foreground transition-colors hover:text-foreground',
            )}
            href="/professores"
          >
            Professores
          </Link>
        ) : null}
        <Link
          className={cn(
            pathname.startsWith('/esportes')
              ? 'font-semibold text-foreground'
              : 'font-normal text-muted-foreground transition-colors hover:text-foreground',
          )}
          href={sportsHref}
        >
          {isAdmin ? 'Esportes' : 'Esporte'}
        </Link>
      </nav>

      <div className="flex items-center gap-6 pr-5 md:justify-end md:pr-2">
        <ModeToggle />
        <UserProfile />
      </div>
    </header>
  )
}
