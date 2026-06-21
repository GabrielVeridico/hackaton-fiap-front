import { NextResponse } from 'next/server';
import { getTransparencyGateway } from '@/infrastructure/composition';
import { listActiveCampaigns } from '@/application/transparency/list-active-campaigns';
import { statusFromError } from '@/lib/http-status';

export async function GET() {
  const result = await listActiveCampaigns(getTransparencyGateway());
  if (!result.ok) {
    return NextResponse.json({ error: result.error.message }, { status: statusFromError(result.error) });
  }
  return NextResponse.json(result.value);
}
