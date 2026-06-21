import { NextResponse } from 'next/server';
import { getAuthGateway, getCampaignsAdminGateway, getSessionStore } from '@/infrastructure/composition';
import { changeCampaignStatus } from '@/application/campaigns/campaign-use-cases';
import { statusFromError } from '@/lib/http-status';
import type { CampaignStatusAction } from '@/domain/campaigns/campaign';

export async function PATCH(request: Request, context: { params: Promise<{ id: string }> }) {
  const { id } = await context.params;
  const body = (await request.json()) as { action: CampaignStatusAction };
  const deps = { campaigns: getCampaignsAdminGateway(), auth: getAuthGateway(), store: getSessionStore() };
  const result = await changeCampaignStatus(deps, id, body.action);
  if (!result.ok) {
    return NextResponse.json({ error: result.error.message }, { status: statusFromError(result.error) });
  }
  return new NextResponse(null, { status: 204 });
}
