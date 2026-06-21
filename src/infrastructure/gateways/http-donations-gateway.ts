import 'server-only';
import { Result } from '@/domain/shared/result';
import { paymentMethodToCode, type Donation } from '@/domain/donations/donation';
import type { DonationsGateway } from '@/application/ports/donations-gateway';
import type { CreateDonationInput, CreateDonationResult } from '@/application/donations/donation-types';
import type { CreateDonationResultDto, DonationResponseDto } from '@/application/donations/donation-dto';
import { mapCreateResult, mapDonation } from '@/application/donations/donation-mapper';
import { callUpstream } from '../http/upstream-client';
import type { AppConfig } from '../config/env';

export class HttpDonationsGateway implements DonationsGateway {
  constructor(
    private readonly config: AppConfig,
    private readonly fetchImpl?: typeof fetch,
  ) {}

  private deps() {
    return { config: this.config, fetchImpl: this.fetchImpl };
  }

  async createDonation(input: CreateDonationInput, accessToken: string): Promise<Result<CreateDonationResult>> {
    const result = await callUpstream<CreateDonationResultDto>(
      {
        group: 'donations',
        path: '/api/donations',
        method: 'POST',
        body: { campaignId: input.campaignId, amount: input.amount, paymentMethod: paymentMethodToCode(input.method) },
        bearer: accessToken,
      },
      this.deps(),
    );
    return result.ok ? Result.ok(mapCreateResult(result.value)) : Result.fail<CreateDonationResult>(result.error);
  }

  async getDonationById(id: string, accessToken: string): Promise<Result<Donation>> {
    const result = await callUpstream<DonationResponseDto>(
      { group: 'donations', path: `/api/donations/${id}`, bearer: accessToken },
      this.deps(),
    );
    return result.ok ? Result.ok(mapDonation(result.value)) : Result.fail<Donation>(result.error);
  }

  async listMyDonations(accessToken: string): Promise<Result<Donation[]>> {
    const result = await callUpstream<DonationResponseDto[]>(
      { group: 'donations', path: '/api/donations', bearer: accessToken },
      this.deps(),
    );
    return result.ok ? Result.ok(result.value.map(mapDonation)) : Result.fail<Donation[]>(result.error);
  }
}
