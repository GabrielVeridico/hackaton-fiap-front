import { describe, it, expect } from 'vitest';
import { formatBRL } from './format';

describe('formatBRL', () => {
  it('formata em reais', () => {
    expect(formatBRL(32500).replace(/ | /g, ' ')).toBe('R$ 32.500,00');
  });
});
