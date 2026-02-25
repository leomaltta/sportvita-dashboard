import type { Metadata, Viewport } from 'next'
import { Ubuntu } from 'next/font/google'
import './globals.css'
import ThemeProvider from '@/components/providers/theme-provider'
import AuthProvider from '@/context/auth-context'

const ubuntu = Ubuntu({
  subsets: ['latin'],
  weight: ['300', '400', '500', '700'],
})

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || process.env.NEXTAUTH_URL || 'https://sportvita.vercel.app'

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: 'Sport Vita Dashboard',
    template: '%s | Sport Vita',
  },
  description: 'Plataforma de monitoramento de saúde escolar com visão por esporte, alertas e gestão operacional.',
  applicationName: 'Sport Vita',
  manifest: '/site.webmanifest',
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: 'any' },
      { url: '/favicon-16x16.png', type: 'image/png', sizes: '16x16' },
      { url: '/favicon-32x32.png', type: 'image/png', sizes: '32x32' },
      { url: '/favicon-48x48.png', type: 'image/png', sizes: '48x48' },
    ],
    apple: [{ url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' }],
    shortcut: ['/favicon-32x32.png'],
  },
  openGraph: {
    type: 'website',
    locale: 'pt_BR',
    siteName: 'Sport Vita',
    title: 'Sport Vita Dashboard',
    description: 'Monitoramento de saúde escolar com dados por esporte, subcategoria e alertas de risco.',
    images: [{ url: '/og-image.png', width: 1200, height: 630, alt: 'Sport Vita Dashboard' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Sport Vita Dashboard',
    description: 'Monitoramento de saúde escolar com dados por esporte e alertas priorizados.',
    images: ['/twitter-image.png'],
  },
}

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#ffffff' },
    { media: '(prefers-color-scheme: dark)', color: '#0a0a0a' },
  ],
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
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <AuthProvider>
            {children}
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
