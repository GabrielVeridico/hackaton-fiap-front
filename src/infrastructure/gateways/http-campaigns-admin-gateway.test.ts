import { describe, it, expect, vi } from 'vitest';
import { HttpCampaignsAdminGateway } from './http-campaigns-admin-gateway';
import { loadConfig } from '../config/env';

const config = loadConfig({});
function json(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), { status, headers: { 'content-type': 'application/json' } });
}

describe('HttpCampaignsAdminGateway', () => {
  it('list busca do grupo donations com Bearer e mapeia', async () => {
    const fetchImpl = vi.fn().mockResolvedValue(json([{
      id: 'c1', title: 'A', description: 'd', startDate: 'x', endDate: 'y', goal: 100, amountRaised: 10,
      status: 'Active', completionReason: null, createdAt: 'x', updatedAt: 'y',
    }]));
    const gw = new HttpCampaignsAdminGateway(config, fetchImpl);
    const r = await gw.list('tok');
    expect(fetchImpl.mock.calls[0]![0]).toBe('http://localhost:5003/api/campaigns');
    expect(((fetchImpl.mock.calls[0]![1] as RequestInit).headers as Record<string, string>).Authorization).toBe('Bearer tok');
    expect(r.ok).toBe(true);
    if (r.ok) expect(r.value[0]?.status).toBe('Active');
  });

  it('create posta camelCase e devolve o id (201)', async () => {
    const fetchImpl = vi.fn().mockResolvedValue(json({ id: 'new-id' }, 201));
    const gw = new HttpCampaignsAdminGateway(config, fetchImpl);
    const input = { title: 'T', description: 'D', startDate: '2026-01-01', endDate: '2026-02-01', goal: 500 };
    const r = await gw.create(input, 'tok');
    const [url, init] = fetchImpl.mock.calls[0]!;
    expect(url).toBe('http://localhost:5003/api/campaigns');
    expect((init as RequestInit).method).toBe('POST');
    expect(JSON.parse((init as RequestInit).body as string)).toEqual(input);
    expect(r.ok).toBe(true);
    if (r.ok) expect(r.value).toBe('new-id');
  });

  it('changeStatus envia { action: <int> } via PATCH', async () => {
    const fetchImpl = vi.fn().mockResolvedValue(new Response(null, { status: 204 }));
    const gw = new HttpCampaignsAdminGateway(config, fetchImpl);
    const r = await gw.changeStatus('c1', 'Cancel', 'tok');
    const [url, init] = fetchImpl.mock.calls[0]!;
    expect(url).toBe('http://localhost:5003/api/campaigns/c1/status');
    expect((init as RequestInit).method).toBe('PATCH');
    expect(JSON.parse((init as RequestInit).body as string)).toEqual({ action: 1 });
    expect(r.ok).toBe(true);
  });
});
