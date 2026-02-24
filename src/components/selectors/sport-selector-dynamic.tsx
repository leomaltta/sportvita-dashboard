'use client'

import { useRouter } from 'next/navigation'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Button } from '@/components/ui/button'

interface SportSelectorDynamicProps {
  esporteDetails: string
  esporteTitle: string
  sports: Array<{
    route: string
    alterName: string
  }>
}

export default function SportSelectorDynamic({
  esporteDetails,
  esporteTitle,
  sports,
}: SportSelectorDynamicProps) {
  const router = useRouter()

  return (
    <div className="flex w-full items-center gap-2 sm:w-auto">
      <Select
        value={esporteDetails}
        onValueChange={(value) => {
          router.push(`/dashboard/${value}`)
        }}
      >
        <SelectTrigger className="h-10 w-full min-w-0 sm:w-[220px]">
          <SelectValue placeholder={esporteTitle} />
        </SelectTrigger>
        <SelectContent>
          {sports.map((sport) => (
            <SelectItem key={sport.route} value={sport.route}>
              {sport.alterName}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <Button className="h-10 shrink-0 px-4" onClick={() => router.push(`/esportes/${esporteDetails}`)}>
        Detalhes
      </Button>
    </div>
  )
}
