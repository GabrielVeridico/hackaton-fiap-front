import { NextResponse } from 'next/server';
import { getAuthGateway, getSessionStore } from '@/infrastructure/composition';
import { logout } from '@/application/auth/auth-use-cases';

export async function POST() {
  await logout(getAuthGateway(), getSessionStore());
  return new NextResponse(null, { status: 204 });
}
