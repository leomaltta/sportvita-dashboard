import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { classifyBMI, getBMIColor } from '@/lib/bmi'

interface StatBySub {
  media: number
  count: number
}

interface SubsTableOverviewDynamicProps {
  statsBySub: Record<string, StatBySub>
  idealBySub: Record<string, number>
}

export function SubsTableOverviewDynamic({
  statsBySub,
  idealBySub,
}: SubsTableOverviewDynamicProps) {
  const subcategories = ['Sub-6', 'Sub-8', 'Sub-10', 'Sub-12', 'Sub-14', 'Sub-17']

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="w-[100px]">Subcategoria</TableHead>
          <TableHead className="text-center">IMC Ideal</TableHead>
          <TableHead className="text-center">IMC Atual</TableHead>
          <TableHead className="text-center">Status</TableHead>
          <TableHead className="text-right">Estudantes</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {subcategories.map((subcategory) => {
          const avgBmi = statsBySub[subcategory]?.media ?? 0
          const age = Number(subcategory.replace('Sub-', ''))
          const status = classifyBMI(avgBmi, age)
          const statusColor = getBMIColor(status)

          return (
            <TableRow key={subcategory}>
              <TableCell className="font-medium">{subcategory}</TableCell>
              <TableCell className="text-center">
                {(idealBySub[subcategory] ?? 0).toFixed(2)}
              </TableCell>
              <TableCell className="text-center">{avgBmi.toFixed(2)}</TableCell>
              <TableCell className="text-center">
                <span className={`font-medium ${statusColor}`}>{status}</span>
              </TableCell>
              <TableCell className="text-right">
                {statsBySub[subcategory]?.count ?? 0}
              </TableCell>
            </TableRow>
          )
        })}
      </TableBody>
    </Table>
  )
}
