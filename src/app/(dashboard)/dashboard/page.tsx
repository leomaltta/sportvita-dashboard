import { Metadata } from 'next'
import Link from 'next/link'
import { Card, CardContent } from '@/components/ui/card'
import { Trophy } from 'lucide-react'
import prisma from '../../../../prisma/client'

export const metadata: Metadata = {
  title: 'Dashboard | Sport Vita',
  description: 'Visão geral dos esportes',
}

async function getSports() {
  try {
    return await prisma.sport.findMany({
      orderBy: { name: 'asc' },
    })
  } catch (error) {
    console.error('Error fetching sports:', error)
    return []
  }
}

export default async function DashboardPage() {
  const sports = await getSports()

  return (
    <div className="space-y-6">

      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Dashboard
        </h1>
        <p className="mt-2 text-gray-600 dark:text-gray-400">
          Selecione um esporte para visualizar detalhes
        </p>
      </div>


      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {sports.map((sport) => (
          <Link
            key={sport.id}
            href={`/dashboard/${sport.route}`}
            className="group"
          >
            <Card className="overflow-hidden transition-all hover:shadow-lg">
              <div
                className="relative h-48 bg-cover bg-center"
                style={{
                  backgroundImage: `url(${sport.imageUrl})`,
                }}
              >
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                <div className="absolute bottom-4 left-4 right-4">
                  <h3 className="text-2xl font-bold text-white">
                    {sport.alterName}
                  </h3>
                </div>
              </div>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    Ver detalhes
                  </span>
                  <Trophy className="h-5 w-5 text-logoGreen" />
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>


      {sports.length === 0 && (
        <Card className="p-12">
          <div className="text-center">
            <Trophy className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-4 text-lg font-medium text-gray-900 dark:text-white">
              Nenhum esporte encontrado
            </h3>
            <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
              Execute o seed do banco de dados para adicionar esportes
            </p>
          </div>
        </Card>
      )}
    </div>
  )
}