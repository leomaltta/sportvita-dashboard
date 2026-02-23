'use client'

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { GraduationCap, LogOut, Trophy, Users, Wrench } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { signOut, useSession } from 'next-auth/react'

export default function UserProfile() {
  const { data: session } = useSession()
  const router = useRouter()

  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <Avatar className="hover:bg-accent">
          <AvatarImage src={session?.user.image ?? undefined} />
          <AvatarFallback>
            {(session?.user.name || 'SV').slice(0, 2).toUpperCase()}
          </AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="mr-3">
        <DropdownMenuLabel>
          <div className="flex flex-row items-center gap-2 font-medium">
            {session?.user.name}
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem
            onClick={() => {
              router.push('/estudantes')
            }}
            className="cursor-pointer"
          >
            <div className="flex flex-row items-center gap-2">
              <GraduationCap className="h-4 w-4" /> Estudantes
            </div>
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => {
              router.push('/professores')
            }}
            className="cursor-pointer"
          >
            <div className="flex flex-row items-center gap-2">
              <Users className="h-4 w-4" /> Professores
            </div>
          </DropdownMenuItem>
        </DropdownMenuGroup>
        {session?.user.role === 'admin' ? (
          <DropdownMenuItem
            onClick={() => {
              router.push('/admin')
            }}
            className="cursor-pointer"
          >
            <div className="flex flex-row items-center gap-2">
              <Wrench className="h-4 w-4" /> Painel
            </div>
          </DropdownMenuItem>
        ) : null}
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={() => {
            signOut({ callbackUrl: '/login' })
          }}
          className="cursor-pointer"
        >
          <div className="flex flex-row items-center gap-2">
            <LogOut className="h-4 w-4" /> Sair
          </div>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
