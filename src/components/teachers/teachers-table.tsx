'use client'

import { useState } from 'react'
import { TeacherWithSport } from '@/types'
import { deleteTeacher } from '@/lib/actions/teachers'
import TeacherDialog from './teacher-dialog'
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
import { useRouter } from 'next/navigation'

interface TeachersTableProps {
  teachers: TeacherWithSport[]
  sports: Array<{ id: number; alterName: string }>
}

export default function TeachersTable({ teachers, sports }: TeachersTableProps) {
  const router = useRouter()
  const [search, setSearch] = useState('')
  const [isDeleting, setIsDeleting] = useState<bigint | null>(null)

  const filteredTeachers = teachers.filter(
    (teacher) =>
      teacher.name.toLowerCase().includes(search.toLowerCase()) ||
      teacher.registrationCode.includes(search) ||
      teacher.sport.alterName.toLowerCase().includes(search.toLowerCase()),
  )

  const handleDelete = async (id: bigint) => {
    if (!confirm('Tem certeza que deseja excluir este professor(a)?')) {
      return
    }

    setIsDeleting(id)
    const result = await deleteTeacher(id)

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
            placeholder="Buscar por nome, matrícula ou esporte..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10"
          />
        </div>
        <span className="text-sm text-gray-600 dark:text-gray-400">
          {filteredTeachers.length} professor(es)
        </span>
      </div>

      <Card>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nome</TableHead>
              <TableHead>E-mail</TableHead>
              <TableHead>Matrícula</TableHead>
              <TableHead>Esporte</TableHead>
              <TableHead>Turma</TableHead>
              <TableHead>Turno</TableHead>
              <TableHead className="text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredTeachers.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center">
                  Nenhum professor(a) encontrado(a)
                </TableCell>
              </TableRow>
            ) : (
              filteredTeachers.map((teacher) => (
                <TableRow key={teacher.id.toString()}>
                  <TableCell className="font-medium">{teacher.name}</TableCell>
                  <TableCell>{teacher.email}</TableCell>
                  <TableCell>{teacher.registrationCode}</TableCell>
                  <TableCell>{teacher.sport.alterName}</TableCell>
                  <TableCell>{teacher.subCategory}</TableCell>
                  <TableCell>{teacher.shift}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <TeacherDialog mode="edit" teacher={teacher} sports={sports}>
                        <Button variant="ghost" size="icon">
                          <Pencil className="h-4 w-4" />
                        </Button>
                      </TeacherDialog>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDelete(teacher.id)}
                        disabled={isDeleting === teacher.id}
                      >
                        <Trash2 className="h-4 w-4 text-red-600" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </Card>
    </div>
  )
}
