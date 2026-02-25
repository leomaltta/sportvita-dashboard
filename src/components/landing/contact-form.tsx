'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Input } from '@/components/ui/input'
import { SpinnerButton } from '@/components/ui/spinner-button'

const contactSchema = z.object({
  name: z.string().min(2, 'Informe seu nome.'),
  email: z.string().email('Informe um e-mail valido.'),
  subject: z.string().min(3, 'Informe um assunto.'),
  message: z.string().min(10, 'A mensagem precisa ter ao menos 10 caracteres.'),
})

type ContactFormData = z.infer<typeof contactSchema>

export default function ContactForm() {
  const [requestError, setRequestError] = useState('')
  const [successMessage, setSuccessMessage] = useState('')

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
  })

  async function onSubmit(data: ContactFormData) {
    setRequestError('')
    setSuccessMessage('')

    const response = await fetch('/api/contact', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    })

    const payload = await response.json()
    if (!response.ok) {
      const baseError = payload?.error ?? 'Nao foi possivel enviar sua mensagem.'
      const details =
        typeof payload?.details === 'string' && payload.details.length > 0
          ? ` (${payload.details})`
          : ''
      setRequestError(`${baseError}${details}`)
      return
    }

    setSuccessMessage('Mensagem enviada. Vou retornar o contato em breve.')
    reset()
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
      <div className="grid gap-3 sm:grid-cols-2">
        <div className="space-y-1.5">
          <Input placeholder="Seu nome" {...register('name')} disabled={isSubmitting} />
          {errors.name ? <p className="text-xs text-destructive">{errors.name.message}</p> : null}
        </div>
        <div className="space-y-1.5">
          <Input
            type="email"
            placeholder="seu@email.com"
            {...register('email')}
            disabled={isSubmitting}
          />
          {errors.email ? (
            <p className="text-xs text-destructive">{errors.email.message}</p>
          ) : null}
        </div>
      </div>

      <div className="space-y-1.5">
        <Input placeholder="Assunto" {...register('subject')} disabled={isSubmitting} />
        {errors.subject ? (
          <p className="text-xs text-destructive">{errors.subject.message}</p>
        ) : null}
      </div>

      <div className="space-y-1.5">
        <textarea
          placeholder="Escreva sua mensagem"
          rows={5}
          className="flex w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
          {...register('message')}
          disabled={isSubmitting}
        />
        {errors.message ? (
          <p className="text-xs text-destructive">{errors.message.message}</p>
        ) : null}
      </div>

      {requestError ? (
        <div className="rounded-md bg-destructive/10 px-3 py-2 text-sm text-destructive">
          {requestError}
        </div>
      ) : null}
      {successMessage ? (
        <div className="rounded-md bg-emerald-500/10 px-3 py-2 text-sm text-emerald-700 dark:text-emerald-300">
          {successMessage}
        </div>
      ) : null}

      <SpinnerButton
        type="submit"
        isLoading={isSubmitting}
        label="Enviar mensagem"
        className="w-full sm:w-auto"
      />
    </form>
  )
}
