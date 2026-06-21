import { describe, it, expect } from 'vitest';
import { mapTransparencyCampaign } from './transparency-mapper';

describe('mapTransparencyCampaign', () => {
  it('mapeia DTO do backend para domínio e recalcula o percentual (clamp)', () => {
    const r = mapTransparencyCampaign(
      { id: 'abc', title: 'Cestas', description: 'd', goal: 1000, amountRaised: 2500, percentual: 999 },
      0,
    );
    expect(r.id).toBe('abc');
    expect(r.title).toBe('Cestas');
    expect(r.percentage).toBe(100);
  });

  it('usa fallback de id quando o backend ainda não envia (Lacuna 1)', () => {
    const r = mapTransparencyCampaign({ title: 'X', goal: 100, amountRaised: 50, percentual: 50 }, 3);
    expect(r.id).toBe('idx-3');
    expect(r.percentage).toBe(50);
  });
});
