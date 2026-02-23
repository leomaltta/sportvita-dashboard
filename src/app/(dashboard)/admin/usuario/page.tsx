import AddUserForm from '@/components/forms/add-user-form'
import { Separator } from '@/components/ui/separator'

export default function AddUserPage() {
  return (
    <div className="ml-2 space-y-6">
      <div>
        <h3 className="text-lg font-medium">Adicionar Usuário</h3>
        <p className="text-sm text-muted-foreground">
          Crie novos acessos com nome, e-mail, foto, senha e role.
        </p>
      </div>
      <Separator />
      <AddUserForm />
    </div>
  )
}
