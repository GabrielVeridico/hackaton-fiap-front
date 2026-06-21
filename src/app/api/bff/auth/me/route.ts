import { NextResponse } from 'next/server';
import { getAuthGateway, getSessionStore } from '@/infrastructure/composition';
import { getCurrentUser } from '@/application/auth/auth-use-cases';
import { statusFromError } from '@/lib/http-status';

export async function GET() {
  const result = await getCurrentUser(getAuthGateway(), getSessionStore());
  if (!result.ok) {
    return NextResponse.json({ error: result.error.message }, { status: statusFromError(result.error) });
  }
  return NextResponse.json(result.value);
}
