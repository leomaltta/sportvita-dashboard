'use client'

import { useState, ReactNode } from 'react'
import { useRouter } from 'next/navigation'
import { createTeacher, updateTeacher } from '@/lib/actions/teachers'
import { TeacherWithSport, TeacherFormData } from '@/types'
import { SUB_CATEGORIES, SHIFTS } from '@/lib/constants'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { SpinnerButton } from '@/components/ui/spinner-button'

interface TeacherDialogProps {
  mode: 'create' | 'edit'
  teacher?: TeacherWithSport
  sports: Array<{ id: number; alterName: string }>
  children: ReactNode
  onSaved?: (mode: 'create' | 'edit') => void
}

export default function TeacherDialog({
  mode,
  teacher,
  sports,
  children,
  onSaved,
}: TeacherDialogProps) {
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  const [formData, setFormData] = useState<TeacherFormData>({
    name: teacher?.name || '',
    email: teacher?.email || '',
    matricula: teacher?.registrationCode || '',
    esporteID: teacher?.sportId || 0,
    turma: teacher?.subCategory || '',
    turno: teacher?.shift || '',
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setIsLoading(true)

    try {
      const result =
        mode === 'create'
          ? await createTeacher(formData)
          : await updateTeacher(teacher!.id, formData)

      if (result.success) {
        setOpen(false)
        onSaved?.(mode)
        router.refresh()
      } else {
        setError(result.error || 'Erro ao salvar')
      }
    } catch {
      setError('Erro ao processar requisição')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>
            {mode === 'create' ? 'Adicionar Professor(a)' : 'Editar Professor(a)'}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="rounded-md bg-red-50 p-3 text-sm text-red-800 dark:bg-red-900/20 dark:text-red-200">
              {error}
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="name">Nome Completo</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
              disabled={isLoading}
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="email">E-mail</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
                disabled={isLoading}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="matricula">Matrícula</Label>
              <Input
                id="matricula"
                value={formData.matricula}
                onChange={(e) =>
                  setFormData({ ...formData, matricula: e.target.value })
                }
                required
                disabled={isLoading}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label>Esporte</Label>
            <Select
              value={formData.esporteID ? String(formData.esporteID) : ''}
              onValueChange={(value) =>
                setFormData({ ...formData, esporteID: Number(value) })
              }
              disabled={isLoading}
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecione o esporte" />
              </SelectTrigger>
              <SelectContent>
                {sports.map((sport) => (
                  <SelectItem key={sport.id} value={String(sport.id)}>
                    {sport.alterName}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label>Turma (Sub)</Label>
              <Select
                value={formData.turma}
                onValueChange={(value) => setFormData({ ...formData, turma: value })}
                disabled={isLoading}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione a turma" />
                </SelectTrigger>
                <SelectContent>
                  {SUB_CATEGORIES.map((sub) => (
                    <SelectItem key={sub.value} value={sub.value}>
                      {sub.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Turno</Label>
              <Select
                value={formData.turno}
                onValueChange={(value) => setFormData({ ...formData, turno: value })}
                disabled={isLoading}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o turno" />
                </SelectTrigger>
                <SelectContent>
                  {SHIFTS.map((shift) => (
                    <SelectItem key={shift.value} value={shift.value}>
                      {shift.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              disabled={isLoading}
            >
              Cancelar
            </Button>
            <SpinnerButton
              type="submit"
              isLoading={isLoading}
              label={mode === 'create' ? 'Adicionar' : 'Salvar'}
            />
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
