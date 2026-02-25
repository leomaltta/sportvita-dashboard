import { Metadata } from 'next'
import LoginForm from '@/components/auth/login-form'
import { getServerSession } from 'next-auth'
import { redirect } from 'next/navigation'
import { authOptions } from '@/app/api/auth/[...nextauth]/options'
import { LoginCarousel } from '@/components/carousels/login-carousel'
import { ModeToggle } from '@/components/ui/mode-toggle'

export const metadata: Metadata = {
  title: 'Acesse sua Dashboard',
  description: 'Dashboard App',
}

export default async function LoginPage() {
  const session = await getServerSession(authOptions)

  if (session) {
    redirect('/dashboard')
  }

  return (
    <main className="w-full lg:flex lg:flex-row-reverse">
      <section className="relative flex h-screen flex-col items-center justify-center lg:w-2/4">
        <div className="absolute right-4 top-4">
          <ModeToggle />
        </div>
        <div className="flex w-full max-w-lg flex-col gap-5 px-6">
          <div className="flex flex-col items-center">
            <h1 className="scroll-m-20 pb-2 text-3xl font-semibold tracking-tight first:mt-0">
              Acesse sua Dashboard
            </h1>
            <p className="text-sm text-muted-foreground">
              Insira seu e-mail e PIN institucional para acessar.
            </p>
          </div>
          <LoginForm />
          <div className="flex flex-col items-center text-center">
            <p className="w-2/4 text-sm text-muted-foreground">
              Ao clicar em acessar, você concorda com nossos{' '}
              <a className="w-2/4 cursor-pointer text-sm text-muted-foreground underline hover:text-primary">
                Termos de Serviço
              </a>{' '}
              e{' '}
              <a className="w-2/4 cursor-pointer text-sm text-muted-foreground underline hover:text-primary">
                Política de Privacidade
              </a>
              .
            </p>
          </div>
        </div>
      </section>
      <section className="hidden lg:block lg:h-screen lg:w-2/4 lg:bg-primary">
        <div className="hidden lg:block lg:h-fit">
          <LoginCarousel />
        </div>
      </section>
    </main>
  )
}
