import { computePercentage, type TransparencyCampaign } from '@/domain/transparency/transparency-campaign';
import type { TransparencyCampaignDto } from './transparency-dto';

export function mapTransparencyCampaign(dto: TransparencyCampaignDto, index: number): TransparencyCampaign {
  return {
    id: dto.id ?? `idx-${index}`,
    title: dto.title,
    description: dto.description,
    goal: dto.goal,
    amountRaised: dto.amountRaised,
    percentage: computePercentage(dto.goal, dto.amountRaised),
  };
}
