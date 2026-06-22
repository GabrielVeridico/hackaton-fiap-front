'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/use-auth';
import {
  useUsers, useChangeUserRole, useDeactivateUser, useReactivateUser,
} from '@/hooks/use-admin-users';
import { canChangeRole, canManageUser } from '@/domain/auth/permissions';
import type { AuthUser } from '@/domain/auth/auth-user';

function RowActions({ user, actorIsOwner }: { user: AuthUser; actorIsOwner: boolean }) {
  const role = useChangeUserRole(user.id);
  const deactivate = useDeactivateUser(user.id);
  const reactivate = useReactivateUser(user.id);
  const manageable = canManageUser(actorIsOwner, user);
  const roleChangeable = canChangeRole(actorIsOwner, user);

  if (!manageable && !roleChangeable) {
    return <span className="text-xs text-muted-foreground">—</span>;
  }

  const busy = role.isPending || deactivate.isPending || reactivate.isPending;
  return (
    <div className="flex flex-wrap gap-2">
      {manageable ? (
        <Button render={<Link href={`/admin/usuarios/${user.id}`} />} variant="outline" size="sm" nativeButton={false}>
          Editar
        </Button>
      ) : null}
      {roleChangeable ? (
        <Button variant="outline" size="sm" disabled={busy} onClick={() => role.mutate(user.role === 'GestorONG' ? 'Doador' : 'GestorONG')}>
          {user.role === 'GestorONG' ? 'Tornar Doador' : 'Tornar Gestor'}
        </Button>
      ) : null}
      {manageable && user.isActive ? (
        <Button variant="outline" size="sm" disabled={busy} onClick={() => deactivate.mutate()}>Inativar</Button>
      ) : null}
      {manageable && !user.isActive ? (
        <Button variant="outline" size="sm" disabled={busy} onClick={() => reactivate.mutate()}>Reativar</Button>
      ) : null}
    </div>
  );
}

export function UsersTable() {
  const { user: actor } = useAuth();
  const { data, isLoading, isError, error } = useUsers();

  if (isLoading) {
    return <p className="text-muted-foreground">Carregando…</p>;
  }
  if (isError) {
    return <p className="text-destructive">{(error as Error).message}</p>;
  }
  const users = data ?? [];
  const actorIsOwner = actor?.isOwner ?? false;

  return (
    <div className="overflow-x-auto rounded-lg border">
      <table className="w-full text-sm">
        <thead className="bg-muted/50 text-left">
          <tr>
            <th className="p-3">Nome</th>
            <th className="p-3">E-mail</th>
            <th className="p-3">Papel</th>
            <th className="p-3">Situação</th>
            <th className="p-3">Ações</th>
          </tr>
        </thead>
        <tbody className="divide-y">
          {users.map((u) => (
            <tr key={u.id}>
              <td className="p-3 font-medium">
                {u.name}
                {u.isOwner ? <span className="ml-1 text-xs text-primary">(Owner)</span> : null}
              </td>
              <td className="p-3">{u.email}</td>
              <td className="p-3">{u.role}</td>
              <td className="p-3">{u.isActive ? 'Ativo' : 'Inativo'}</td>
              <td className="p-3"><RowActions user={u} actorIsOwner={actorIsOwner} /></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
