'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { bffPost } from '@/lib/bff-client';
import type { AuthUser, PersonType } from '@/domain/auth/auth-user';

const ME_KEY = ['auth', 'me'] as const;

async function fetchMe(): Promise<AuthUser | null> {
  const response = await fetch('/api/bff/auth/me', { headers: { Accept: 'application/json' } });
  if (response.status === 401) {
    return null;
  }
  if (!response.ok) {
    throw new Error(`Erro ${response.status}`);
  }
  return (await response.json()) as AuthUser;
}

export function useAuth(): { user: AuthUser | null; isLoading: boolean } {
  const { data, isLoading } = useQuery({ queryKey: ME_KEY, queryFn: fetchMe, retry: false, staleTime: 60_000 });
  return { user: data ?? null, isLoading };
}

export function useLogin() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (input: { email: string; password: string }) => bffPost<AuthUser>('/auth/login', input),
    onSuccess: (user) => { qc.setQueryData(ME_KEY, user); },
  });
}

export interface RegisterBody {
  personType: PersonType;
  document: string;
  name: string;
  email: string;
  password: string;
}

export function useRegister() {
  return useMutation({ mutationFn: (input: RegisterBody) => bffPost<void>('/auth/register', input) });
}

export function useLogout() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: () => bffPost<void>('/auth/logout', {}),
    onSuccess: () => { qc.setQueryData(ME_KEY, null); },
  });
}
