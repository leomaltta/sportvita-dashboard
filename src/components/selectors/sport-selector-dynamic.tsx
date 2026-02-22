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
    <div className="flex flex-row gap-2">
      <Select
        value={esporteDetails}
        onValueChange={(value) => {
          router.push(`/dashboard/${value}`)
        }}
      >
        <SelectTrigger className="w-[180px] md:w-[220px]">
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
      <Button onClick={() => router.push(`/esportes/${esporteDetails}`)}>
        Detalhes
      </Button>
    </div>
  )
}
