import { Metadata } from 'next'
import { getAllTeachers } from '@/lib/actions/teachers'
import TeachersTable from '@/components/teachers/teachers-table'
import TeacherDialog from '@/components/teachers/teacher-dialog'
import { Button } from '@/components/ui/button'
import { Plus } from 'lucide-react'
import prisma from '../../../../prisma/client'
import { TeacherWithSport } from '@/types'

export const metadata: Metadata = {
  title: 'Professores | Sport Vita',
  description: 'Gerenciar professores',
}

async function getSportsOptions() {
  return prisma.sport.findMany({
    orderBy: { alterName: 'asc' },
    select: {
      id: true,
      alterName: true,
    },
  })
}

export default async function TeachersPage() {
  const [teachers, sports] = await Promise.all([getAllTeachers(), getSportsOptions()])

  return (
    <div className="m-3 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Professores
          </h1>
          <p className="mt-2 text-gray-600 dark:text-gray-400">
            Gerencie os professores do sistema
          </p>
        </div>
        <TeacherDialog mode="create" sports={sports}>
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Adicionar Professor(a)
          </Button>
        </TeacherDialog>
      </div>

      <TeachersTable teachers={teachers as TeacherWithSport[]} sports={sports} />
    </div>
  )
}
