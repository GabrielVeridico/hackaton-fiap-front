import { describe, it, expect } from 'vitest';
import { mapTransparencyCampaign } from './transparency-mapper';

describe('mapTransparencyCampaign', () => {
  it('mapeia DTO do backend para domínio e recalcula o percentual (clamp)', () => {
    const r = mapTransparencyCampaign(
      { Id: 'abc', Title: 'Cestas', Description: 'd', Goal: 1000, AmountRaised: 2500, Percentual: 999 },
      0,
    );
    expect(r.id).toBe('abc');
    expect(r.title).toBe('Cestas');
    expect(r.percentage).toBe(100);
  });

  it('usa fallback de id quando o backend ainda não envia (Lacuna 1)', () => {
    const r = mapTransparencyCampaign({ Title: 'X', Goal: 100, AmountRaised: 50, Percentual: 50 }, 3);
    expect(r.id).toBe('idx-3');
    expect(r.percentage).toBe(50);
  });
});
