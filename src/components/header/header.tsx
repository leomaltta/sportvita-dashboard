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
    <header className="mx-auto my-2 flex w-full max-w-[40rem] justify-between p-3 md:max-w-screen-2xl lg:max-w-[90rem]">
      <div className="flex md:hidden">
        <div className="relative mx-5 flex items-center">
          <SheetMenu />
        </div>
      </div>

      <div className="mx-5 hidden md:flex md:gap-10">
        <div className="hidden items-center gap-2 pl-2 md:flex">
          <Image width={42} height={42} src="/logo.png" alt="Logo SportVita" />
        </div>
        <div className="mr-12 hidden items-center gap-4 text-base font-medium md:flex lg:gap-6">
          <Link
            className={cn(
              pathname.startsWith('/dashboard')
                ? 'text-foreground'
                : 'text-muted-foreground transition-colors hover:text-foreground',
            )}
            href={dashboardHref}
          >
            Início
          </Link>
          <Link
            className={cn(
              pathname.startsWith('/estudantes')
                ? 'text-foreground'
                : 'text-muted-foreground transition-colors hover:text-foreground',
            )}
            href="/estudantes"
          >
            Estudantes
          </Link>
          {isAdmin ? (
            <Link
              className={cn(
                pathname.startsWith('/professores')
                  ? 'text-foreground'
                  : 'text-muted-foreground transition-colors hover:text-foreground',
              )}
              href="/professores"
            >
              Professores
            </Link>
          ) : null}
          <Link
            className={cn(
              pathname.startsWith('/esportes')
                ? 'text-foreground'
                : 'text-muted-foreground transition-colors hover:text-foreground',
            )}
            href={sportsHref}
          >
            {isAdmin ? 'Esportes' : 'Esporte'}
          </Link>
        </div>
      </div>

      <div className="flex items-center gap-6 pr-5">
        <ModeToggle />
        <UserProfile />
      </div>
    </header>
  )
}
