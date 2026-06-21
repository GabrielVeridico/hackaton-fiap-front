import { describe, it, expect, vi } from 'vitest';
import { HttpDonationsGateway } from './http-donations-gateway';
import { loadConfig } from '../config/env';

const config = loadConfig({});
function json(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), { status, headers: { 'content-type': 'application/json' } });
}

describe('HttpDonationsGateway', () => {
  it('createDonation posta camelCase + paymentMethod inteiro no grupo donations com Bearer', async () => {
    const fetchImpl = vi.fn().mockResolvedValue(json({ donationId: 'd1', status: 'Pending' }, 202));
    const gw = new HttpDonationsGateway(config, fetchImpl);
    const r = await gw.createDonation({ campaignId: 'c1', amount: 50, method: 'CreditCard' }, 'tok');
    const [url, init] = fetchImpl.mock.calls[0]!;
    expect(url).toBe('http://localhost:5003/api/donations');
    const body = JSON.parse((init as RequestInit).body as string);
    expect(body).toEqual({ campaignId: 'c1', amount: 50, paymentMethod: 1 });
    expect(((init as RequestInit).headers as Record<string, string>).Authorization).toBe('Bearer tok');
    expect(r.ok).toBe(true);
    if (r.ok) expect(r.value.donationId).toBe('d1');
  });

  it('getDonationById mapeia DonationResponse e injeta Bearer', async () => {
    const fetchImpl = vi.fn().mockResolvedValue(json({
      id: 'd1', campaignId: 'c1', amount: 50, method: 'Pix', status: 'Approved',
      declineReason: null, createdAt: 'x', processedAt: 'y',
    }));
    const gw = new HttpDonationsGateway(config, fetchImpl);
    const r = await gw.getDonationById('d1', 'tok');
    expect(fetchImpl.mock.calls[0]![0]).toBe('http://localhost:5003/api/donations/d1');
    expect(r.ok).toBe(true);
    if (r.ok) expect(r.value.status).toBe('Approved');
  });

  it('createDonation 422 vira unprocessable', async () => {
    const fetchImpl = vi.fn().mockResolvedValue(json({ detail: 'Campanha encerrada' }, 422));
    const gw = new HttpDonationsGateway(config, fetchImpl);
    const r = await gw.createDonation({ campaignId: 'c1', amount: 50, method: 'Pix' }, 'tok');
    expect(r.ok).toBe(false);
    if (!r.ok) expect(r.error.kind).toBe('unprocessable');
  });
});
