import type { Result } from '@/domain/shared/result';
import type { AuthUser } from '@/domain/auth/auth-user';
import type { AuthTokens, RegisterInput } from '../auth/auth-types';

export interface AuthGateway {
  register(input: RegisterInput): Promise<Result<void>>;
  login(email: string, password: string): Promise<Result<AuthTokens>>;
  refresh(refreshToken: string): Promise<Result<AuthTokens>>;
  logout(refreshToken: string, accessToken: string): Promise<Result<void>>;
  getCurrentUser(accessToken: string): Promise<Result<AuthUser>>;
}
