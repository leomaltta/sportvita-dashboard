import { Metadata } from 'next'
import { getStudentsWithBMI } from '@/lib/actions/students'
import StudentsTable from '@/components/students/students-table'
import StudentDialog from '@/components/students/student-dialog'
import { Button } from '@/components/ui/button'
import { Plus } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Estudantes | Sport Vita',
  description: 'Gerenciar estudantes atletas',
}


export default async function StudentsPage() {
  const students = await getStudentsWithBMI()
  return (
    <div className="space-y-6">

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Estudantes
          </h1>
          <p className="mt-2 text-gray-600 dark:text-gray-400">
            Gerencie os estudantes atletas do sistema
          </p>
        </div>
        <StudentDialog mode="create">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Adicionar Estudante
          </Button>
        </StudentDialog>
      </div>

      <StudentsTable students={students} />
    </div>
  )
}