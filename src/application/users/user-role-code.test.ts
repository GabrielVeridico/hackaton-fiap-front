import { describe, it, expect } from 'vitest';
import { userRoleToCode } from './user-role-code';

describe('userRoleToCode', () => {
  it('Doador=0, GestorONG=1', () => {
    expect(userRoleToCode('Doador')).toBe(0);
    expect(userRoleToCode('GestorONG')).toBe(1);
  });
});
