

import { LucideIcon } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'

interface StatsCardProps {
  title: string
  value: string
  description: string
  icon: LucideIcon
}


export default function StatsCard({
  title,
  value,
  description,
  icon: Icon,
}: StatsCardProps) {
  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
              {title}
            </p>
            <p className="text-3xl font-bold text-gray-900 dark:text-white">
              {value}
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-500">
              {description}
            </p>
          </div>
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-logoGreen/10">
            <Icon className="h-6 w-6 text-logoGreen" />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}