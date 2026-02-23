'use client'

import { Card } from '@/components/ui/card'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { ArrowUpRight } from 'lucide-react'

interface SportCardProps {
  sportRoute: string
  sportName: string
  sportImg: string
  alterName: string
}

export default function SportCard({
  sportRoute,
  sportName,
  sportImg,
  alterName,
}: SportCardProps) {
  const router = useRouter()

  return (
    <Card
      className="group relative isolate h-64 cursor-pointer overflow-hidden rounded-xl border-0 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
      onClick={() => router.push(`/esportes/${sportRoute}`)}
    >
      <div className="absolute inset-0 overflow-hidden rounded-xl">
        <Image
          className="h-full w-full rounded-xl object-cover transition-transform duration-500 ease-out will-change-transform group-hover:scale-105"
          fill
          src={sportImg}
          alt={`${sportName} Image`}
          sizes="(max-width: 768px) 100vw, 33vw"
        />
        <div className="absolute inset-0 rounded-xl bg-gradient-to-t from-black/70 via-black/25 to-black/10" />
      </div>

      <div className="absolute inset-x-0 bottom-0 p-5">
        <div className="flex items-end justify-between">
          <h3 className="text-2xl font-semibold text-white">
            {alterName || sportName}
          </h3>
          <span className="rounded-full bg-white/20 p-2 text-white backdrop-blur-sm">
            <ArrowUpRight className="h-4 w-4" />
          </span>
        </div>
      </div>
    </Card>
  )
}
