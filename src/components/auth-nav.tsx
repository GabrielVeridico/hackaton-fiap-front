'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { useAuth, useLogout } from '@/hooks/use-auth';

export function AuthNav() {
  const router = useRouter();
  const { user, isLoading } = useAuth();
  const { mutate: logout, isPending } = useLogout();

  if (isLoading) {
    return <span className="text-sm text-muted-foreground">…</span>;
  }

  if (!user) {
    return (
      <>
        <Button render={<Link href="/login" />} variant="ghost" nativeButton={false}>Entrar</Button>
        <Button render={<Link href="/cadastro" />} nativeButton={false}>Cadastrar</Button>
      </>
    );
  }

  const firstName = user.name.split(' ')[0] ?? user.name;
  return (
    <>
      <Button render={<Link href="/campanhas" />} variant="ghost" nativeButton={false}>Campanhas</Button>
      {user.role === 'Doador' ? (
        <Button render={<Link href="/minhas-doacoes" />} variant="ghost" nativeButton={false}>Minhas doações</Button>
      ) : null}
      <Button render={<Link href="/perfil" />} variant="ghost" nativeButton={false}>
        Olá, {firstName}
      </Button>
      <Button variant="outline" disabled={isPending} onClick={() => logout(undefined, { onSuccess: () => router.push('/') })}>
        {isPending ? 'Saindo…' : 'Sair'}
      </Button>
    </>
  );
}
