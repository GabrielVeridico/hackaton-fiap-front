import { NextResponse } from 'next/server';
import { getAuthGateway, getDonationsGateway, getSessionStore } from '@/infrastructure/composition';
import { getDonation } from '@/application/donations/donation-use-cases';
import { statusFromError } from '@/lib/http-status';

function deps() {
  return { donations: getDonationsGateway(), auth: getAuthGateway(), store: getSessionStore() };
}

export async function GET(_request: Request, context: { params: Promise<{ id: string }> }) {
  const { id } = await context.params;
  const result = await getDonation(deps(), id);
  if (!result.ok) {
    return NextResponse.json({ error: result.error.message }, { status: statusFromError(result.error) });
  }
  return NextResponse.json(result.value);
}
