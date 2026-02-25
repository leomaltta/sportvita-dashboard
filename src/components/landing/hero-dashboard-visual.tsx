'use client'

import Image from 'next/image'

const BASE_ROTATE_X = 2
const BASE_ROTATE_Y = -7

export default function HeroDashboardVisual() {
  return (
    <div className="relative aspect-[17/10] w-full">
      <div className="pointer-events-none absolute -inset-6 rounded-3xl bg-gradient-to-br from-primary/10 to-darkblue/10 blur-2xl" />
      <div
        className="hero-tilt hero-drift relative h-full w-full"
        style={
          {
            '--rx': `${BASE_ROTATE_X}deg`,
            '--ry': `${BASE_ROTATE_Y}deg`,
          } as React.CSSProperties
        }
      >
        <div className="hero-orb-a pointer-events-none absolute -left-12 top-8 h-44 w-44 rounded-full bg-primary/15 blur-3xl" />
        <div className="hero-orb-b pointer-events-none absolute -right-12 bottom-8 h-52 w-52 rounded-full bg-darkblue/20 blur-3xl" />
        <div className="relative h-full w-full overflow-hidden rounded-[1.1rem]">
          <div className="hero-sweep pointer-events-none absolute inset-y-0 -left-1/4 z-10 w-1/4 bg-gradient-to-r from-transparent via-white/20 to-transparent dark:via-white/10" />
          <Image
            src="/landing/1dashboard.webp"
            alt="Dashboard principal da plataforma Sport Vita"
            width={2944}
            height={1734}
            priority
            className="block h-full w-full object-cover object-center dark:hidden"
          />
          <Image
            src="/landing/1dashboard.webp"
            alt="Dashboard principal da plataforma Sport Vita"
            width={2944}
            height={1734}
            priority
            className="hidden h-full w-full object-cover object-center dark:block"
          />
        </div>
      </div>
    </div>
  )
}
