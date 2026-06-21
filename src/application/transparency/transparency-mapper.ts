import { computePercentage, type TransparencyCampaign } from '@/domain/transparency/transparency-campaign';
import type { TransparencyCampaignDto } from './transparency-dto';

export function mapTransparencyCampaign(dto: TransparencyCampaignDto, index: number): TransparencyCampaign {
  return {
    id: dto.Id ?? `idx-${index}`,
    title: dto.Title,
    description: dto.Description,
    goal: dto.Goal,
    amountRaised: dto.AmountRaised,
    percentage: computePercentage(dto.Goal, dto.AmountRaised),
  };
}
