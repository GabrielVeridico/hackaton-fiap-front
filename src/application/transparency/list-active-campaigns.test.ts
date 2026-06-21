import { describe, it, expect } from 'vitest';
import { listActiveCampaigns } from './list-active-campaigns';
import type { TransparencyGateway } from '../ports/transparency-gateway';
import { Result } from '@/domain/shared/result';

describe('listActiveCampaigns', () => {
  it('delega ao gateway', async () => {
    const gateway: TransparencyGateway = {
      listActiveCampaigns: async () =>
        Result.ok([{ id: '1', title: 'A', goal: 10, amountRaised: 5, percentage: 50 }]),
    };
    const r = await listActiveCampaigns(gateway);
    expect(r.ok).toBe(true);
    if (r.ok) expect(r.value).toHaveLength(1);
  });
});
