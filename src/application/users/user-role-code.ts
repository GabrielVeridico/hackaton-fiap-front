import type { Role } from '@/domain/auth/auth-user';

export function userRoleToCode(role: Role): 0 | 1 {
  return role === 'GestorONG' ? 1 : 0;
}
