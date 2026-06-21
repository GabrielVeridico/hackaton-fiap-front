import { Result } from '@/domain/shared/result';
import type { AuthGateway } from '../ports/auth-gateway';
import type { SessionStore } from '../ports/session-store';

export async function runAuthenticated<T>(
  store: SessionStore,
  gateway: AuthGateway,
  call: (accessToken: string) => Promise<Result<T>>,
): Promise<Result<T>> {
  const accessToken = await store.getAccessToken();
  if (!accessToken) {
    return Result.fail<T>({ kind: 'unauthorized', message: 'Sessão ausente' });
  }

  const first = await call(accessToken);
  if (first.ok || first.error.kind !== 'unauthorized') {
    return first;
  }

  const refreshToken = await store.getRefreshToken();
  if (!refreshToken) {
    await store.clear();
    return Result.fail<T>({ kind: 'unauthorized', message: 'Sessão expirada' });
  }

  const refreshed = await gateway.refresh(refreshToken);
  if (!refreshed.ok) {
    await store.clear();
    return Result.fail<T>({ kind: 'unauthorized', message: 'Sessão expirada' });
  }

  await store.setTokens(refreshed.value);
  return call(refreshed.value.accessToken);
}
