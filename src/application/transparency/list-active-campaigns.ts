import type { Result } from '@/domain/shared/result';
import type { TransparencyCampaign } from '@/domain/transparency/transparency-campaign';
import type { TransparencyGateway } from '../ports/transparency-gateway';

export function listActiveCampaigns(gateway: TransparencyGateway): Promise<Result<TransparencyCampaign[]>> {
  return gateway.listActiveCampaigns();
}
