'use client'

import { ThemeProvider as NextThemeProvider } from 'next-themes'
import { usePathname } from 'next/navigation'

type Props = {
  children: React.ReactNode
} & React.ComponentProps<typeof NextThemeProvider>

export default function ThemeProvider({ children, ...props }: Props) {
  const pathname = usePathname()
  const forcedTheme = pathname === '/' ? 'dark' : undefined

  return (
    <NextThemeProvider {...props} forcedTheme={forcedTheme}>
      {children}
    </NextThemeProvider>
  )
}
