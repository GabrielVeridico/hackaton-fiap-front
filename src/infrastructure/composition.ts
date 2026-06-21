import 'server-only';
import { loadConfig, type AppConfig } from './config/env';
import type { TransparencyGateway } from '@/application/ports/transparency-gateway';
import { HttpTransparencyGateway } from './gateways/http-transparency-gateway';
import { MockTransparencyGateway } from './gateways/mock-transparency-gateway';

export function getTransparencyGateway(config: AppConfig = loadConfig()): TransparencyGateway {
  if (config.mockDonorCampaigns) {
    return new MockTransparencyGateway();
  }
  return new HttpTransparencyGateway(config);
}
