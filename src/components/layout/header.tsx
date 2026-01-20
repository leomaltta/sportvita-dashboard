'use client'

import { signOut } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { ModeToggle } from '@/components/ui/mode-toggle'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { LogOut, User, Settings } from 'lucide-react'
import { getInitials } from '@/lib/utils'

interface HeaderProps {
  user: {
    name?: string | null
    email?: string | null
    role?: string
  }
}

export default function Header({ user }: HeaderProps) {
  const router = useRouter()


  const handleLogout = async () => {
    await signOut({ redirect: false })
    router.push('/login')
    router.refresh()
  }

  return (
    <header className="flex h-16 items-center justify-between border-b border-gray-200 bg-white px-6 dark:border-gray-700 dark:bg-gray-800">

      <div className="flex items-center gap-4">
        <h1 className="text-xl font-semibold text-gray-900 dark:text-white">

        </h1>
      </div>

      <div className="flex items-center gap-4">

        <ModeToggle />


        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="relative h-10 w-10 rounded-full">
              <Avatar>
                <AvatarFallback className="bg-logoGreen text-white">
                  {getInitials(user.name || 'User')}
                </AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56" align="end">
            <DropdownMenuLabel>
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium leading-none">
                  {user.name || 'Usuário'}
                </p>
                <p className="text-xs leading-none text-muted-foreground">
                  {user.email}
                </p>
                <p className="text-xs leading-none text-muted-foreground">
                  {user.role === 'admin' ? 'Administrador' : 'Professor'}
                </p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem disabled>
              <User className="mr-2 h-4 w-4" />
              <span>Perfil</span>
            </DropdownMenuItem>
            <DropdownMenuItem disabled>
              <Settings className="mr-2 h-4 w-4" />
              <span>Configurações</span>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleLogout}>
              <LogOut className="mr-2 h-4 w-4" />
              <span>Sair</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  )
}