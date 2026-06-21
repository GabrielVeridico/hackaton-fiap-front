import 'server-only';
import { loadConfig, type AppConfig } from './config/env';
import type { TransparencyGateway } from '@/application/ports/transparency-gateway';
import { HttpTransparencyGateway } from './gateways/http-transparency-gateway';
import { MockTransparencyGateway } from './gateways/mock-transparency-gateway';
import { HttpAuthGateway } from './gateways/http-auth-gateway';
import { CookieSessionStore } from './session/cookie-session-store';
import type { AuthGateway } from '@/application/ports/auth-gateway';
import type { SessionStore } from '@/application/ports/session-store';

export function getTransparencyGateway(config: AppConfig = loadConfig()): TransparencyGateway {
  if (config.mockDonorCampaigns) {
    return new MockTransparencyGateway();
  }
  return new HttpTransparencyGateway(config);
}

export function getAuthGateway(config: AppConfig = loadConfig()): AuthGateway {
  return new HttpAuthGateway(config);
}

export function getSessionStore(): SessionStore {
  return new CookieSessionStore();
}
