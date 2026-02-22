'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { Input } from '@/components/ui/input'
import { SpinnerButton } from '@/components/ui/spinner-button'
import * as z from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'

const loginFormSchema = z.object({
  email: z
    .string()
    .min(1, 'O e-mail é obrigatório!')
    .email('Formato de e-mail inválido!')
    .toLowerCase(),
  password: z.string().min(5, 'A senha precisa ter no mínimo 5 caracteres!'),
})

type LoginFormSchema = z.infer<typeof loginFormSchema>

export default function LoginForm() {
  const router = useRouter()
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormSchema>({
    resolver: zodResolver(loginFormSchema),
  })
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  const onSubmit = async (data: LoginFormSchema) => {
    setIsLoading(true)

    try {
      const result = await signIn('credentials', {
        ...data,
        redirect: false,
      })

      if (result?.error) {
        setError('E-mail ou senha incorretos!')
        setIsLoading(false)
        return
      }

      router.replace('/dashboard')
      router.refresh()
    } catch {
      setError('Erro ao realizar login.')
      setIsLoading(false)
    }
  }

  return (
    <div className="flex flex-col items-center gap-2">
      {error ? (
        <div className="w-3/5 rounded-md bg-destructive/10 p-2 text-sm text-destructive">
          {error}
        </div>
      ) : null}
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex w-3/5 flex-col items-center gap-2"
      >
        <Input
          {...register('email')}
          className="justify-self-center text-sm"
          placeholder="nome@exemplo.com"
          disabled={isLoading}
        />
        <Input
          {...register('password')}
          className="justify-self-center text-sm"
          type="password"
          placeholder="*****"
          disabled={isLoading}
        />
        <SpinnerButton
          onClick={() => {
            if (errors.email?.message) setError(errors.email.message)
            if (errors.password?.message) setError(errors.password.message)
          }}
          className="w-full justify-self-center"
          isLoading={isLoading}
          label="Acessar"
          type="submit"
        />
      </form>
    </div>
  )
}
