import { NextResponse } from 'next/server';
import { getAuthGateway, getSessionStore, getUsersAdminGateway } from '@/infrastructure/composition';
import { changeUserRole } from '@/application/users/user-use-cases';
import { statusFromError } from '@/lib/http-status';
import type { Role } from '@/domain/auth/auth-user';

export async function PATCH(request: Request, context: { params: Promise<{ id: string }> }) {
  const { id } = await context.params;
  const body = (await request.json()) as { role: Role };
  const deps = { users: getUsersAdminGateway(), auth: getAuthGateway(), store: getSessionStore() };
  const result = await changeUserRole(deps, id, body.role);
  if (!result.ok) {
    return NextResponse.json({ error: result.error.message }, { status: statusFromError(result.error) });
  }
  return new NextResponse(null, { status: 204 });
}
