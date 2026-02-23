'use client'

import { useState } from 'react'
import { useSession } from 'next-auth/react'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { SpinnerButton } from '@/components/ui/spinner-button'
import { updateUser } from '@/lib/actions/users'

export default function ProfileUserForm() {
  const { data: session, update } = useSession()
  const [name, setName] = useState(session?.user?.name || '')
  const [email, setEmail] = useState(session?.user?.email || '')
  const [image, setImage] = useState(session?.user?.image || '')
  const [isLoading, setIsLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!session?.user?.email) {
      setError('Usuário não autenticado')
      return
    }

    setIsLoading(true)
    setError('')
    setMessage('')

    const result = await updateUser(session.user.email, { name, email, image })

    if (result.success) {
      await update({
        user: { ...session.user, name, email, image },
      })
      setMessage(result.message || 'Perfil atualizado com sucesso!')
    } else {
      setError(result.error || 'Erro ao atualizar perfil')
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
        <Label htmlFor="name">Nome</Label>
        <Input
          id="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          disabled={isLoading}
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="email">E-mail</Label>
        <Input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          disabled={isLoading}
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="image">Foto de Perfil (URL)</Label>
        <Input
          id="image"
          type="url"
          placeholder="https://..."
          value={image}
          onChange={(e) => setImage(e.target.value)}
          disabled={isLoading}
        />
      </div>

      <SpinnerButton
        type="submit"
        isLoading={isLoading}
        label="Salvar alterações"
      />
    </form>
  )
}
