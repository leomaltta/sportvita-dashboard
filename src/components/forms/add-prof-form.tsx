'use client'

import { useState } from 'react'
import { createTeacher } from '@/lib/actions/teachers'
import { SUB_CATEGORIES, SHIFTS } from '@/lib/constants'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { SpinnerButton } from '@/components/ui/spinner-button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

interface SportOption {
  id: number
  alterName: string
}

interface AddProfFormProps {
  sports: SportOption[]
}

export default function AddProfForm({ sports }: AddProfFormProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [message, setMessage] = useState('')
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    matricula: '',
    esporteID: 0,
    turma: '',
    turno: '',
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setMessage('')
    setIsLoading(true)

    const result = await createTeacher(formData)
    if (result.success) {
      setMessage(result.message || 'Professor(a) adicionado(a) com sucesso!')
      setFormData({
        name: '',
        email: '',
        matricula: '',
        esporteID: 0,
        turma: '',
        turno: '',
      })
    } else {
      setError(result.error || 'Erro ao adicionar professor(a)')
    }

    setIsLoading(false)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {message ? (
        <div className="rounded-md bg-green-100 p-3 text-sm text-green-800">
          {message}
        </div>
      ) : null}
      {error ? (
        <div className="rounded-md bg-red-100 p-3 text-sm text-red-800">{error}</div>
      ) : null}

      <div className="space-y-2">
        <Label>Nome</Label>
        <Input
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          required
          disabled={isLoading}
        />
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label>E-mail</Label>
          <Input
            type="email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            required
            disabled={isLoading}
          />
        </div>
        <div className="space-y-2">
          <Label>Matrícula</Label>
          <Input
            value={formData.matricula}
            onChange={(e) => setFormData({ ...formData, matricula: e.target.value })}
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
          <Label>Turma</Label>
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

      <SpinnerButton type="submit" isLoading={isLoading} label="Adicionar professor(a)" />
    </form>
  )
}
