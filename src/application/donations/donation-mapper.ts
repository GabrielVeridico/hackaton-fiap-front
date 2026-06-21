import type { Donation, DonationStatus, PaymentMethod } from '@/domain/donations/donation';
import type { CreateDonationResult } from './donation-types';
import type { CreateDonationResultDto, DonationResponseDto } from './donation-dto';

export function mapDonation(dto: DonationResponseDto): Donation {
  return {
    id: dto.id,
    campaignId: dto.campaignId,
    amount: dto.amount,
    method: dto.method as PaymentMethod,
    status: dto.status as DonationStatus,
    declineReason: dto.declineReason ?? undefined,
    createdAt: dto.createdAt,
    processedAt: dto.processedAt ?? undefined,
  };
}

export function mapCreateResult(dto: CreateDonationResultDto): CreateDonationResult {
  return { donationId: dto.donationId, status: dto.status as DonationStatus };
}
