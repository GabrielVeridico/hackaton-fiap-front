import type { Result } from '@/domain/shared/result';
import type { Campaign, CampaignStatusAction } from '@/domain/campaigns/campaign';
import type { AuthGateway } from '../ports/auth-gateway';
import type { SessionStore } from '../ports/session-store';
import type { CampaignsAdminGateway } from '../ports/campaigns-admin-gateway';
import type { CampaignInput } from './campaign-types';
import { runAuthenticated } from '../auth/run-authenticated';

export interface CampaignAdminDeps {
  campaigns: CampaignsAdminGateway;
  auth: AuthGateway;
  store: SessionStore;
}

export function listCampaigns(deps: CampaignAdminDeps): Promise<Result<Campaign[]>> {
  return runAuthenticated(deps.store, deps.auth, (token) => deps.campaigns.list(token));
}

export function getCampaign(deps: CampaignAdminDeps, id: string): Promise<Result<Campaign>> {
  return runAuthenticated(deps.store, deps.auth, (token) => deps.campaigns.getById(id, token));
}

export function createCampaign(deps: CampaignAdminDeps, input: CampaignInput): Promise<Result<string>> {
  return runAuthenticated(deps.store, deps.auth, (token) => deps.campaigns.create(input, token));
}

export function updateCampaign(deps: CampaignAdminDeps, id: string, input: CampaignInput): Promise<Result<void>> {
  return runAuthenticated(deps.store, deps.auth, (token) => deps.campaigns.update(id, input, token));
}

export function changeCampaignStatus(
  deps: CampaignAdminDeps,
  id: string,
  action: CampaignStatusAction,
): Promise<Result<void>> {
  return runAuthenticated(deps.store, deps.auth, (token) => deps.campaigns.changeStatus(id, action, token));
}
