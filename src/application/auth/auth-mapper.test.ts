import { describe, it, expect } from 'vitest';
import { mapUserResponse, personTypeToCode } from './auth-mapper';
import type { UserResponseDto } from './auth-dto';

const dto: UserResponseDto = {
  Id: 'u1', PersonType: 'Individual', Document: '52998224725', Name: 'Ana',
  Email: 'ana@x.com', Role: 'Doador', IsActive: true, IsOwner: false,
  CreatedAtUtc: '2026-01-01T00:00:00Z', UpdatedAtUtc: '2026-01-01T00:00:00Z',
};

describe('mapUserResponse', () => {
  it('mapeia UserResponse (PascalCase, enums-string) para AuthUser', () => {
    const u = mapUserResponse(dto);
    expect(u.id).toBe('u1');
    expect(u.role).toBe('Doador');
    expect(u.personType).toBe('Individual');
    expect(u.isOwner).toBe(false);
  });
});

describe('personTypeToCode', () => {
  it('Individual=0, Company=1', () => {
    expect(personTypeToCode('Individual')).toBe(0);
    expect(personTypeToCode('Company')).toBe(1);
  });
});
