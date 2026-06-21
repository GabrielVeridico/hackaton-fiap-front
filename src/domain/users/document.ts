import type { PersonType } from '@/domain/auth/auth-user';

export function sanitizeDocument(value: string): string {
  return value.replace(/\D/g, '');
}

export function isValidCpf(value: string): boolean {
  const cpf = sanitizeDocument(value);
  if (cpf.length !== 11 || /^(\d)\1{10}$/.test(cpf)) {
    return false;
  }
  const digits = cpf.split('').map(Number);
  const check = (count: number): number => {
    let sum = 0;
    for (let i = 0; i < count; i++) {
      sum += (digits[i] ?? 0) * (count + 1 - i);
    }
    const rest = (sum * 10) % 11;
    return rest === 10 ? 0 : rest;
  };
  return check(9) === digits[9] && check(10) === digits[10];
}

export function isValidCnpj(value: string): boolean {
  const cnpj = sanitizeDocument(value);
  if (cnpj.length !== 14 || /^(\d)\1{13}$/.test(cnpj)) {
    return false;
  }
  const digits = cnpj.split('').map(Number);
  const check = (count: number): number => {
    const weights = count === 12 ? [5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2] : [6, 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2];
    let sum = 0;
    for (let i = 0; i < count; i++) {
      sum += (digits[i] ?? 0) * (weights[i] ?? 0);
    }
    const rest = sum % 11;
    return rest < 2 ? 0 : 11 - rest;
  };
  return check(12) === digits[12] && check(13) === digits[13];
}

export function isValidDocument(value: string, personType: PersonType): boolean {
  return personType === 'Company' ? isValidCnpj(value) : isValidCpf(value);
}
