import { NextResponse } from 'next/server';
import { getAuthGateway, getDonationsGateway, getSessionStore } from '@/infrastructure/composition';
import { createDonation, listMyDonations } from '@/application/donations/donation-use-cases';
import { statusFromError } from '@/lib/http-status';
import type { PaymentMethod } from '@/domain/donations/donation';

interface CreateBody {
  campaignId: string;
  amount: number;
  method: PaymentMethod;
}

function deps() {
  return { donations: getDonationsGateway(), auth: getAuthGateway(), store: getSessionStore() };
}

export async function POST(request: Request) {
  const body = (await request.json()) as CreateBody;
  const result = await createDonation(deps(), {
    campaignId: body.campaignId,
    amount: body.amount,
    method: body.method,
  });
  if (!result.ok) {
    return NextResponse.json({ error: result.error.message }, { status: statusFromError(result.error) });
  }
  return NextResponse.json(result.value, { status: 202 });
}

export async function GET() {
  const result = await listMyDonations(deps());
  if (!result.ok) {
    return NextResponse.json({ error: result.error.message }, { status: statusFromError(result.error) });
  }
  return NextResponse.json(result.value);
}
