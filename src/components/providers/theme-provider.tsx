'use client'

import { ThemeProvider as NextThemeProvider } from 'next-themes'

type Props = {
  children: React.ReactNode
} & React.ComponentProps<typeof NextThemeProvider>

export default function ThemeProvider({ children, ...props }: Props) {
  return <NextThemeProvider {...props}>{children}</NextThemeProvider>
}
