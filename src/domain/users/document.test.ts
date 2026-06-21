import { describe, it, expect } from 'vitest';
import { sanitizeDocument, isValidCpf, isValidCnpj, isValidDocument } from './document';

describe('sanitizeDocument', () => {
  it('remove máscara', () => {
    expect(sanitizeDocument('529.982.247-25')).toBe('52998224725');
  });
});

describe('isValidCpf', () => {
  it('aceita CPF válido', () => {
    expect(isValidCpf('529.982.247-25')).toBe(true);
  });
  it('rejeita dígitos verificadores errados', () => {
    expect(isValidCpf('529.982.247-24')).toBe(false);
  });
  it('rejeita todos iguais e tamanho errado', () => {
    expect(isValidCpf('111.111.111-11')).toBe(false);
    expect(isValidCpf('123')).toBe(false);
  });
});

describe('isValidCnpj', () => {
  it('aceita CNPJ válido', () => {
    expect(isValidCnpj('11.444.777/0001-61')).toBe(true);
  });
  it('rejeita dígitos errados e todos iguais', () => {
    expect(isValidCnpj('11.444.777/0001-60')).toBe(false);
    expect(isValidCnpj('00.000.000/0000-00')).toBe(false);
  });
});

describe('isValidDocument', () => {
  it('usa CPF para Individual e CNPJ para Company', () => {
    expect(isValidDocument('529.982.247-25', 'Individual')).toBe(true);
    expect(isValidDocument('529.982.247-25', 'Company')).toBe(false);
    expect(isValidDocument('11.444.777/0001-61', 'Company')).toBe(true);
  });
});
