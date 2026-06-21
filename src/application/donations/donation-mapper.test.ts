import { describe, it, expect } from 'vitest';
import { mapDonation, mapCreateResult } from './donation-mapper';
import type { DonationResponseDto } from './donation-dto';

const dto: DonationResponseDto = {
  id: 'd1', campaignId: 'c1', amount: 50, method: 'Pix', status: 'Pending',
  declineReason: null, createdAt: '2026-01-01T00:00:00Z', processedAt: null,
};

describe('mapDonation', () => {
  it('mapeia DTO camelCase para domínio; null vira undefined', () => {
    const d = mapDonation(dto);
    expect(d.id).toBe('d1');
    expect(d.method).toBe('Pix');
    expect(d.status).toBe('Pending');
    expect(d.declineReason).toBeUndefined();
    expect(d.processedAt).toBeUndefined();
  });
});

describe('mapCreateResult', () => {
  it('mapeia o 202 { donationId, status }', () => {
    const r = mapCreateResult({ donationId: 'd9', status: 'Pending' });
    expect(r).toEqual({ donationId: 'd9', status: 'Pending' });
  });
});
