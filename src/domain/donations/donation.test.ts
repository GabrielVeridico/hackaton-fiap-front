import { describe, it, expect } from 'vitest';
import { paymentMethodToCode, endsInTestDeclineCents, isPositiveAmount } from './donation';

describe('paymentMethodToCode', () => {
  it('mapeia Pix=0, CreditCard=1, BankTransfer=2', () => {
    expect(paymentMethodToCode('Pix')).toBe(0);
    expect(paymentMethodToCode('CreditCard')).toBe(1);
    expect(paymentMethodToCode('BankTransfer')).toBe(2);
  });
});

describe('endsInTestDeclineCents', () => {
  it('detecta centavos ,99 (marcador de recusa)', () => {
    expect(endsInTestDeclineCents(10.99)).toBe(true);
    expect(endsInTestDeclineCents(100)).toBe(false);
    expect(endsInTestDeclineCents(5.9)).toBe(false);
    expect(endsInTestDeclineCents(0.99)).toBe(true);
  });
});

describe('isPositiveAmount', () => {
  it('exige valor > 0', () => {
    expect(isPositiveAmount(10)).toBe(true);
    expect(isPositiveAmount(0)).toBe(false);
    expect(isPositiveAmount(-1)).toBe(false);
  });
});
