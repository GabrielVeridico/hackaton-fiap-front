import 'server-only';
import { Result } from '@/domain/shared/result';
import type { TransparencyCampaign } from '@/domain/transparency/transparency-campaign';
import type { TransparencyGateway } from '@/application/ports/transparency-gateway';
import { mapTransparencyCampaign } from '@/application/transparency/transparency-mapper';
import type { TransparencyCampaignDto } from '@/application/transparency/transparency-dto';
import { callUpstream } from '../http/upstream-client';
import type { AppConfig } from '../config/env';

export class HttpTransparencyGateway implements TransparencyGateway {
  constructor(
    private readonly config: AppConfig,
    private readonly fetchImpl?: typeof fetch,
  ) {}

  async listActiveCampaigns(): Promise<Result<TransparencyCampaign[]>> {
    const result = await callUpstream<TransparencyCampaignDto[]>(
      { group: 'donations', path: '/api/transparency/campaigns' },
      { config: this.config, fetchImpl: this.fetchImpl },
    );
    if (!result.ok) {
      return result;
    }
    return Result.ok(result.value.map(mapTransparencyCampaign));
  }
}
