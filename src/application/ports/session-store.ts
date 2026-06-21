import type { AuthTokens } from '../auth/auth-types';

export interface SessionStore {
  getAccessToken(): Promise<string | undefined>;
  getRefreshToken(): Promise<string | undefined>;
  setTokens(tokens: AuthTokens): Promise<void>;
  clear(): Promise<void>;
}
