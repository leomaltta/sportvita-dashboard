
import { Metadata } from 'next'
import { getServerSession } from 'next-auth'
import { redirect } from 'next/navigation'
import { getStudentsWithBMI } from '@/lib/actions/students'
import StudentsTable from '@/components/students/students-table'
import StudentDialog from '@/components/students/student-dialog'
import { Button } from '@/components/ui/button'
import { Plus } from 'lucide-react'
import { authOptions } from '@/app/api/auth/[...nextauth]/options'
import prisma from '../../../../prisma/client'

export const metadata: Metadata = {
  title: 'Estudantes | Sport Vita',
  description: 'Gerenciar estudantes atletas',
}


export default async function StudentsPage() {
  const session = await getServerSession(authOptions)

  if (!session) {
    redirect('/login')
  }

  let students = await getStudentsWithBMI()

  if (session.user.role === 'prof') {
    const teacher = await prisma.teacher.findFirst({
      where: { email: session.user.email ?? '' },
      include: {
        sport: {
          select: { name: true },
        },
      },
    })

    students = students.filter(
      (student) => student.sportName === teacher?.sport.name,
    )
  }

  const canManage = session.user.role === 'admin'

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-screen-2xl flex-col gap-6 px-4 pb-8 pt-8 sm:px-6 lg:px-8">
      <section className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div className="space-y-2">
          <h1 className="text-3xl font-semibold tracking-tight lg:text-4xl">
            Estudantes
          </h1>
          <p className="text-sm text-muted-foreground">
            Gerencie os estudantes atletas do sistema
          </p>
        </div>
        {canManage ? (
          <StudentDialog mode="create">
            <Button className="self-start">
              <Plus className="mr-2 h-4 w-4" />
              Adicionar Estudante
            </Button>
          </StudentDialog>
        ) : null}
      </section>

      <section>
        <StudentsTable students={students} canManage={canManage} />
      </section>
    </main>
  )
}
