import { describe, it, expect, vi } from 'vitest';
import { Result } from '@/domain/shared/result';
import type { DonationsGateway } from '../ports/donations-gateway';
import type { AuthGateway } from '../ports/auth-gateway';
import type { SessionStore } from '../ports/session-store';
import { createDonation, getDonation, listMyDonations } from './donation-use-cases';

function store(at?: string): SessionStore {
  return {
    getAccessToken: async () => at,
    getRefreshToken: async () => 'r',
    setTokens: async () => {},
    clear: async () => {},
  };
}
const auth = { refresh: vi.fn() } as unknown as AuthGateway;

describe('createDonation', () => {
  it('chama o gateway com o access token da sessão', async () => {
    const donations = {
      createDonation: vi.fn().mockResolvedValue(Result.ok({ donationId: 'd1', status: 'Pending' })),
    } as unknown as DonationsGateway;
    const r = await createDonation({ donations, auth, store: store('tok') }, {
      campaignId: 'c1', amount: 50, method: 'Pix',
    });
    expect(donations.createDonation).toHaveBeenCalledWith({ campaignId: 'c1', amount: 50, method: 'Pix' }, 'tok');
    expect(r.ok).toBe(true);
    if (r.ok) expect(r.value.donationId).toBe('d1');
  });

  it('sem sessão devolve unauthorized', async () => {
    const donations = { createDonation: vi.fn() } as unknown as DonationsGateway;
    const r = await createDonation({ donations, auth, store: store(undefined) }, {
      campaignId: 'c1', amount: 50, method: 'Pix',
    });
    expect(donations.createDonation).not.toHaveBeenCalled();
    expect(r.ok).toBe(false);
  });
});

describe('getDonation / listMyDonations', () => {
  it('getDonation passa o id + token', async () => {
    const donations = {
      getDonationById: vi.fn().mockResolvedValue(Result.ok({ id: 'd1' })),
    } as unknown as DonationsGateway;
    const r = await getDonation({ donations, auth, store: store('tok') }, 'd1');
    expect(donations.getDonationById).toHaveBeenCalledWith('d1', 'tok');
    expect(r.ok).toBe(true);
  });

  it('listMyDonations delega autenticado', async () => {
    const donations = {
      listMyDonations: vi.fn().mockResolvedValue(Result.ok([])),
    } as unknown as DonationsGateway;
    const r = await listMyDonations({ donations, auth, store: store('tok') });
    expect(donations.listMyDonations).toHaveBeenCalledWith('tok');
    expect(r.ok).toBe(true);
  });
});
