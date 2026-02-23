'use client'

import { useState } from 'react'
import { createUser } from '@/lib/actions/users'
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

export default function AddUserForm() {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [message, setMessage] = useState('')
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    image: '',
    password: '',
    role: '',
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setMessage('')
    setIsLoading(true)

    const result = await createUser(formData)
    if (result.success) {
      setMessage(result.message || 'Usuário criado com sucesso!')
      setFormData({
        name: '',
        email: '',
        image: '',
        password: '',
        role: '',
      })
    } else {
      setError(result.error || 'Erro ao criar usuário')
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
      <p className="text-xs text-muted-foreground">
        Dica: para role <strong>Professor</strong>, o e-mail precisa existir no cadastro de
        professores.
      </p>

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
          <Label>Senha</Label>
          <Input
            type="password"
            value={formData.password}
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            required
            disabled={isLoading}
          />
        </div>
      </div>
      <div className="space-y-2">
        <Label>Foto (URL)</Label>
        <Input
          type="url"
          placeholder="https://..."
          value={formData.image}
          onChange={(e) => setFormData({ ...formData, image: e.target.value })}
          disabled={isLoading}
        />
      </div>
      <div className="space-y-2">
        <Label>Role</Label>
        <Select
          value={formData.role}
          onValueChange={(value) => setFormData({ ...formData, role: value })}
          disabled={isLoading}
        >
          <SelectTrigger>
            <SelectValue placeholder="Selecione a role" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="admin">Admin</SelectItem>
            <SelectItem value="prof">Professor</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <SpinnerButton type="submit" isLoading={isLoading} label="Adicionar usuário" />
    </form>
  )
}
