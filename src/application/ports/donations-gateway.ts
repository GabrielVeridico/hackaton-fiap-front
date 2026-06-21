import type { Result } from '@/domain/shared/result';
import type { Donation } from '@/domain/donations/donation';
import type { CreateDonationInput, CreateDonationResult } from '../donations/donation-types';

export interface DonationsGateway {
  createDonation(input: CreateDonationInput, accessToken: string): Promise<Result<CreateDonationResult>>;
  getDonationById(id: string, accessToken: string): Promise<Result<Donation>>;
  listMyDonations(accessToken: string): Promise<Result<Donation[]>>;
}
