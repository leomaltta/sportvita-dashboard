
import { Metadata } from 'next'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { ShieldX, Home } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Acesso Negado | Sport Vita Dashboard',
  description: 'Você não tem permissão para acessar esta página',
}


export default function DeniedPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 px-4 dark:from-gray-900 dark:to-gray-800">
      <div className="text-center">
        {/* Icon */}
        <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-red-100 dark:bg-red-900/20">
          <ShieldX className="h-12 w-12 text-red-600 dark:text-red-400" />
        </div>

        <h1 className="mt-6 text-4xl font-bold tracking-tight text-gray-900 dark:text-white">
          Acesso Negado
        </h1>

        <p className="mt-4 text-lg text-gray-600 dark:text-gray-400">
          Você não tem permissão para acessar esta página.
        </p>
        <p className="mt-2 text-sm text-gray-500 dark:text-gray-500">
          Entre em contato com o administrador se você acredita que isso é um
          erro.
        </p>

        <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:justify-center">
          <Button asChild>
            <Link href="/dashboard">
              <Home className="mr-2 h-4 w-4" />
              Voltar ao Dashboard
            </Link>
          </Button>
          <Button variant="outline" asChild>
            <Link href="/login">Fazer Logout</Link>
          </Button>
        </div>
      </div>
    </div>
  )
}