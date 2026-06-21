import { describe, it, expect } from 'vitest';
import { mapCampaign } from './campaign-mapper';
import type { CampaignResponseDto } from './campaign-dto';

const dto: CampaignResponseDto = {
  id: 'c1', title: 'Cestas', description: 'd', startDate: '2026-01-01T00:00:00Z',
  endDate: '2026-12-31T00:00:00Z', goal: 1000, amountRaised: 250, status: 'Active',
  completionReason: null, createdAt: 'x', updatedAt: 'y',
};

describe('mapCampaign', () => {
  it('mapeia camelCase para domínio; completionReason null vira undefined', () => {
    const c = mapCampaign(dto);
    expect(c.id).toBe('c1');
    expect(c.status).toBe('Active');
    expect(c.completionReason).toBeUndefined();
    expect(c.goal).toBe(1000);
  });

  it('preserva completionReason quando presente', () => {
    const c = mapCampaign({ ...dto, status: 'Completed', completionReason: 'GoalReached' });
    expect(c.completionReason).toBe('GoalReached');
  });
});
