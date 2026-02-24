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
import { useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'

export default function SheetMenu() {
  const router = useRouter()
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
    <Sheet>
      <SheetTrigger asChild>
        <button aria-label="Abrir menu">
          <Menu className="h-8 w-8 cursor-pointer" />
        </button>
      </SheetTrigger>
      <SheetContent side="left">
        <SheetHeader className="px-2">
          <SheetTitle className="mb-1 ml-1 flex items-center gap-3 text-left text-2xl">
            <Image
              width={44}
              height={44}
              src="/logo.png"
              alt="SportVita Logo"
            />
            Sport Vita
          </SheetTitle>
        </SheetHeader>
        <Separator className="my-4" />
        <SheetClose asChild>
          <div className="my-4 flex flex-col gap-2 px-2">
            <Button
              className="w-full justify-start px-2 text-left text-lg font-normal"
              variant="link"
              onClick={() => router.push(dashboardHref)}
            >
              Início
            </Button>
            <Button
              className="w-full justify-start px-2 text-left text-lg font-normal"
              variant="link"
              onClick={() => router.push('/estudantes')}
            >
              Estudantes
            </Button>
            {isAdmin ? (
              <Button
                className="w-full justify-start px-2 text-left text-lg font-normal"
                variant="link"
                onClick={() => router.push('/alertas')}
              >
                Alertas
              </Button>
            ) : null}
            {isAdmin ? (
              <Button
                className="w-full justify-start px-2 text-left text-lg font-normal"
                variant="link"
                onClick={() => router.push('/professores')}
              >
                Professores
              </Button>
            ) : null}
            <Button
              className="w-full justify-start px-2 text-left text-lg font-normal"
              variant="link"
              onClick={() => router.push(sportsHref)}
            >
              {isAdmin ? 'Esportes' : 'Esporte'}
            </Button>
          </div>
        </SheetClose>
      </SheetContent>
    </Sheet>
  )
}
