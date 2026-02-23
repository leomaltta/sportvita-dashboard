
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
    <div className="m-3 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Estudantes
          </h1>
          <p className="mt-2 text-gray-600 dark:text-gray-400">
            Gerencie os estudantes atletas do sistema
          </p>
        </div>
        {canManage ? (
          <StudentDialog mode="create">
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Adicionar Estudante
            </Button>
          </StudentDialog>
        ) : null}
      </div>
      <StudentsTable students={students} canManage={canManage} />
    </div>
  )
}
