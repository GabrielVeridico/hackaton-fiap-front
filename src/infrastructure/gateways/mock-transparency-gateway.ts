import 'server-only';
import { Result } from '@/domain/shared/result';
import type { TransparencyCampaign } from '@/domain/transparency/transparency-campaign';
import type { TransparencyGateway } from '@/application/ports/transparency-gateway';

const FIXTURE: TransparencyCampaign[] = [
  { id: '11111111-1111-1111-1111-111111111111', title: 'Cestas básicas de inverno', description: 'Alimento para 200 famílias acolhidas.', goal: 50000, amountRaised: 32500, percentage: 65 },
  { id: '22222222-2222-2222-2222-222222222222', title: 'Material escolar 2026', description: 'Mochilas e kits para as crianças.', goal: 20000, amountRaised: 8000, percentage: 40 },
  { id: '33333333-3333-3333-3333-333333333333', title: 'Reforma do abrigo', description: 'Telhado e segurança da casa de acolhimento.', goal: 120000, amountRaised: 9000, percentage: 8 },
];

export class MockTransparencyGateway implements TransparencyGateway {
  async listActiveCampaigns(): Promise<Result<TransparencyCampaign[]>> {
    return Result.ok(FIXTURE);
  }
}
