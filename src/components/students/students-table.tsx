'use client'

import { useEffect, useState } from 'react'
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
import { SpinnerButton } from '@/components/ui/spinner-button'
import { Checkbox } from '@/components/ui/checkbox'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { CheckCircle2, Download, Pencil, Search, Trash2, XCircle } from 'lucide-react'
import { classifyBMI, getBMIColor } from '@/lib/bmi'

interface StudentsTableProps {
  students: StudentWithBMI[]
  canManage?: boolean
}


export default function StudentsTable({
  students,
  canManage = true,
}: StudentsTableProps) {
  const [rows, setRows] = useState(students)
  const [search, setSearch] = useState('')
  const [isDeleting, setIsDeleting] = useState<bigint | null>(null)
  const [isBulkDeleting, setIsBulkDeleting] = useState(false)
  const [pendingDeleteId, setPendingDeleteId] = useState<bigint | null>(null)
  const [pendingBulkDelete, setPendingBulkDelete] = useState(false)
  const [deleteError, setDeleteError] = useState('')
  const [selectedIds, setSelectedIds] = useState<string[]>([])
  const [toast, setToast] = useState<{
    type: 'success' | 'error'
    message: string
  } | null>(null)

  useEffect(() => {
    setRows(students)
  }, [students])

  useEffect(() => {
    if (!toast) return
    const timeout = window.setTimeout(() => setToast(null), 2800)
    return () => window.clearTimeout(timeout)
  }, [toast])

  const filteredStudents = rows.filter(
    (student) =>
      student.name.toLowerCase().includes(search.toLowerCase()) ||
      student.registrationCode.includes(search) ||
      student.sportAlterName.toLowerCase().includes(search.toLowerCase()),
  )
  const filteredIdSet = new Set(filteredStudents.map((student) => student.id.toString()))
  const selectedFilteredCount = selectedIds.filter((id) => filteredIdSet.has(id)).length
  const isAllFilteredSelected =
    filteredStudents.length > 0 && selectedFilteredCount === filteredStudents.length
  const exportFilteredHref = `/api/students/export?q=${encodeURIComponent(search)}`
  const exportSelectedHref = `/api/students/export?ids=${encodeURIComponent(selectedIds.join(','))}`

  const handleDelete = async (id: bigint): Promise<boolean> => {
    setIsDeleting(id)
    setDeleteError('')
    const result = await deleteStudent(id)

    if (result.success) {
      setRows((prev) => prev.filter((student) => student.id !== id))
      setSelectedIds((prev) => prev.filter((studentId) => studentId !== id.toString()))
      setToast({ type: 'success', message: 'Estudante removido com sucesso.' })
      setIsDeleting(null)
      return true
    } else {
      const errorMessage = result.error || 'Erro ao excluir estudante.'
      setDeleteError(errorMessage)
      setToast({ type: 'error', message: errorMessage })
    }
    setIsDeleting(null)
    return false
  }

  const handleBulkDelete = async () => {
    if (selectedIds.length === 0) return

    setIsBulkDeleting(true)
    setDeleteError('')

    let successCount = 0
    let errorCount = 0

    for (const id of selectedIds) {
      const result = await deleteStudent(BigInt(id))
      if (result.success) {
        successCount += 1
      } else {
        errorCount += 1
      }
    }

    if (successCount > 0) {
      const selectedSet = new Set(selectedIds)
      setRows((prev) => prev.filter((student) => !selectedSet.has(student.id.toString())))
      setSelectedIds([])
    }

    if (errorCount > 0) {
      const message =
        errorCount === 1
          ? '1 estudante não pôde ser removido.'
          : `${errorCount} estudantes não puderam ser removidos.`
      setDeleteError(message)
      setToast({ type: 'error', message })
    } else {
      const message =
        successCount === 1
          ? '1 estudante removido com sucesso.'
          : `${successCount} estudantes removidos com sucesso.`
      setToast({ type: 'success', message })
      setPendingBulkDelete(false)
      setDeleteError('')
    }

    setIsBulkDeleting(false)
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
        <div className="flex items-center gap-3">
          <span className="text-sm text-gray-600 dark:text-gray-400">
            {filteredStudents.length} estudante(s)
          </span>
          <Button asChild variant="outline" size="sm">
            <a href={exportFilteredHref}>
              <Download className="h-4 w-4" />
              Exportar filtrados
            </a>
          </Button>
          {selectedIds.length > 0 ? (
            <Button asChild variant="outline" size="sm">
              <a href={exportSelectedHref}>
                <Download className="h-4 w-4" />
                Exportar selecionados ({selectedIds.length})
              </a>
            </Button>
          ) : null}
          {canManage && selectedIds.length > 0 ? (
            <Button
              variant="destructive"
              size="sm"
              onClick={() => {
                setDeleteError('')
                setPendingBulkDelete(true)
              }}
              disabled={isDeleting !== null || isBulkDeleting}
            >
              Excluir selecionados ({selectedIds.length})
            </Button>
          ) : null}
        </div>
      </div>

      <Card className="overflow-hidden">
        <div className="max-h-[calc(100vh-290px)] overflow-auto">
        <Table>
          <TableHeader>
            <TableRow>
              {canManage ? (
                <TableHead className="w-10">
                  <Checkbox
                    checked={
                      isAllFilteredSelected
                        ? true
                        : selectedFilteredCount > 0
                          ? 'indeterminate'
                          : false
                    }
                    onCheckedChange={(checked) => {
                      if (checked) {
                        const merged = new Set(selectedIds)
                        filteredStudents.forEach((student) => merged.add(student.id.toString()))
                        setSelectedIds(Array.from(merged))
                      } else {
                        const filteredSet = new Set(filteredStudents.map((student) => student.id.toString()))
                        setSelectedIds((prev) => prev.filter((id) => !filteredSet.has(id)))
                      }
                    }}
                    disabled={isDeleting !== null || isBulkDeleting}
                    aria-label="Selecionar todos os estudantes filtrados"
                  />
                </TableHead>
              ) : null}
              <TableHead>Nome</TableHead>
              <TableHead>Matrícula</TableHead>
              <TableHead>Esporte</TableHead>
              <TableHead>Turma</TableHead>
              <TableHead>Turno</TableHead>
              <TableHead>Idade</TableHead>
              <TableHead>Peso</TableHead>
              <TableHead>Altura</TableHead>
              <TableHead>IMC</TableHead>
              <TableHead>Status</TableHead>
              {canManage ? <TableHead className="text-center">Ações</TableHead> : null}
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredStudents.length === 0 ? (
              <TableRow>
                <TableCell colSpan={canManage ? 12 : 10} className="text-center">
                  Nenhum estudante encontrado
                </TableCell>
              </TableRow>
            ) : (
              filteredStudents.map((student) => {
                const classification = classifyBMI(student.imc, student.age)
                const colorClass = getBMIColor(classification)
                const studentId = student.id.toString()
                const isSelected = selectedIds.includes(studentId)

                return (
                  <TableRow key={student.id.toString()}>
                    {canManage ? (
                      <TableCell>
                        <Checkbox
                          checked={isSelected}
                          onCheckedChange={(checked) => {
                            setSelectedIds((prev) =>
                              checked
                                ? Array.from(new Set([...prev, studentId]))
                                : prev.filter((id) => id !== studentId),
                            )
                          }}
                          disabled={isDeleting !== null || isBulkDeleting}
                          aria-label={`Selecionar ${student.name}`}
                        />
                      </TableCell>
                    ) : null}
                    <TableCell className="font-medium">
                      {student.name}
                    </TableCell>
                    <TableCell>{student.registrationCode}</TableCell>
                    <TableCell>{student.sportAlterName}</TableCell>
                    <TableCell>{student.subCategory}</TableCell>
                    <TableCell>{student.shift}</TableCell>
                    <TableCell>{student.age} anos</TableCell>
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
                        <div className="flex justify-center gap-2">
                          <StudentDialog
                            mode="edit"
                            student={student}
                            onSaved={() =>
                              setToast({
                                type: 'success',
                                message: 'Estudante atualizado com sucesso.',
                              })
                            }
                          >
                            <Button variant="ghost" size="icon">
                              <Pencil className="h-4 w-4" />
                            </Button>
                          </StudentDialog>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => {
                              setDeleteError('')
                              setPendingDeleteId(student.id)
                            }}
                            disabled={
                              isDeleting === student.id ||
                              isBulkDeleting
                            }
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
        </div>
      </Card>

      <Dialog
        open={pendingBulkDelete}
        onOpenChange={(open) => {
          if (!open && !isBulkDeleting) {
            setPendingBulkDelete(false)
            setDeleteError('')
          }
        }}
      >
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Excluir estudantes selecionados</DialogTitle>
            <DialogDescription>
              Tem certeza que deseja excluir {selectedIds.length} estudante(s)? Essa ação não pode ser desfeita.
            </DialogDescription>
          </DialogHeader>
          {deleteError ? (
            <div className="rounded-md bg-destructive/10 px-3 py-2 text-sm text-destructive">
              {deleteError}
            </div>
          ) : null}
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              disabled={isBulkDeleting}
              onClick={() => setPendingBulkDelete(false)}
            >
              Cancelar
            </Button>
            <SpinnerButton
              type="button"
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              isLoading={isBulkDeleting}
              label="Confirmar exclusão"
              disabled={selectedIds.length === 0 || isBulkDeleting}
              onClick={async (e) => {
                e.preventDefault()
                await handleBulkDelete()
              }}
            />
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog
        open={pendingDeleteId !== null}
        onOpenChange={(open) => {
          if (!open && isDeleting === null) {
            setPendingDeleteId(null)
            setDeleteError('')
          }
        }}
      >
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Excluir estudante</DialogTitle>
            <DialogDescription>
              Tem certeza que deseja excluir este estudante? Essa ação não pode ser desfeita.
            </DialogDescription>
          </DialogHeader>
          {deleteError ? (
            <div className="rounded-md bg-destructive/10 px-3 py-2 text-sm text-destructive">
              {deleteError}
            </div>
          ) : null}
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              disabled={isDeleting !== null}
              onClick={() => setPendingDeleteId(null)}
            >
              Cancelar
            </Button>
            <SpinnerButton
              type="button"
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              isLoading={isDeleting !== null}
              label="Confirmar exclusão"
              disabled={pendingDeleteId === null || isDeleting !== null}
              onClick={async (e) => {
                e.preventDefault()
                if (pendingDeleteId === null) return
                const deleted = await handleDelete(pendingDeleteId)
                if (deleted) {
                  setPendingDeleteId(null)
                }
              }}
            />
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {toast ? (
        <div className="pointer-events-none fixed bottom-5 right-5 z-[90] animate-in fade-in slide-in-from-bottom-2 duration-200">
          <div
            className={`min-w-[280px] rounded-lg border px-4 py-3 shadow-xl backdrop-blur ${
              toast.type === 'success'
                ? 'border-emerald-200 bg-emerald-50 text-emerald-800 dark:border-emerald-900/40 dark:bg-emerald-950/70 dark:text-emerald-200'
                : 'border-destructive/30 bg-destructive/10 text-destructive dark:bg-destructive/20'
            }`}
          >
            <div className="flex items-start gap-2">
              {toast.type === 'success' ? (
                <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0" />
              ) : (
                <XCircle className="mt-0.5 h-4 w-4 shrink-0" />
              )}
              <p className="text-sm font-medium">{toast.message}</p>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  )
}
