import { ReactNode } from 'react'
import { getServerSession } from 'next-auth/next'
import { redirect } from 'next/navigation'
import { authOptions } from '@/app/api/auth/[...nextauth]/options'
import Sidebar from '@/components/layout/sidebar'
import Header from '@/components/layout/header'

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
    <div className="flex h-screen overflow-hidden bg-gray-50 dark:bg-gray-900">
      <Sidebar user={session.user} />
      <div className="flex flex-1 flex-col overflow-hidden">
      <Header user={session.user} />
        <main className="flex-1 overflow-y-auto p-6">{children}</main>
      </div>
    </div>
  )
}