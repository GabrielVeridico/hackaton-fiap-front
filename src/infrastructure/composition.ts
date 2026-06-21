import 'server-only';
import { loadConfig, type AppConfig } from './config/env';
import type { TransparencyGateway } from '@/application/ports/transparency-gateway';
import { HttpTransparencyGateway } from './gateways/http-transparency-gateway';
import { MockTransparencyGateway } from './gateways/mock-transparency-gateway';
import { HttpAuthGateway } from './gateways/http-auth-gateway';
import { CookieSessionStore } from './session/cookie-session-store';
import type { AuthGateway } from '@/application/ports/auth-gateway';
import type { SessionStore } from '@/application/ports/session-store';
import { HttpDonationsGateway } from './gateways/http-donations-gateway';
import { MockDonationsGateway } from './gateways/mock-donations-gateway';
import type { DonationsGateway } from '@/application/ports/donations-gateway';
import type { Donation } from '@/domain/donations/donation';
import { Result } from '@/domain/shared/result';

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

export function getDonationsGateway(config: AppConfig = loadConfig()): DonationsGateway {
  if (config.mockDonations) {
    return new MockDonationsGateway();
  }
  const http = new HttpDonationsGateway(config);
  if (config.mockMyDonations) {
    // Lacuna 2: lista mockada, create/getById reais
    const fixture: Donation[] = [];
    return {
      createDonation: (input, token) => http.createDonation(input, token),
      getDonationById: (id, token) => http.getDonationById(id, token),
      listMyDonations: async () => Result.ok(fixture),
    };
  }
  return http;
}
