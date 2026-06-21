import { describe, it, expect, vi } from 'vitest';
import { HttpAuthGateway } from './http-auth-gateway';
import { loadConfig } from '../config/env';

const config = loadConfig({});

function json(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), { status, headers: { 'content-type': 'application/json' } });
}

describe('HttpAuthGateway', () => {
  it('login mapeia AuthResponse (PascalCase) para AuthTokens', async () => {
    const fetchImpl = vi.fn().mockResolvedValue(json({ AccessToken: 'a', RefreshToken: 'r', ExpiresIn: 120 }));
    const gw = new HttpAuthGateway(config, fetchImpl);
    const r = await gw.login('e@x.com', 'pw');
    const [url, init] = fetchImpl.mock.calls[0]!;
    expect(url).toBe('http://localhost:5001/api/auth/login');
    expect(JSON.parse((init as RequestInit).body as string)).toEqual({ Email: 'e@x.com', Password: 'pw' });
    expect(r.ok).toBe(true);
    if (r.ok) expect(r.value).toEqual({ accessToken: 'a', refreshToken: 'r', expiresIn: 120 });
  });

  it('register envia PersonType como inteiro (PascalCase)', async () => {
    const fetchImpl = vi.fn().mockResolvedValue(json({}, 201));
    const gw = new HttpAuthGateway(config, fetchImpl);
    const r = await gw.register({ personType: 'Company', document: '11', name: 'X', email: 'e@x.com', password: 'pw' });
    const body = JSON.parse((fetchImpl.mock.calls[0]![1] as RequestInit).body as string);
    expect(body.PersonType).toBe(1);
    expect(body.Document).toBe('11');
    expect(r.ok).toBe(true);
  });

  it('getCurrentUser injeta Bearer e mapeia UserResponse', async () => {
    const fetchImpl = vi.fn().mockResolvedValue(json({
      Id: 'u1', PersonType: 'Individual', Document: '529', Name: 'Ana', Email: 'a@x.com',
      Role: 'Doador', IsActive: true, IsOwner: false, CreatedAtUtc: 'x', UpdatedAtUtc: 'x',
    }));
    const gw = new HttpAuthGateway(config, fetchImpl);
    const r = await gw.getCurrentUser('tok');
    const headers = (fetchImpl.mock.calls[0]![1] as RequestInit).headers as Record<string, string>;
    expect(headers.Authorization).toBe('Bearer tok');
    expect(r.ok).toBe(true);
    if (r.ok) expect(r.value.role).toBe('Doador');
  });

  it('login com credenciais inválidas devolve unauthorized', async () => {
    const fetchImpl = vi.fn().mockResolvedValue(json({ title: 'Credenciais inválidas' }, 401));
    const gw = new HttpAuthGateway(config, fetchImpl);
    const r = await gw.login('e@x.com', 'bad');
    expect(r.ok).toBe(false);
    if (!r.ok) expect(r.error.kind).toBe('unauthorized');
  });
});
