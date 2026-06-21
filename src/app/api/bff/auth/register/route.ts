import { NextResponse } from 'next/server';
import { getAuthGateway } from '@/infrastructure/composition';
import { registerDonor } from '@/application/auth/auth-use-cases';
import { statusFromError } from '@/lib/http-status';
import type { PersonType } from '@/domain/auth/auth-user';

interface RegisterBody {
  personType: PersonType;
  document: string;
  name: string;
  email: string;
  password: string;
}

export async function POST(request: Request) {
  const body = (await request.json()) as RegisterBody;
  const result = await registerDonor(getAuthGateway(), {
    personType: body.personType,
    document: body.document,
    name: body.name,
    email: body.email,
    password: body.password,
  });
  if (!result.ok) {
    return NextResponse.json({ error: result.error.message }, { status: statusFromError(result.error) });
  }
  return new NextResponse(null, { status: 201 });
}
