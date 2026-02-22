'use client'

import { useState } from 'react'
import { createStudent } from '@/lib/actions/students'
import { SPORTS, SUB_CATEGORIES, SHIFTS } from '@/lib/constants'
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

export default function AddAlunoForm() {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [message, setMessage] = useState('')
  const [formData, setFormData] = useState({
    nome: '',
    matricula: '',
    telefone: '',
    idade: '',
    esporte: '',
    esporte_alterName: '',
    turma: '',
    turno: '',
    peso: 0,
    altura: 0,
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setMessage('')
    setIsLoading(true)

    const result = await createStudent(formData)
    if (result.success) {
      setMessage(result.message || 'Estudante adicionado com sucesso!')
      setFormData({
        nome: '',
        matricula: '',
        telefone: '',
        idade: '',
        esporte: '',
        esporte_alterName: '',
        turma: '',
        turno: '',
        peso: 0,
        altura: 0,
      })
    } else {
      setError(result.error || 'Erro ao adicionar estudante')
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
          value={formData.nome}
          onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
          required
          disabled={isLoading}
        />
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label>Matrícula</Label>
          <Input
            value={formData.matricula}
            onChange={(e) => setFormData({ ...formData, matricula: e.target.value })}
            required
            disabled={isLoading}
          />
        </div>
        <div className="space-y-2">
          <Label>Telefone</Label>
          <Input
            value={formData.telefone}
            onChange={(e) => setFormData({ ...formData, telefone: e.target.value })}
            disabled={isLoading}
          />
        </div>
      </div>
      <div className="grid gap-4 sm:grid-cols-3">
        <div className="space-y-2">
          <Label>Idade</Label>
          <Input
            type="number"
            value={formData.idade}
            onChange={(e) => setFormData({ ...formData, idade: e.target.value })}
            required
            disabled={isLoading}
          />
        </div>
        <div className="space-y-2">
          <Label>Peso (kg)</Label>
          <Input
            type="number"
            step="0.1"
            value={formData.peso}
            onChange={(e) =>
              setFormData({ ...formData, peso: Number(e.target.value || 0) })
            }
            required
            disabled={isLoading}
          />
        </div>
        <div className="space-y-2">
          <Label>Altura (m)</Label>
          <Input
            type="number"
            step="0.01"
            value={formData.altura}
            onChange={(e) =>
              setFormData({ ...formData, altura: Number(e.target.value || 0) })
            }
            required
            disabled={isLoading}
          />
        </div>
      </div>
      <div className="space-y-2">
        <Label>Esporte</Label>
        <Select
          value={formData.esporte}
          onValueChange={(value) => {
            const sport = SPORTS.find((s) => s.value === value)
            setFormData({
              ...formData,
              esporte: value,
              esporte_alterName: sport?.label || value,
            })
          }}
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
      <SpinnerButton type="submit" isLoading={isLoading} label="Adicionar estudante" />
    </form>
  )
}
