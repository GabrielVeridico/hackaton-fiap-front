import { describe, it, expect, vi } from 'vitest';
import { Result } from '@/domain/shared/result';
import type { UsersAdminGateway } from '../ports/users-admin-gateway';
import type { AuthGateway } from '../ports/auth-gateway';
import type { SessionStore } from '../ports/session-store';
import { listUsers, createUser, changeUserRole, deactivateUser } from './user-use-cases';

function store(at?: string): SessionStore {
  return { getAccessToken: async () => at, getRefreshToken: async () => 'r', setTokens: async () => {}, clear: async () => {} };
}
const auth = { refresh: vi.fn() } as unknown as AuthGateway;

describe('user use cases (autenticados)', () => {
  it('listUsers passa o token', async () => {
    const users = { list: vi.fn().mockResolvedValue(Result.ok([])) } as unknown as UsersAdminGateway;
    const r = await listUsers({ users, auth, store: store('tok') });
    expect(users.list).toHaveBeenCalledWith('tok');
    expect(r.ok).toBe(true);
  });

  it('createUser passa input + token', async () => {
    const users = { create: vi.fn().mockResolvedValue(Result.ok(undefined)) } as unknown as UsersAdminGateway;
    const input = { personType: 'Individual' as const, document: '529', name: 'X', email: 'e@x.com', password: 'Senha@123', role: 'Doador' as const };
    const r = await createUser({ users, auth, store: store('tok') }, input);
    expect(users.create).toHaveBeenCalledWith(input, 'tok');
    expect(r.ok).toBe(true);
  });

  it('changeUserRole passa id+role+token; deactivateUser passa id+token', async () => {
    const users = {
      changeRole: vi.fn().mockResolvedValue(Result.ok(undefined)),
      deactivate: vi.fn().mockResolvedValue(Result.ok(undefined)),
    } as unknown as UsersAdminGateway;
    await changeUserRole({ users, auth, store: store('tok') }, 'u1', 'GestorONG');
    expect(users.changeRole).toHaveBeenCalledWith('u1', 'GestorONG', 'tok');
    await deactivateUser({ users, auth, store: store('tok') }, 'u1');
    expect(users.deactivate).toHaveBeenCalledWith('u1', 'tok');
  });

  it('sem sessão → unauthorized (gateway não chamado)', async () => {
    const users = { list: vi.fn() } as unknown as UsersAdminGateway;
    const r = await listUsers({ users, auth, store: store(undefined) });
    expect(users.list).not.toHaveBeenCalled();
    expect(r.ok).toBe(false);
  });
});
