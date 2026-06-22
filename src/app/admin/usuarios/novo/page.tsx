'use client';

import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { UserForm } from '../user-form';
import { useCreateUser } from '@/hooks/use-admin-users';
import { useAuth } from '@/hooks/use-auth';

export default function NovoUsuarioPage() {
  const router = useRouter();
  const { user } = useAuth();
  const { mutate, isPending, error } = useCreateUser();

  return (
    <Card className="mx-auto max-w-2xl">
      <CardHeader>
        <CardTitle>Novo usuário</CardTitle>
      </CardHeader>
      <CardContent>
        <UserForm
          actorIsOwner={user?.isOwner ?? false}
          isPending={isPending}
          error={error?.message ?? null}
          onSubmit={(input) =>
            mutate(input, { onSuccess: () => router.push('/admin/usuarios') })
          }
        />
      </CardContent>
    </Card>
  );
}
