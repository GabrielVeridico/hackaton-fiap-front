import { describe, it, expect, vi } from 'vitest';
import { callUpstream } from './upstream-client';
import { loadConfig } from '../config/env';

const config = loadConfig({});

function jsonResponse(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'content-type': 'application/json' },
  });
}

describe('callUpstream', () => {
  it('monta a URL pelo grupo e devolve Result.ok', async () => {
    const fetchImpl = vi.fn().mockResolvedValue(jsonResponse([{ x: 1 }]));
    const r = await callUpstream<{ x: number }[]>(
      { group: 'donations', path: '/api/transparency/campaigns' },
      { config, fetchImpl },
    );
    expect(fetchImpl).toHaveBeenCalledWith(
      'http://localhost:5003/api/transparency/campaigns',
      expect.objectContaining({ method: 'GET' }),
    );
    expect(r.ok).toBe(true);
    if (r.ok) expect(r.value[0]?.x).toBe(1);
  });

  it('injeta Bearer quando informado', async () => {
    const fetchImpl = vi.fn().mockResolvedValue(jsonResponse({}));
    await callUpstream({ group: 'users', path: '/api/users/me', bearer: 'tok' }, { config, fetchImpl });
    const headers = (fetchImpl.mock.calls[0]![1] as RequestInit).headers as Record<string, string>;
    expect(headers.Authorization).toBe('Bearer tok');
  });

  it('mapeia status de erro para DomainError', async () => {
    const fetchImpl = vi
      .fn()
      .mockResolvedValue(jsonResponse({ title: 'Conflito', detail: 'já existe' }, 409));
    const r = await callUpstream({ group: 'users', path: '/api/auth/register', method: 'POST', body: {} }, { config, fetchImpl });
    expect(r.ok).toBe(false);
    if (!r.ok) {
      expect(r.error.kind).toBe('conflict');
      expect(r.error.message).toContain('já existe');
    }
  });
});
