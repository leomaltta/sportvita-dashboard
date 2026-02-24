'use client'

import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet'
import { Separator } from '@/components/ui/separator'
import { Button } from '@/components/ui/button'
import { Menu } from 'lucide-react'
import Image from 'next/image'
import { usePathname, useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'
import { cn } from '@/lib/utils'

export default function SheetMenu() {
  const router = useRouter()
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
    { label: 'Estudantes', href: '/estudantes', active: pathname.startsWith('/estudantes') },
    ...(isAdmin
      ? [{ label: 'Alertas', href: '/alertas', active: pathname.startsWith('/alertas') }]
      : []),
    ...(isAdmin
      ? [
          {
            label: 'Professores',
            href: '/professores',
            active: pathname.startsWith('/professores'),
          },
        ]
      : []),
    {
      label: isAdmin ? 'Esportes' : 'Esporte',
      href: sportsHref,
      active: pathname.startsWith('/esportes'),
    },
  ]

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" aria-label="Abrir menu">
          <Menu className="h-6 w-6" />
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-[300px]">
        <SheetHeader className="px-3">
          <SheetTitle className="mb-1 flex items-center gap-3 text-left text-xl">
            <Image
              width={34}
              height={34}
              src="/logo.png"
              alt="SportVita Logo"
            />
            <span className="tracking-wide">Sport Vita</span>
          </SheetTitle>
        </SheetHeader>
        <Separator className="my-4" />
        <SheetClose asChild>
          <div className="my-2 flex flex-col gap-1.5 px-3">
            {navItems.map((item) => (
              <Button
                key={item.href}
                className={cn(
                  'w-full justify-start rounded-md px-3 text-left text-sm',
                  item.active
                    ? 'bg-accent font-semibold text-foreground hover:bg-accent'
                    : 'font-normal text-muted-foreground hover:text-foreground',
                )}
                variant="ghost"
                onClick={() => router.push(item.href)}
              >
                {item.label}
              </Button>
            ))}
          </div>
        </SheetClose>
      </SheetContent>
    </Sheet>
  )
}
