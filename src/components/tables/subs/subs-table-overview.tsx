import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import prisma from '../../../../prisma/client'
import { classifyBMI, getBMIColor } from '@/lib/bmi'

interface SubsTableOverviewProps {
  currentBySub: Record<string, number>
  studentsBySub: Record<string, number>
}

export async function SubsTableOverview({
  currentBySub,
  studentsBySub,
}: SubsTableOverviewProps) {
  const idealBmi = await prisma.idealBMI.findMany()

  const bySub = Object.fromEntries(
    idealBmi.map((item) => [item.subCategory, item.bmiValue]),
  )

  const subcategories = ['Sub-6', 'Sub-8', 'Sub-10', 'Sub-12', 'Sub-14', 'Sub-17']

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="w-[120px]">Subcategoria</TableHead>
          <TableHead className="text-center">IMC Ideal</TableHead>
          <TableHead className="text-center">IMC Atual</TableHead>
          <TableHead className="text-center">Status</TableHead>
          <TableHead className="text-right">Estudantes</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {subcategories.map((subcategory) => {
          const avgBmi = currentBySub[subcategory] ?? 0
          const age = Number(subcategory.replace('Sub-', ''))
          const status = classifyBMI(avgBmi, age)
          const statusColor = getBMIColor(status)

          return (
            <TableRow key={subcategory}>
              <TableCell className="font-medium">{subcategory}</TableCell>
              <TableCell className="text-center">
                {(bySub[subcategory] ?? 0).toFixed(2)}
              </TableCell>
              <TableCell className="text-center">{avgBmi.toFixed(2)}</TableCell>
              <TableCell className="text-center">
                <span className={`font-medium ${statusColor}`}>{status}</span>
              </TableCell>
              <TableCell className="text-right">
                {studentsBySub[subcategory] ?? 0}
              </TableCell>
            </TableRow>
          )
        })}
      </TableBody>
    </Table>
  )
}
