import { NextResponse } from 'next/server';
import { getAuthGateway, getSessionStore, getUsersAdminGateway } from '@/infrastructure/composition';
import { createUser, listUsers } from '@/application/users/user-use-cases';
import { statusFromError } from '@/lib/http-status';
import type { CreateUserInput } from '@/application/users/user-types';

function deps() {
  return { users: getUsersAdminGateway(), auth: getAuthGateway(), store: getSessionStore() };
}

export async function GET() {
  const result = await listUsers(deps());
  if (!result.ok) {
    return NextResponse.json({ error: result.error.message }, { status: statusFromError(result.error) });
  }
  return NextResponse.json(result.value);
}

export async function POST(request: Request) {
  const body = (await request.json()) as CreateUserInput;
  const result = await createUser(deps(), body);
  if (!result.ok) {
    return NextResponse.json({ error: result.error.message }, { status: statusFromError(result.error) });
  }
  return new NextResponse(null, { status: 201 });
}
