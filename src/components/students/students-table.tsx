'use client'

import { useState } from 'react'
import { StudentWithBMI } from '@/types'
import { deleteStudent } from '@/lib/actions/students'
import StudentDialog from './student-dialog'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card } from '@/components/ui/card'
import { Pencil, Trash2, Search } from 'lucide-react'
import { classifyBMI, getBMIColor } from '@/lib/bmi'
import { useRouter } from 'next/navigation'

interface StudentsTableProps {
  students: StudentWithBMI[]
  canManage?: boolean
}


export default function StudentsTable({
  students,
  canManage = true,
}: StudentsTableProps) {

  const router = useRouter()
  const [search, setSearch] = useState('')
  const [isDeleting, setIsDeleting] = useState<bigint | null>(null)

  const filteredStudents = students.filter(
    (student) =>
      student.name.toLowerCase().includes(search.toLowerCase()) ||
      student.registrationCode.includes(search) ||
      student.sportAlterName.toLowerCase().includes(search.toLowerCase()),
  )


  const handleDelete = async (id: bigint) => {
    if (!confirm('Tem certeza que deseja excluir este estudante?')) {
      return
    }

    setIsDeleting(id)
    const result = await deleteStudent(id)

    if (result.success) {
      router.refresh()
    } else {
      alert(result.error)
    }
    setIsDeleting(null)
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <Input
            placeholder={canManage ? "Buscar por nome, matrícula ou esporte..." :"Buscar por nome ou matrícula"}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10"
          />
        </div>
        <span className="text-sm text-gray-600 dark:text-gray-400">
          {filteredStudents.length} estudante(s)
        </span>
      </div>

      <Card>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nome</TableHead>
              <TableHead>Matrícula</TableHead>
              <TableHead>Idade</TableHead>
              <TableHead>Esporte</TableHead>
              <TableHead className=''>Turma</TableHead>
              <TableHead>Turno</TableHead>
              <TableHead>Peso</TableHead>
              <TableHead>Altura</TableHead>
              <TableHead>IMC</TableHead>
              <TableHead>Status</TableHead>
              {canManage ? <TableHead className="text-right">Ações</TableHead> : null}
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredStudents.length === 0 ? (
              <TableRow>
                <TableCell colSpan={canManage ? 10 : 9} className="text-center">
                  Nenhum estudante encontrado
                </TableCell>
              </TableRow>
            ) : (
              filteredStudents.map((student) => {
                const classification = classifyBMI(student.imc, student.age)
                const colorClass = getBMIColor(classification)

                return (
                  <TableRow key={student.id.toString()}>
                    <TableCell className="font-medium">
                      {student.name}
                    </TableCell>
                    <TableCell>{student.registrationCode}</TableCell>
                    <TableCell>{student.age} anos</TableCell>
                    <TableCell>{student.sportAlterName}</TableCell>
                    <TableCell>{student.subCategory}</TableCell>
                    <TableCell>{student.shift}</TableCell>
                    <TableCell>{student.weight} kg</TableCell>
                    <TableCell>{student.height} m</TableCell>
                    <TableCell className="font-semibold">
                      {student.imc}
                    </TableCell>
                    <TableCell>
                      <span className={colorClass}>{classification}</span>
                    </TableCell>
                    {canManage ? (
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <StudentDialog mode="edit" student={student}>
                            <Button variant="ghost" size="icon">
                              <Pencil className="h-4 w-4" />
                            </Button>
                          </StudentDialog>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleDelete(student.id)}
                            disabled={isDeleting === student.id}
                          >
                            <Trash2 className="h-4 w-4 text-red-600" />
                          </Button>
                         </div>
                      </TableCell>
                    ) : null}
                  </TableRow>
                )
              })
            )}
          </TableBody>
        </Table>
      </Card>
    </div>
  )
}