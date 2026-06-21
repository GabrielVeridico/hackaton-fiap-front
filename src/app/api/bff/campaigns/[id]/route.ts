import { NextResponse } from 'next/server';
import { getAuthGateway, getCampaignsAdminGateway, getSessionStore } from '@/infrastructure/composition';
import { getCampaign, updateCampaign } from '@/application/campaigns/campaign-use-cases';
import { statusFromError } from '@/lib/http-status';
import type { CampaignInput } from '@/application/campaigns/campaign-types';

function deps() {
  return { campaigns: getCampaignsAdminGateway(), auth: getAuthGateway(), store: getSessionStore() };
}

export async function GET(_request: Request, context: { params: Promise<{ id: string }> }) {
  const { id } = await context.params;
  const result = await getCampaign(deps(), id);
  if (!result.ok) {
    return NextResponse.json({ error: result.error.message }, { status: statusFromError(result.error) });
  }
  return NextResponse.json(result.value);
}

export async function PUT(request: Request, context: { params: Promise<{ id: string }> }) {
  const { id } = await context.params;
  const body = (await request.json()) as CampaignInput;
  const result = await updateCampaign(deps(), id, body);
  if (!result.ok) {
    return NextResponse.json({ error: result.error.message }, { status: statusFromError(result.error) });
  }
  return new NextResponse(null, { status: 204 });
}
