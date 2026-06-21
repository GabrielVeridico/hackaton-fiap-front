import { describe, it, expect } from 'vitest';
import { campaignStatusLabel, completionReasonLabel } from './campaign-labels';

describe('campaignStatusLabel', () => {
  it('traduz status', () => {
    expect(campaignStatusLabel('Active')).toBe('Ativa');
    expect(campaignStatusLabel('Completed')).toBe('Concluída');
    expect(campaignStatusLabel('Cancelled')).toBe('Cancelada');
  });
});
describe('completionReasonLabel', () => {
  it('traduz motivo', () => {
    expect(completionReasonLabel('GoalReached')).toBe('Meta atingida');
    expect(completionReasonLabel('ManuallyClosed')).toBe('Encerrada manualmente');
    expect(completionReasonLabel('Expired')).toBe('Expirada');
  });
});
