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

export default function SheetMenu() {
  const router = useRouter()

  return (
    <Sheet>
      <SheetTrigger asChild>
        <button aria-label="Abrir menu">
          <Menu className="h-8 w-8 cursor-pointer" />
        </button>
      </SheetTrigger>
      <SheetContent side="left">
        <SheetHeader>
          <SheetTitle className="mb-1 ml-2 flex items-center gap-3 text-left text-2xl">
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
          <div className="my-5 ml-3 flex flex-col gap-5 text-xl">
            <Button
              className="w-[5rem] text-left text-xl font-normal"
              variant="link"
              onClick={() => router.push('/dashboard')}
            >
              Início
            </Button>
            <Button
              className="w-[6rem] text-left text-xl font-normal"
              variant="link"
              onClick={() => router.push('/alunos')}
            >
              Alunos
            </Button>
            <Button
              className="w-[9rem] text-left text-xl font-normal"
              variant="link"
              onClick={() => router.push('/professores')}
            >
              Professores
            </Button>
            <Button
              className="w-[8rem] text-left text-xl font-normal"
              variant="link"
              onClick={() => router.push('/esportes')}
            >
              Esportes
            </Button>
          </div>
        </SheetClose>
      </SheetContent>
    </Sheet>
  )
}
