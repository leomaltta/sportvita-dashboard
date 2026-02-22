import AddProfForm from '@/components/forms/add-prof-form'
import { Separator } from '@/components/ui/separator'
import prisma from '../../../../../prisma/client'

async function getSportsOptions() {
  return prisma.sport.findMany({
    orderBy: { alterName: 'asc' },
    select: {
      id: true,
      alterName: true,
    },
  })
}

export default async function AddProfessorPage() {
  const sports = await getSportsOptions()

  return (
    <div className="ml-2 space-y-6">
      <div>
        <h3 className="text-lg font-medium">Adicionar Professor</h3>
        <p className="text-sm text-muted-foreground">
          Adicione um(a) novo(a) professor(a) ao sistema.
        </p>
      </div>
      <Separator />
      <AddProfForm sports={sports} />
    </div>
  )
}
