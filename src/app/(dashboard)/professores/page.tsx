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
    <main className="mx-auto flex min-h-screen w-full max-w-screen-2xl flex-col gap-6 px-4 pb-8 pt-8 sm:px-6 lg:px-8">
      <section className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div className="space-y-2">
          <h1 className="text-3xl font-semibold tracking-tight lg:text-4xl">
            Professores
          </h1>
          <p className="text-sm text-muted-foreground">
            Gerencie os professores do sistema
          </p>
        </div>
        <TeacherDialog mode="create" sports={sports}>
          <Button className="self-start">
            <Plus className="mr-2 h-4 w-4" />
            Adicionar Professor(a)
          </Button>
        </TeacherDialog>
      </section>

      <section>
        <TeachersTable teachers={teachers as TeacherWithSport[]} sports={sports} />
      </section>
    </main>
  )
}
