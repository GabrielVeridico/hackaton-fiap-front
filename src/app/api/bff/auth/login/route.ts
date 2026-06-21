import { NextResponse } from 'next/server';
import { getAuthGateway, getSessionStore } from '@/infrastructure/composition';
import { login } from '@/application/auth/auth-use-cases';
import { statusFromError } from '@/lib/http-status';

interface LoginBody {
  email: string;
  password: string;
}

export async function POST(request: Request) {
  const body = (await request.json()) as LoginBody;
  const result = await login(getAuthGateway(), getSessionStore(), { email: body.email, password: body.password });
  if (!result.ok) {
    return NextResponse.json({ error: result.error.message }, { status: statusFromError(result.error) });
  }
  return NextResponse.json(result.value);
}
