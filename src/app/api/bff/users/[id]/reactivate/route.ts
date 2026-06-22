import { NextResponse } from 'next/server';
import { getAuthGateway, getSessionStore, getUsersAdminGateway } from '@/infrastructure/composition';
import { reactivateUser } from '@/application/users/user-use-cases';
import { statusFromError } from '@/lib/http-status';

export async function PATCH(_request: Request, context: { params: Promise<{ id: string }> }) {
  const { id } = await context.params;
  const deps = { users: getUsersAdminGateway(), auth: getAuthGateway(), store: getSessionStore() };
  const result = await reactivateUser(deps, id);
  if (!result.ok) {
    return NextResponse.json({ error: result.error.message }, { status: statusFromError(result.error) });
  }
  return new NextResponse(null, { status: 204 });
}
