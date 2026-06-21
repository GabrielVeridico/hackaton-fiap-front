import { NextResponse } from 'next/server';
import { getAuthGateway, getCampaignsAdminGateway, getSessionStore } from '@/infrastructure/composition';
import { createCampaign, listCampaigns } from '@/application/campaigns/campaign-use-cases';
import { statusFromError } from '@/lib/http-status';
import type { CampaignInput } from '@/application/campaigns/campaign-types';

function deps() {
  return { campaigns: getCampaignsAdminGateway(), auth: getAuthGateway(), store: getSessionStore() };
}

export async function GET() {
  const result = await listCampaigns(deps());
  if (!result.ok) {
    return NextResponse.json({ error: result.error.message }, { status: statusFromError(result.error) });
  }
  return NextResponse.json(result.value);
}

export async function POST(request: Request) {
  const body = (await request.json()) as CampaignInput;
  const result = await createCampaign(deps(), body);
  if (!result.ok) {
    return NextResponse.json({ error: result.error.message }, { status: statusFromError(result.error) });
  }
  return NextResponse.json({ id: result.value }, { status: 201 });
}
