import type { Campaign, CampaignStatus, CompletionReason } from '@/domain/campaigns/campaign';
import type { CampaignResponseDto } from './campaign-dto';

export function mapCampaign(dto: CampaignResponseDto): Campaign {
  return {
    id: dto.id,
    title: dto.title,
    description: dto.description,
    startDate: dto.startDate,
    endDate: dto.endDate,
    goal: dto.goal,
    amountRaised: dto.amountRaised,
    status: dto.status as CampaignStatus,
    completionReason: (dto.completionReason as CompletionReason | null) ?? undefined,
    createdAt: dto.createdAt,
    updatedAt: dto.updatedAt,
  };
}
