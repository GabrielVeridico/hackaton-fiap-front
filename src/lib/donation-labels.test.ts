import { describe, it, expect } from 'vitest';
import { statusLabel, methodLabel } from './donation-labels';

describe('statusLabel', () => {
  it('traduz status', () => {
    expect(statusLabel('Pending')).toBe('Processando');
    expect(statusLabel('Approved')).toBe('Aprovada');
    expect(statusLabel('Declined')).toBe('Recusada');
  });
});
describe('methodLabel', () => {
  it('traduz método', () => {
    expect(methodLabel('Pix')).toBe('Pix');
    expect(methodLabel('CreditCard')).toBe('Cartão de crédito');
    expect(methodLabel('BankTransfer')).toBe('Transferência');
  });
});
