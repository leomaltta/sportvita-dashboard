import { ReactNode } from 'react'
import { getServerSession } from 'next-auth/next'
import { redirect } from 'next/navigation'
import { authOptions } from '@/app/api/auth/[...nextauth]/options'
import Header from '@/components/header/header'
import Container from '@/components/container/container'

interface DashboardLayoutProps {
  children: ReactNode
}
export default async function DashboardLayout({
  children,
}: DashboardLayoutProps) {
  const session = await getServerSession(authOptions)

  if (!session) {
    redirect('/login')
  }

  return (
    <>
      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur dark:bg-zinc-950/95">
        <Header />
      </header>
      <Container>{children}</Container>
    </>
  )
}
