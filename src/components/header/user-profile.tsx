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
import { Globe, GraduationCap, LayoutDashboard, LogOut, Trophy, Users, Wrench } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { signOut, useSession } from 'next-auth/react'

export default function UserProfile() {
  const { data: session } = useSession()
  const router = useRouter()
  const isAdmin = session?.user.role === 'admin'
  const sportRoute = session?.user.sportRoute
  const shortName =
    session?.user.name
      ?.trim()
      .split(/\s+/)
      .slice(0, 2)
      .join(' ') || 'SV'
  const professorDashboardPath = sportRoute ? `/dashboard/${sportRoute}` : '/denied'
  const professorSportPath = sportRoute ? `/esportes/${sportRoute}` : '/denied'

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
            {shortName}
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          {isAdmin ? (
            <>
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
            </>
          ) : (
            <>
              <DropdownMenuItem
                onClick={() => {
                  router.push(professorDashboardPath)
                }}
                className="cursor-pointer"
              >
                <div className="flex flex-row items-center gap-2">
                  <LayoutDashboard className="h-4 w-4" /> Meu Dashboard
                </div>
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => {
                  router.push(professorSportPath)
                }}
                className="cursor-pointer"
              >
                <div className="flex flex-row items-center gap-2">
                  <Trophy className="h-4 w-4" /> Meu Esporte
                </div>
              </DropdownMenuItem>
            </>
          )}
        </DropdownMenuGroup>
        {isAdmin ? (
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
            router.push('/')
          }}
          className="cursor-pointer"
        >
          <div className="flex flex-row items-center gap-2">
            <Globe className="h-4 w-4" /> Apresentação
          </div>
        </DropdownMenuItem>
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
