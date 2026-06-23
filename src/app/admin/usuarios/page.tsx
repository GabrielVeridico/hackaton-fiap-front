import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { PageHeader } from '@/components/page-header';
import { UsersTable } from './users-table';

export const metadata = { title: 'Gestão de usuários — Conexão Solidária' };

export default function AdminUsuariosPage() {
  return (
    <div className="space-y-8">
      <PageHeader
        title="Usuários"
        subtitle="Gerencie doadores e gestores conforme suas permissões."
        action={
          <Button render={<Link href="/admin/usuarios/novo" />} nativeButton={false}>
            Novo usuário
          </Button>
        }
      />
      <UsersTable />
    </div>
  );
}
