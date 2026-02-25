'use client'

import { useEffect, useState } from 'react'
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

interface TeachersTableProps {
  teachers: TeacherWithSport[]
  sports: Array<{ id: number; alterName: string }>
}

export default function TeachersTable({ teachers, sports }: TeachersTableProps) {
  const [rows, setRows] = useState(teachers)
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
    setRows(teachers)
  }, [teachers])

  useEffect(() => {
    if (!toast) return
    const timeout = window.setTimeout(() => setToast(null), 2800)
    return () => window.clearTimeout(timeout)
  }, [toast])

  const filteredTeachers = rows.filter(
    (teacher) =>
      teacher.name.toLowerCase().includes(search.toLowerCase()) ||
      teacher.registrationCode.includes(search) ||
      teacher.sport.alterName.toLowerCase().includes(search.toLowerCase()),
  )

  const filteredIdSet = new Set(filteredTeachers.map((teacher) => teacher.id.toString()))
  const selectedFilteredCount = selectedIds.filter((id) => filteredIdSet.has(id)).length
  const isAllFilteredSelected =
    filteredTeachers.length > 0 && selectedFilteredCount === filteredTeachers.length
  const exportFilteredHref = `/api/teachers/export?q=${encodeURIComponent(search)}`
  const exportSelectedHref = `/api/teachers/export?ids=${encodeURIComponent(selectedIds.join(','))}`

  const handleDelete = async (id: bigint): Promise<boolean> => {
    setIsDeleting(id)
    setDeleteError('')
    const result = await deleteTeacher(id)

    if (result.success) {
      setRows((prev) => prev.filter((teacher) => teacher.id !== id))
      setSelectedIds((prev) => prev.filter((teacherId) => teacherId !== id.toString()))
      setToast({ type: 'success', message: 'Professor(a) removido(a) com sucesso.' })
      setIsDeleting(null)
      return true
    }

    const errorMessage = result.error || 'Erro ao excluir professor(a).'
    setDeleteError(errorMessage)
    setToast({ type: 'error', message: errorMessage })
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
      const result = await deleteTeacher(BigInt(id))
      if (result.success) {
        successCount += 1
      } else {
        errorCount += 1
      }
    }

    if (successCount > 0) {
      const selectedSet = new Set(selectedIds)
      setRows((prev) => prev.filter((teacher) => !selectedSet.has(teacher.id.toString())))
      setSelectedIds([])
    }

    if (errorCount > 0) {
      const message =
        errorCount === 1
          ? '1 professor(a) não pôde ser removido(a).'
          : `${errorCount} professores não puderam ser removidos.`
      setDeleteError(message)
      setToast({ type: 'error', message })
    } else {
      const message =
        successCount === 1
          ? '1 professor(a) removido(a) com sucesso.'
          : `${successCount} professores removidos com sucesso.`
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
            placeholder="Buscar por nome, matrícula ou esporte..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10"
          />
        </div>
        <div className="flex items-center gap-3">
          <span className="text-sm text-gray-600 dark:text-gray-400">
            {filteredTeachers.length} professor(es)
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
          {selectedIds.length > 0 ? (
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
                        filteredTeachers.forEach((teacher) => merged.add(teacher.id.toString()))
                        setSelectedIds(Array.from(merged))
                      } else {
                        const filteredSet = new Set(filteredTeachers.map((teacher) => teacher.id.toString()))
                        setSelectedIds((prev) => prev.filter((id) => !filteredSet.has(id)))
                      }
                    }}
                    disabled={isDeleting !== null || isBulkDeleting}
                    aria-label="Selecionar todos os professores filtrados"
                  />
                </TableHead>
                <TableHead>Nome</TableHead>
                <TableHead>E-mail</TableHead>
                <TableHead>Matrícula</TableHead>
                <TableHead>Esporte</TableHead>
                <TableHead>Turma</TableHead>
                <TableHead>Turno</TableHead>
                <TableHead className="text-center">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredTeachers.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} className="text-center">
                    Nenhum professor(a) encontrado(a)
                  </TableCell>
                </TableRow>
              ) : (
                filteredTeachers.map((teacher) => {
                  const teacherId = teacher.id.toString()
                  const isSelected = selectedIds.includes(teacherId)

                  return (
                    <TableRow key={teacherId}>
                      <TableCell>
                        <Checkbox
                          checked={isSelected}
                          onCheckedChange={(checked) => {
                            setSelectedIds((prev) =>
                              checked
                                ? Array.from(new Set([...prev, teacherId]))
                                : prev.filter((id) => id !== teacherId),
                            )
                          }}
                          disabled={isDeleting !== null || isBulkDeleting}
                          aria-label={`Selecionar ${teacher.name}`}
                        />
                      </TableCell>
                      <TableCell className="font-medium">{teacher.name}</TableCell>
                      <TableCell>{teacher.email}</TableCell>
                      <TableCell>{teacher.registrationCode}</TableCell>
                      <TableCell>{teacher.sport.alterName}</TableCell>
                      <TableCell>{teacher.subCategory}</TableCell>
                      <TableCell>{teacher.shift}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-center gap-2">
                          <TeacherDialog
                            mode="edit"
                            teacher={teacher}
                            sports={sports}
                            onSaved={() =>
                              setToast({
                                type: 'success',
                                message: 'Professor(a) atualizado(a) com sucesso.',
                              })
                            }
                          >
                            <Button variant="ghost" size="icon">
                              <Pencil className="h-4 w-4" />
                            </Button>
                          </TeacherDialog>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => {
                              setDeleteError('')
                              setPendingDeleteId(teacher.id)
                            }}
                            disabled={isDeleting === teacher.id || isBulkDeleting}
                          >
                            <Trash2 className="h-4 w-4 text-red-600" />
                          </Button>
                        </div>
                      </TableCell>
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
            <DialogTitle>Excluir professores selecionados</DialogTitle>
            <DialogDescription>
              Tem certeza que deseja excluir {selectedIds.length} professor(es)? Essa ação não pode ser desfeita.
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
            <DialogTitle>Excluir professor(a)</DialogTitle>
            <DialogDescription>
              Tem certeza que deseja excluir este professor(a)? Essa ação não pode ser desfeita.
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
