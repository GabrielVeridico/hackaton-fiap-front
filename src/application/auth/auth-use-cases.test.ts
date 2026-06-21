import { describe, it, expect, vi } from 'vitest';
import { Result } from '@/domain/shared/result';
import type { AuthGateway } from '../ports/auth-gateway';
import type { SessionStore } from '../ports/session-store';
import type { AuthUser } from '@/domain/auth/auth-user';
import { runAuthenticated, login, logout } from './auth-use-cases';

const user: AuthUser = {
  id: 'u1', name: 'Ana', email: 'a@x.com', document: '529', personType: 'Individual',
  role: 'Doador', isActive: true, isOwner: false,
};

function makeStore(initial: { at?: string; rt?: string } = {}): SessionStore & { state: { at?: string; rt?: string } } {
  const state: { at?: string; rt?: string } = { ...initial };
  return {
    state,
    getAccessToken: async () => state.at,
    getRefreshToken: async () => state.rt,
    setTokens: async (t) => { state.at = t.accessToken; state.rt = t.refreshToken; },
    clear: async () => { state.at = undefined; state.rt = undefined; },
  };
}

describe('runAuthenticated', () => {
  it('chama com o access token e retorna ok sem refresh', async () => {
    const store = makeStore({ at: 'good', rt: 'r1' });
    const gateway = { refresh: vi.fn() } as unknown as AuthGateway;
    const call = vi.fn().mockResolvedValue(Result.ok('valor'));
    const r = await runAuthenticated(store, gateway, call);
    expect(call).toHaveBeenCalledWith('good');
    expect(gateway.refresh).not.toHaveBeenCalled();
    expect(r.ok).toBe(true);
  });

  it('em 401 faz refresh, persiste o novo par e repete', async () => {
    const store = makeStore({ at: 'expired', rt: 'r1' });
    const gateway = {
      refresh: vi.fn().mockResolvedValue(Result.ok({ accessToken: 'new', refreshToken: 'r2', expiresIn: 100 })),
    } as unknown as AuthGateway;
    const call = vi.fn()
      .mockResolvedValueOnce(Result.fail({ kind: 'unauthorized', message: '401' }))
      .mockResolvedValueOnce(Result.ok('ok2'));
    const r = await runAuthenticated(store, gateway, call);
    expect(gateway.refresh).toHaveBeenCalledWith('r1');
    expect(store.state.at).toBe('new');
    expect(call).toHaveBeenLastCalledWith('new');
    expect(r.ok).toBe(true);
  });

  it('se o refresh falha, limpa a sessão e devolve unauthorized', async () => {
    const store = makeStore({ at: 'expired', rt: 'r1' });
    const gateway = {
      refresh: vi.fn().mockResolvedValue(Result.fail({ kind: 'unauthorized', message: 'reuse' })),
    } as unknown as AuthGateway;
    const call = vi.fn().mockResolvedValue(Result.fail({ kind: 'unauthorized', message: '401' }));
    const r = await runAuthenticated(store, gateway, call);
    expect(store.state.at).toBeUndefined();
    expect(r.ok).toBe(false);
    if (!r.ok) expect(r.error.kind).toBe('unauthorized');
  });

  it('sem access token devolve unauthorized', async () => {
    const store = makeStore({});
    const gateway = { refresh: vi.fn() } as unknown as AuthGateway;
    const call = vi.fn();
    const r = await runAuthenticated(store, gateway, call);
    expect(call).not.toHaveBeenCalled();
    expect(r.ok).toBe(false);
  });

  it('em 401 sem refresh token limpa a sessão e devolve unauthorized', async () => {
    const store = makeStore({ at: 'expired' });
    const gateway = { refresh: vi.fn() } as unknown as AuthGateway;
    const call = vi.fn().mockResolvedValue(Result.fail({ kind: 'unauthorized', message: '401' }));
    const r = await runAuthenticated(store, gateway, call);
    expect(gateway.refresh).not.toHaveBeenCalled();
    expect(store.state.at).toBeUndefined();
    expect(r.ok).toBe(false);
  });
});

describe('login', () => {
  it('autentica, persiste tokens e devolve o usuário', async () => {
    const store = makeStore();
    const gateway = {
      login: vi.fn().mockResolvedValue(Result.ok({ accessToken: 'a', refreshToken: 'r', expiresIn: 100 })),
      getCurrentUser: vi.fn().mockResolvedValue(Result.ok(user)),
    } as unknown as AuthGateway;
    const r = await login(gateway, store, { email: 'a@x.com', password: 'x' });
    expect(store.state.at).toBe('a');
    expect(r.ok).toBe(true);
    if (r.ok) expect(r.value.name).toBe('Ana');
  });

  it('propaga falha de credenciais sem persistir', async () => {
    const store = makeStore();
    const gateway = {
      login: vi.fn().mockResolvedValue(Result.fail({ kind: 'unauthorized', message: 'bad' })),
      getCurrentUser: vi.fn(),
    } as unknown as AuthGateway;
    const r = await login(gateway, store, { email: 'a@x.com', password: 'x' });
    expect(store.state.at).toBeUndefined();
    expect(r.ok).toBe(false);
  });
});

describe('logout', () => {
  it('chama o upstream (best-effort) e sempre limpa a sessão', async () => {
    const store = makeStore({ at: 'a', rt: 'r' });
    const gateway = { logout: vi.fn().mockResolvedValue(Result.ok(undefined)) } as unknown as AuthGateway;
    const r = await logout(gateway, store);
    expect(gateway.logout).toHaveBeenCalledWith('r', 'a');
    expect(store.state.at).toBeUndefined();
    expect(r.ok).toBe(true);
  });

  it('não chama o upstream quando falta um token, mas limpa a sessão', async () => {
    const store = makeStore({ at: 'a' });
    const gateway = { logout: vi.fn() } as unknown as AuthGateway;
    const r = await logout(gateway, store);
    expect(gateway.logout).not.toHaveBeenCalled();
    expect(store.state.at).toBeUndefined();
    expect(r.ok).toBe(true);
  });
});
