import 'server-only';
import { Result } from '@/domain/shared/result';
import { campaignStatusActionToCode, type Campaign, type CampaignStatusAction } from '@/domain/campaigns/campaign';
import type { CampaignsAdminGateway } from '@/application/ports/campaigns-admin-gateway';
import type { CampaignResponseDto } from '@/application/campaigns/campaign-dto';
import type { CampaignInput } from '@/application/campaigns/campaign-types';
import { mapCampaign } from '@/application/campaigns/campaign-mapper';
import { callUpstream } from '../http/upstream-client';
import type { AppConfig } from '../config/env';

export class HttpCampaignsAdminGateway implements CampaignsAdminGateway {
  constructor(
    private readonly config: AppConfig,
    private readonly fetchImpl?: typeof fetch,
  ) {}

  private deps() {
    return { config: this.config, fetchImpl: this.fetchImpl };
  }

  async list(accessToken: string): Promise<Result<Campaign[]>> {
    const r = await callUpstream<CampaignResponseDto[]>(
      { group: 'donations', path: '/api/campaigns', bearer: accessToken },
      this.deps(),
    );
    return r.ok ? Result.ok(r.value.map(mapCampaign)) : Result.fail<Campaign[]>(r.error);
  }

  async getById(id: string, accessToken: string): Promise<Result<Campaign>> {
    const r = await callUpstream<CampaignResponseDto>(
      { group: 'donations', path: `/api/campaigns/${id}`, bearer: accessToken },
      this.deps(),
    );
    return r.ok ? Result.ok(mapCampaign(r.value)) : Result.fail<Campaign>(r.error);
  }

  async create(input: CampaignInput, accessToken: string): Promise<Result<string>> {
    const r = await callUpstream<{ id: string }>(
      { group: 'donations', path: '/api/campaigns', method: 'POST', body: input, bearer: accessToken },
      this.deps(),
    );
    return r.ok ? Result.ok(r.value.id) : Result.fail<string>(r.error);
  }

  update(id: string, input: CampaignInput, accessToken: string): Promise<Result<void>> {
    return callUpstream<void>(
      { group: 'donations', path: `/api/campaigns/${id}`, method: 'PUT', body: input, bearer: accessToken },
      this.deps(),
    );
  }

  changeStatus(id: string, action: CampaignStatusAction, accessToken: string): Promise<Result<void>> {
    return callUpstream<void>(
      {
        group: 'donations',
        path: `/api/campaigns/${id}/status`,
        method: 'PATCH',
        body: { action: campaignStatusActionToCode(action) },
        bearer: accessToken,
      },
      this.deps(),
    );
  }
}
