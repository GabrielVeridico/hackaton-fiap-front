import 'server-only';
import { cookies } from 'next/headers';
import type { SessionStore } from '@/application/ports/session-store';
import type { AuthTokens } from '@/application/auth/auth-types';

const ACCESS_COOKIE = 'cs_at';
const REFRESH_COOKIE = 'cs_rt';
const REFRESH_MAX_AGE = 60 * 60 * 24 * 7; // 7 dias

function baseOptions() {
  return {
    httpOnly: true,
    sameSite: 'lax' as const,
    secure: process.env.NODE_ENV === 'production',
    path: '/',
  };
}

export class CookieSessionStore implements SessionStore {
  async getAccessToken(): Promise<string | undefined> {
    return (await cookies()).get(ACCESS_COOKIE)?.value;
  }

  async getRefreshToken(): Promise<string | undefined> {
    return (await cookies()).get(REFRESH_COOKIE)?.value;
  }

  async setTokens(tokens: AuthTokens): Promise<void> {
    const jar = await cookies();
    jar.set(ACCESS_COOKIE, tokens.accessToken, { ...baseOptions(), maxAge: tokens.expiresIn });
    jar.set(REFRESH_COOKIE, tokens.refreshToken, { ...baseOptions(), maxAge: REFRESH_MAX_AGE });
  }

  async clear(): Promise<void> {
    const jar = await cookies();
    jar.delete(ACCESS_COOKIE);
    jar.delete(REFRESH_COOKIE);
  }
}
