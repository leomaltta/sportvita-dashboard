import AddEstudanteForm from '@/components/forms/add-estudante-form'
import { Separator } from '@/components/ui/separator'

export default function AddEstudantePage() {
  return (
    <div className="ml-2 space-y-6">
      <div>
        <h3 className="text-lg font-medium">Adicionar Estudante</h3>
        <p className="text-sm text-muted-foreground">
          Adicione um novo estudante ao sistema.
        </p>
      </div>
      <Separator />
      <AddEstudanteForm />
    </div>
  )
}
