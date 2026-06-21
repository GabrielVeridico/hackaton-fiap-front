import 'server-only';
import { z } from 'zod';

export type UpstreamGroup = 'users' | 'donations' | 'payments';

const boolFromString = z
  .union([z.boolean(), z.string()])
  .transform((v) => v === true || v === 'true')
  .default(false);

const schema = z.object({
  UPSTREAM_MODE: z.enum(['apim', 'services']).default('services'),
  APIM_BASE_URL: z.string().url().optional(),
  USERS_API_URL: z.string().url().default('http://localhost:5001'),
  DONATIONS_API_URL: z.string().url().default('http://localhost:5003'),
  PAYMENTS_API_URL: z.string().url().default('http://localhost:5002'),
  MOCK_DONOR_CAMPAIGNS: boolFromString,
  MOCK_MY_DONATIONS: boolFromString,
  MOCK_DONATIONS: boolFromString,
});

export interface AppConfig {
  upstreamMode: 'apim' | 'services';
  apimBaseUrl?: string;
  usersApiUrl: string;
  donationsApiUrl: string;
  paymentsApiUrl: string;
  mockDonorCampaigns: boolean;
  mockMyDonations: boolean;
  mockDonations: boolean;
}

export function loadConfig(source: Record<string, string | undefined> = process.env): AppConfig {
  const parsed = schema.parse(source);
  return {
    upstreamMode: parsed.UPSTREAM_MODE,
    apimBaseUrl: parsed.APIM_BASE_URL,
    usersApiUrl: parsed.USERS_API_URL,
    donationsApiUrl: parsed.DONATIONS_API_URL,
    paymentsApiUrl: parsed.PAYMENTS_API_URL,
    mockDonorCampaigns: parsed.MOCK_DONOR_CAMPAIGNS,
    mockMyDonations: parsed.MOCK_MY_DONATIONS,
    mockDonations: parsed.MOCK_DONATIONS,
  };
}

export function resolveBaseUrl(config: AppConfig, group: UpstreamGroup): string {
  if (config.upstreamMode === 'apim') {
    if (!config.apimBaseUrl) {
      throw new Error('APIM_BASE_URL é obrigatório quando UPSTREAM_MODE=apim');
    }
    return config.apimBaseUrl;
  }
  const byGroup: Record<UpstreamGroup, string> = {
    users: config.usersApiUrl,
    donations: config.donationsApiUrl,
    payments: config.paymentsApiUrl,
  };
  return byGroup[group];
}
