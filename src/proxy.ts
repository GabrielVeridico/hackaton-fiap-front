import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function proxy(request: NextRequest) {
  // Gate na sessão pelo refresh token (cs_rt, 7d): se o access (cs_at, ~4h)
  // expirou mas o refresh ainda é válido, a página carrega e o refresh-on-401
  // renova o par — evita um redirect indevido ao login.
  const hasSession = request.cookies.has('cs_rt');
  if (!hasSession) {
    const url = request.nextUrl.clone();
    url.pathname = '/login';
    url.searchParams.set('next', request.nextUrl.pathname);
    return NextResponse.redirect(url);
  }
  return NextResponse.next();
}

export const config = {
  matcher: ['/perfil/:path*'],
};
