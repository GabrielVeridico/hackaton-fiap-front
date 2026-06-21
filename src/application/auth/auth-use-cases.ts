import { Result } from '@/domain/shared/result';
import type { AuthUser } from '@/domain/auth/auth-user';
import type { AuthGateway } from '../ports/auth-gateway';
import type { SessionStore } from '../ports/session-store';
import type { LoginInput, RegisterInput } from './auth-types';
import { runAuthenticated } from './run-authenticated';

export { runAuthenticated };

export function registerDonor(gateway: AuthGateway, input: RegisterInput): Promise<Result<void>> {
  return gateway.register(input);
}

export async function login(
  gateway: AuthGateway,
  store: SessionStore,
  input: LoginInput,
): Promise<Result<AuthUser>> {
  const tokens = await gateway.login(input.email, input.password);
  if (!tokens.ok) {
    return Result.fail<AuthUser>(tokens.error);
  }
  await store.setTokens(tokens.value);
  return gateway.getCurrentUser(tokens.value.accessToken);
}

export async function logout(gateway: AuthGateway, store: SessionStore): Promise<Result<void>> {
  const refreshToken = await store.getRefreshToken();
  const accessToken = await store.getAccessToken();
  if (refreshToken && accessToken) {
    await gateway.logout(refreshToken, accessToken);
  }
  await store.clear();
  return Result.ok(undefined);
}

export function getCurrentUser(gateway: AuthGateway, store: SessionStore): Promise<Result<AuthUser>> {
  return runAuthenticated(store, gateway, (accessToken) => gateway.getCurrentUser(accessToken));
}
