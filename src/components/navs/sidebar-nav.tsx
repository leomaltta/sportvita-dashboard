'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import { buttonVariants } from '@/components/ui/button'
import type { HTMLAttributes } from 'react'

interface SidebarNavProps extends HTMLAttributes<HTMLElement> {
  items: {
    href: string
    title: string
  }[]
}

export function SidebarNav({ className, items, ...props }: SidebarNavProps) {
  const pathname = usePathname()

  return (
    <>
      <nav className="mb-4 flex gap-2 overflow-x-auto min-[464px]:hidden">
        {items.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              buttonVariants({ variant: 'ghost' }),
              pathname === item.href
                ? 'bg-muted hover:bg-muted'
                : 'hover:bg-transparent hover:opacity-95',
              'w-auto whitespace-nowrap',
            )}
          >
            {item.title}
          </Link>
        ))}
      </nav>
      <nav
        className={cn(
          'hidden min-[464px]:flex lg:flex-col lg:space-x-2 lg:space-y-1',
          className,
        )}
        {...props}
      >
        {items.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              buttonVariants({ variant: 'ghost' }),
              pathname === item.href
                ? 'bg-muted hover:bg-muted'
                : 'opacity-80 hover:bg-transparent hover:opacity-100',
              'w-auto justify-start lg:mx-3',
            )}
          >
            {item.title}
          </Link>
        ))}
      </nav>
    </>
  )
}
