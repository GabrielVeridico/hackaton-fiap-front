import type { Result } from '@/domain/shared/result';
import type { TransparencyCampaign } from '@/domain/transparency/transparency-campaign';

export interface TransparencyGateway {
  listActiveCampaigns(): Promise<Result<TransparencyCampaign[]>>;
}
