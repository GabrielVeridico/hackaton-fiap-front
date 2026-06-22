import { describe, it, expect, vi } from 'vitest';
import { HttpUsersAdminGateway } from './http-users-admin-gateway';
import { loadConfig } from '../config/env';

const config = loadConfig({});
function json(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), { status, headers: { 'content-type': 'application/json' } });
}
const userDto = {
  Id: 'u1', PersonType: 'Individual', Document: '529', Name: 'Ana', Email: 'a@x.com',
  Role: 'Doador', IsActive: true, IsOwner: false, CreatedAtUtc: 'x', UpdatedAtUtc: 'y',
};

describe('HttpUsersAdminGateway', () => {
  it('list busca do grupo users (PascalCase) com Bearer e mapeia', async () => {
    const fetchImpl = vi.fn().mockResolvedValue(json([userDto]));
    const gw = new HttpUsersAdminGateway(config, fetchImpl);
    const r = await gw.list('tok');
    expect(fetchImpl.mock.calls[0]![0]).toBe('http://localhost:5001/api/users');
    expect(((fetchImpl.mock.calls[0]![1] as RequestInit).headers as Record<string, string>).Authorization).toBe('Bearer tok');
    expect(r.ok).toBe(true);
    if (r.ok) expect(r.value[0]?.role).toBe('Doador');
  });

  it('create posta PascalCase com PersonType e Role inteiros', async () => {
    const fetchImpl = vi.fn().mockResolvedValue(json(userDto, 201));
    const gw = new HttpUsersAdminGateway(config, fetchImpl);
    const r = await gw.create(
      { personType: 'Company', document: '11', name: 'X', email: 'e@x.com', password: 'Senha@123', role: 'GestorONG' },
      'tok',
    );
    const body = JSON.parse((fetchImpl.mock.calls[0]![1] as RequestInit).body as string);
    expect(body).toEqual({ PersonType: 1, Document: '11', Name: 'X', Email: 'e@x.com', Password: 'Senha@123', Role: 1 });
    expect(r.ok).toBe(true);
  });

  it('changeRole faz PATCH {Role:int}; deactivate faz PATCH sem corpo relevante', async () => {
    const fetchImpl = vi.fn().mockResolvedValue(new Response(null, { status: 204 }));
    const gw = new HttpUsersAdminGateway(config, fetchImpl);
    await gw.changeRole('u1', 'GestorONG', 'tok');
    const [roleUrl, roleInit] = fetchImpl.mock.calls[0]!;
    expect(roleUrl).toBe('http://localhost:5001/api/users/u1/role');
    expect((roleInit as RequestInit).method).toBe('PATCH');
    expect(JSON.parse((roleInit as RequestInit).body as string)).toEqual({ Role: 1 });
    await gw.deactivate('u1', 'tok');
    expect(fetchImpl.mock.calls[1]![0]).toBe('http://localhost:5001/api/users/u1/deactivate');
    expect((fetchImpl.mock.calls[1]![1] as RequestInit).method).toBe('PATCH');
  });
});
