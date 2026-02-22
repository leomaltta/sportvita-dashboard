import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'

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
          <TableHead className="text-right">Estudantes</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {subcategories.map((subcategory) => (
          <TableRow key={subcategory}>
            <TableCell className="font-medium">{subcategory}</TableCell>
            <TableCell className="text-center">
              {(idealBySub[subcategory] ?? 0).toFixed(2)}
            </TableCell>
            <TableCell className="text-center">
              {(statsBySub[subcategory]?.media ?? 0).toFixed(2)}
            </TableCell>
            <TableCell className="text-right">
              {statsBySub[subcategory]?.count ?? 0}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}
