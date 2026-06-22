import { NextResponse } from 'next/server';
import { getAuthGateway, getSessionStore, getUsersAdminGateway } from '@/infrastructure/composition';
import { updateUserName } from '@/application/users/user-use-cases';
import { statusFromError } from '@/lib/http-status';

export async function PUT(request: Request, context: { params: Promise<{ id: string }> }) {
  const { id } = await context.params;
  const body = (await request.json()) as { name: string };
  const deps = { users: getUsersAdminGateway(), auth: getAuthGateway(), store: getSessionStore() };
  const result = await updateUserName(deps, id, body.name);
  if (!result.ok) {
    return NextResponse.json({ error: result.error.message }, { status: statusFromError(result.error) });
  }
  return new NextResponse(null, { status: 204 });
}
