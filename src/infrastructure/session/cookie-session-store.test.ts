import { describe, it, expect, vi, beforeEach } from 'vitest';

const jar = new Map<string, string>();
const setCalls: Array<{ name: string; value: string; opts: Record<string, unknown> }> = [];

vi.mock('next/headers', () => ({
  cookies: async () => ({
    get: (name: string) => (jar.has(name) ? { name, value: jar.get(name) } : undefined),
    set: (name: string, value: string, opts: Record<string, unknown>) => {
      jar.set(name, value);
      setCalls.push({ name, value, opts });
    },
    delete: (name: string) => { jar.delete(name); },
  }),
}));

import { CookieSessionStore } from './cookie-session-store';

beforeEach(() => { jar.clear(); setCalls.length = 0; });

describe('CookieSessionStore', () => {
  it('grava cs_at/cs_rt como httpOnly e devolve nos getters', async () => {
    const store = new CookieSessionStore();
    await store.setTokens({ accessToken: 'a', refreshToken: 'r', expiresIn: 120 });
    expect(await store.getAccessToken()).toBe('a');
    expect(await store.getRefreshToken()).toBe('r');
    const at = setCalls.find((c) => c.name === 'cs_at');
    expect(at?.opts.httpOnly).toBe(true);
    expect(at?.opts.maxAge).toBe(120);
  });

  it('clear remove os dois cookies', async () => {
    const store = new CookieSessionStore();
    await store.setTokens({ accessToken: 'a', refreshToken: 'r', expiresIn: 120 });
    await store.clear();
    expect(await store.getAccessToken()).toBeUndefined();
    expect(await store.getRefreshToken()).toBeUndefined();
  });
});
