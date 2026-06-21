import type { Result } from '@/domain/shared/result';
import type { Campaign, CampaignStatusAction } from '@/domain/campaigns/campaign';
import type { CampaignInput } from '../campaigns/campaign-types';

export interface CampaignsAdminGateway {
  list(accessToken: string): Promise<Result<Campaign[]>>;
  getById(id: string, accessToken: string): Promise<Result<Campaign>>;
  create(input: CampaignInput, accessToken: string): Promise<Result<string>>;
  update(id: string, input: CampaignInput, accessToken: string): Promise<Result<void>>;
  changeStatus(id: string, action: CampaignStatusAction, accessToken: string): Promise<Result<void>>;
}
