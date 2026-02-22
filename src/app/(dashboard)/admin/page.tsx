import ProfileUserForm from '@/components/forms/profile-user-form'
import { Separator } from '@/components/ui/separator'

export default function AdminPanelPage() {
  return (
    <div className="ml-2 space-y-6">
      <div>
        <h3 className="text-lg font-medium">Perfil</h3>
        <p className="text-sm text-muted-foreground">
          Personalize seu perfil administrativo atualizando suas informações
          pessoais.
        </p>
      </div>
      <Separator />
      <ProfileUserForm />
    </div>
  )
}
