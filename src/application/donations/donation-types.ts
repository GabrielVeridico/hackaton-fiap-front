import type { DonationStatus, PaymentMethod } from '@/domain/donations/donation';

export interface CreateDonationInput {
  campaignId: string;
  amount: number;
  method: PaymentMethod;
}

export interface CreateDonationResult {
  donationId: string;
  status: DonationStatus;
}
