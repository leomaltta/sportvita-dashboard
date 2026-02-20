'use client'

import { useState, ReactNode } from 'react'
import { useRouter } from 'next/navigation'
import { createStudent, updateStudent } from '@/lib/actions/students'
import { StudentWithBMI, StudentFormData } from '@/types'
import { SPORTS, SUB_CATEGORIES, SHIFTS } from '@/lib/constants'
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

interface StudentDialogProps {
  mode: 'create' | 'edit'
  student?: StudentWithBMI
  children: ReactNode
}

/**
 * StudentDialog Component
 */
export default function StudentDialog({
  mode,
  student,
  children,
}: StudentDialogProps) {
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  // Form state
  const [formData, setFormData] = useState<StudentFormData>({
    nome: student?.name || '',
    matricula: student?.registrationCode || '',
    telefone: student?.phoneNumber || '',
    idade: student?.age.toString() || '',
    esporte: student?.sportName || '',
    esporte_alterName: student?.sportAlterName || '',
    turma: student?.subCategory || '',
    turno: student?.shift || '',
    peso: student?.weight || 0,
    altura: student?.height || 0,
  })

  /**
   * Handles form submission
   */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setIsLoading(true)

    try {
      const result =
        mode === 'create'
          ? await createStudent(formData)
          : await updateStudent(student!.id, formData)

      if (result.success) {
        setOpen(false)
        router.refresh()
      } else {
        setError(result.error || 'Erro ao salvar')
      }
    } catch (err) {
      setError('Erro ao processar requisição')
    } finally {
      setIsLoading(false)
    }
  }

  /**
   * Updates sport alterName when sport is selected
   */
  const handleSportChange = (value: string) => {
    const sport = SPORTS.find((s) => s.value === value)
    setFormData({
      ...formData,
      esporte: value,
      esporte_alterName: sport?.label || value,
    })
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>
            {mode === 'create' ? 'Adicionar Estudante' : 'Editar Estudante'}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Error Message */}
          {error && (
            <div className="rounded-md bg-red-50 p-3 text-sm text-red-800 dark:bg-red-900/20 dark:text-red-200">
              {error}
            </div>
          )}

          {/* Name */}
          <div className="space-y-2">
            <Label htmlFor="name">Nome Completo</Label>
            <Input
              id="name"
              value={formData.nome}
              onChange={(e) =>
                setFormData({ ...formData, nome: e.target.value })
              }
              required
              disabled={isLoading}
            />
          </div>

          {/* Grid - Matricula and Phone */}
          <div className="grid gap-4 sm:grid-cols-2">
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
            <div className="space-y-2">
              <Label htmlFor="telefone">Telefone</Label>
              <Input
                id="telefone"
                value={formData.telefone}
                onChange={(e) =>
                  setFormData({ ...formData, telefone: e.target.value })
                }
                disabled={isLoading}
              />
            </div>
          </div>

          {/* Grid - Age, Weight, Height */}
          <div className="grid gap-4 sm:grid-cols-3">
            <div className="space-y-2">
              <Label htmlFor="idade">Idade</Label>
              <Input
                id="idade"
                type="number"
                min="5"
                max="18"
                value={formData.idade}
                onChange={(e) =>
                  setFormData({ ...formData, idade: e.target.value })
                }
                required
                disabled={isLoading}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="peso">Peso (kg)</Label>
              <Input
                id="peso"
                type="number"
                step="0.1"
                min="0"
                value={formData.peso}
                onChange={(e) =>
                  setFormData({ ...formData, peso: parseFloat(e.target.value) })
                }
                required
                disabled={isLoading}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="altura">Altura (m)</Label>
              <Input
                id="altura"
                type="number"
                step="0.01"
                min="0"
                max="3"
                value={formData.altura}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    altura: parseFloat(e.target.value),
                  })
                }
                required
                disabled={isLoading}
              />
            </div>
          </div>

          {/* Sport */}
          <div className="space-y-2">
            <Label>Esporte</Label>
            <Select
              value={formData.esporte}
              onValueChange={handleSportChange}
              disabled={isLoading}
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecione o esporte" />
              </SelectTrigger>
              <SelectContent>
                {SPORTS.map((sport) => (
                  <SelectItem key={sport.value} value={sport.value}>
                    {sport.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Grid - Sub and Shift */}
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label>Turma (Sub)</Label>
              <Select
                value={formData.turma}
                onValueChange={(value) =>
                  setFormData({ ...formData, turma: value })
                }
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
                onValueChange={(value) =>
                  setFormData({ ...formData, turno: value })
                }
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

          {/* Actions */}
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