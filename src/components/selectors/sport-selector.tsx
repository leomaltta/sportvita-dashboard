'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Button } from '@/components/ui/button'

interface SportSelectorProps {
  sports: Array<{
    route: string
    alterName: string
  }>
}

export default function SportSelector({ sports }: SportSelectorProps) {
  const router = useRouter()
  const [sportRoute, setSportRoute] = useState('')

  return (
    <div className="flex flex-row gap-2">
      <Select
        value={sportRoute}
        onValueChange={(value) => {
          setSportRoute(value)
          router.push(`/dashboard/${value}`)
        }}
      >
        <SelectTrigger className="w-[180px] md:w-[220px]">
          <SelectValue placeholder="Selecione o esporte..." />
        </SelectTrigger>
        <SelectContent>
          {sports.map((sport) => (
            <SelectItem key={sport.route} value={sport.route}>
              {sport.alterName}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <Button
        disabled={!sportRoute}
        onClick={() => {
          if (sportRoute) router.push(`/esportes/${sportRoute}`)
        }}
      >
        Detalhes
      </Button>
    </div>
  )
}
