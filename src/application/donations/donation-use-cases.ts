import type { Result } from '@/domain/shared/result';
import type { Donation } from '@/domain/donations/donation';
import type { AuthGateway } from '../ports/auth-gateway';
import type { SessionStore } from '../ports/session-store';
import type { DonationsGateway } from '../ports/donations-gateway';
import type { CreateDonationInput, CreateDonationResult } from './donation-types';
import { runAuthenticated } from '../auth/run-authenticated';

export interface DonationDeps {
  donations: DonationsGateway;
  auth: AuthGateway;
  store: SessionStore;
}

export function createDonation(
  deps: DonationDeps,
  input: CreateDonationInput,
): Promise<Result<CreateDonationResult>> {
  return runAuthenticated(deps.store, deps.auth, (accessToken) =>
    deps.donations.createDonation(input, accessToken),
  );
}

export function getDonation(deps: DonationDeps, id: string): Promise<Result<Donation>> {
  return runAuthenticated(deps.store, deps.auth, (accessToken) =>
    deps.donations.getDonationById(id, accessToken),
  );
}

export function listMyDonations(deps: DonationDeps): Promise<Result<Donation[]>> {
  return runAuthenticated(deps.store, deps.auth, (accessToken) =>
    deps.donations.listMyDonations(accessToken),
  );
}
