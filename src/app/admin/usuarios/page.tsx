import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { UsersTable } from './users-table';

export const metadata = { title: 'Gestão de usuários — Conexão Solidária' };

export default function AdminUsuariosPage() {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Usuários</h1>
        <Button render={<Link href="/admin/usuarios/novo" />} nativeButton={false}>Novo usuário</Button>
      </div>
      <UsersTable />
    </div>
  );
}
