import type { Metadata } from 'next'
import { Ubuntu } from 'next/font/google'
import './globals.css'
import ThemeProvider from '@/components/providers/theme-provider'
import AuthProvider from '@/context/auth-context'

const ubuntu = Ubuntu({
  subsets: ['latin'],
  weight: ['300', '400', '500', '700'],
})

export const metadata: Metadata = {
  title: 'Sport Vita Dashboard',
  description: 'Dashboard App',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="pt-br" suppressHydrationWarning>
      <body className={ubuntu.className}>
        <meta name="viewport" content="width=device-width, user-scalable=no" />
        <ThemeProvider attribute="class">
          <AuthProvider>
            {children}
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
