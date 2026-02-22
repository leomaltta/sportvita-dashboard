import AddAlunoForm from '@/components/forms/add-aluno-form'
import { Separator } from '@/components/ui/separator'

export default function AddAlunoPage() {
  return (
    <div className="ml-2 space-y-6">
      <div>
        <h3 className="text-lg font-medium">Adicionar Estudante</h3>
        <p className="text-sm text-muted-foreground">
          Adicione um novo estudante ao sistema.
        </p>
      </div>
      <Separator />
      <AddAlunoForm />
    </div>
  )
}
