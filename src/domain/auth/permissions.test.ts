import { describe, it, expect } from 'vitest';
import { canCreateUserWithRole, canManageUser, canChangeRole } from './permissions';

describe('canCreateUserWithRole', () => {
  it('qualquer gestor cria Doador; só Owner cria GestorONG', () => {
    expect(canCreateUserWithRole(false, 'Doador')).toBe(true);
    expect(canCreateUserWithRole(true, 'Doador')).toBe(true);
    expect(canCreateUserWithRole(false, 'GestorONG')).toBe(false);
    expect(canCreateUserWithRole(true, 'GestorONG')).toBe(true);
  });
});

describe('canManageUser', () => {
  it('nunca gere o Owner', () => {
    expect(canManageUser(true, { role: 'GestorONG', isOwner: true })).toBe(false);
  });
  it('gestor gere Doador; só Owner gere GestorONG', () => {
    expect(canManageUser(false, { role: 'Doador', isOwner: false })).toBe(true);
    expect(canManageUser(false, { role: 'GestorONG', isOwner: false })).toBe(false);
    expect(canManageUser(true, { role: 'GestorONG', isOwner: false })).toBe(true);
  });
});

describe('canChangeRole', () => {
  it('só Owner troca role e nunca a do Owner', () => {
    expect(canChangeRole(false, { role: 'Doador', isOwner: false })).toBe(false);
    expect(canChangeRole(true, { role: 'Doador', isOwner: false })).toBe(true);
    expect(canChangeRole(true, { role: 'GestorONG', isOwner: true })).toBe(false);
  });
});
