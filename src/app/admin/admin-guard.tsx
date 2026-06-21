'use client';

import { useEffect, type ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/use-auth';

export function AdminGuard({ children }: { children: ReactNode }) {
  const router = useRouter();
  const { user, isLoading } = useAuth();
  const allowed = user?.role === 'GestorONG';

  useEffect(() => {
    if (!isLoading && !allowed) {
      router.replace('/');
    }
  }, [isLoading, allowed, router]);

  if (isLoading) {
    return <p className="text-muted-foreground">Carregando…</p>;
  }
  if (!allowed) {
    return <p className="text-muted-foreground">Acesso restrito à gestão.</p>;
  }
  return <>{children}</>;
}
