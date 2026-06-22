'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { bffGet, bffPost, bffPut, bffPatch } from '@/lib/bff-client';
import type { AuthUser, Role } from '@/domain/auth/auth-user';
import type { CreateUserInput } from '@/application/users/user-types';

const LIST_KEY = ['users', 'admin'] as const;

function useInvalidateUsers() {
  const qc = useQueryClient();
  return () => qc.invalidateQueries({ queryKey: LIST_KEY });
}

export function useUsers() {
  return useQuery({ queryKey: LIST_KEY, queryFn: () => bffGet<AuthUser[]>('/users') });
}

export function useCreateUser() {
  const invalidate = useInvalidateUsers();
  return useMutation({
    mutationFn: (input: CreateUserInput) => bffPost<void>('/users', input),
    onSuccess: () => { void invalidate(); },
  });
}

export function useUpdateUserName(id: string) {
  const invalidate = useInvalidateUsers();
  return useMutation({
    mutationFn: (name: string) => bffPut<void>(`/users/${id}`, { name }),
    onSuccess: () => { void invalidate(); },
  });
}

export function useChangeUserRole(id: string) {
  const invalidate = useInvalidateUsers();
  return useMutation({
    mutationFn: (role: Role) => bffPatch<void>(`/users/${id}/role`, { role }),
    onSuccess: () => { void invalidate(); },
  });
}

export function useDeactivateUser(id: string) {
  const invalidate = useInvalidateUsers();
  return useMutation({
    mutationFn: () => bffPatch<void>(`/users/${id}/deactivate`, {}),
    onSuccess: () => { void invalidate(); },
  });
}

export function useReactivateUser(id: string) {
  const invalidate = useInvalidateUsers();
  return useMutation({
    mutationFn: () => bffPatch<void>(`/users/${id}/reactivate`, {}),
    onSuccess: () => { void invalidate(); },
  });
}
