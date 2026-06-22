'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useUsers, useUpdateUserName } from '@/hooks/use-admin-users';

export function EditUser({ id }: { id: string }) {
  const router = useRouter();
  const { data, isLoading } = useUsers();
  const update = useUpdateUserName(id);
  const target = (data ?? []).find((u) => u.id === id);
  const [name, setName] = useState(target?.name ?? '');

  if (isLoading) {
    return <p className="text-muted-foreground">Carregando…</p>;
  }
  if (!target) {
    return <p className="text-muted-foreground">Usuário não encontrado.</p>;
  }

  return (
    <Card className="mx-auto max-w-lg">
      <CardHeader>
        <CardTitle>Editar usuário</CardTitle>
      </CardHeader>
      <CardContent>
        <form
          className="space-y-4"
          onSubmit={(e) => {
            e.preventDefault();
            update.mutate(name || target.name, {
              onSuccess: () => router.push('/admin/usuarios'),
            });
          }}
        >
          <p className="text-sm text-muted-foreground">
            {target.email} · {target.role}
          </p>
          <div className="space-y-1.5">
            <Label htmlFor="name">Nome</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder={target.name}
            />
          </div>
          {update.error ? (
            <p className="text-sm text-destructive">{update.error.message}</p>
          ) : null}
          <Button type="submit" disabled={update.isPending}>
            {update.isPending ? 'Salvando…' : 'Salvar'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
