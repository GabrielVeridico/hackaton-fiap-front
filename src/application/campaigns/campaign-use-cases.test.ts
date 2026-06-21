import { describe, it, expect, vi } from 'vitest';
import { Result } from '@/domain/shared/result';
import type { CampaignsAdminGateway } from '../ports/campaigns-admin-gateway';
import type { AuthGateway } from '../ports/auth-gateway';
import type { SessionStore } from '../ports/session-store';
import { listCampaigns, createCampaign, changeCampaignStatus } from './campaign-use-cases';

function store(at?: string): SessionStore {
  return { getAccessToken: async () => at, getRefreshToken: async () => 'r', setTokens: async () => {}, clear: async () => {} };
}
const auth = { refresh: vi.fn() } as unknown as AuthGateway;

describe('campaign use cases (autenticados)', () => {
  it('listCampaigns passa o token', async () => {
    const campaigns = { list: vi.fn().mockResolvedValue(Result.ok([])) } as unknown as CampaignsAdminGateway;
    const r = await listCampaigns({ campaigns, auth, store: store('tok') });
    expect(campaigns.list).toHaveBeenCalledWith('tok');
    expect(r.ok).toBe(true);
  });

  it('createCampaign passa input + token', async () => {
    const campaigns = { create: vi.fn().mockResolvedValue(Result.ok('new-id')) } as unknown as CampaignsAdminGateway;
    const input = { title: 'T', description: 'D', startDate: '2026-01-01', endDate: '2026-02-01', goal: 100 };
    const r = await createCampaign({ campaigns, auth, store: store('tok') }, input);
    expect(campaigns.create).toHaveBeenCalledWith(input, 'tok');
    expect(r.ok).toBe(true);
    if (r.ok) expect(r.value).toBe('new-id');
  });

  it('changeCampaignStatus passa id + action + token', async () => {
    const campaigns = { changeStatus: vi.fn().mockResolvedValue(Result.ok(undefined)) } as unknown as CampaignsAdminGateway;
    const r = await changeCampaignStatus({ campaigns, auth, store: store('tok') }, 'c1', 'Close');
    expect(campaigns.changeStatus).toHaveBeenCalledWith('c1', 'Close', 'tok');
    expect(r.ok).toBe(true);
  });

  it('sem sessão → unauthorized (gateway não chamado)', async () => {
    const campaigns = { list: vi.fn() } as unknown as CampaignsAdminGateway;
    const r = await listCampaigns({ campaigns, auth, store: store(undefined) });
    expect(campaigns.list).not.toHaveBeenCalled();
    expect(r.ok).toBe(false);
  });
});
