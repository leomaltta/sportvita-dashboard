import { Metadata } from 'next'
import LoginForm from '@/components/auth/login-form'
import Image from 'next/image'

export const metadata: Metadata = {
  title: 'Login | Sport Vita Dashboard',
  description: 'Faça login no Sport Vita Dashboard',
}
export default function LoginPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 px-4 dark:from-gray-900 dark:to-gray-800">
      <div className="w-full max-w-md space-y-8">
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-logoGreen">
        <div className="text-center">
            <svg
              className="h-12 w-12 text-white"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13 10V3L4 14h7v7l9-11h-7z"
              />
            </svg>
          </div>
          <h2 className="mt-6 text-3xl font-bold tracking-tight text-gray-900 dark:text-white">
            Sport Vita Dashboard
          </h2>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
            Faça login para acessar o sistema
          </p>
        </div>

        <div className="rounded-lg bg-white px-8 py-10 shadow-xl dark:bg-gray-800">
          <LoginForm />
        </div>

        <p className="text-center text-xs text-gray-500 dark:text-gray-400">
          © 2025 M&N Soluções Digitais. Todos os direitos reservados.
        </p>
      </div>
    </div>
  )
}