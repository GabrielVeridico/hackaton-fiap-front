import 'server-only';
import { Result } from '@/domain/shared/result';
import { endsInTestDeclineCents, type Donation } from '@/domain/donations/donation';
import type { DonationsGateway } from '@/application/ports/donations-gateway';
import type { CreateDonationInput, CreateDonationResult } from '@/application/donations/donation-types';

// Fake saga em memória (processo do dev server): cada doação criada começa
// Pending e, após 2 leituras, conclui (Declined se centavos ,99; senão Approved).
interface MockEntry extends Donation {
  reads: number;
}

const STORE = new Map<string, MockEntry>();
let counter = 0;

export class MockDonationsGateway implements DonationsGateway {
  async createDonation(input: CreateDonationInput): Promise<Result<CreateDonationResult>> {
    counter += 1;
    const id = `mock-${counter}-${input.campaignId.slice(0, 8)}`;
    STORE.set(id, {
      id,
      campaignId: input.campaignId,
      amount: input.amount,
      method: input.method,
      status: 'Pending',
      createdAt: new Date().toISOString(),
      reads: 0,
    });
    return Result.ok({ donationId: id, status: 'Pending' });
  }

  async getDonationById(id: string): Promise<Result<Donation>> {
    const entry = STORE.get(id);
    if (!entry) {
      return Result.fail<Donation>({ kind: 'notFound', message: 'Doação não encontrada' });
    }
    entry.reads += 1;
    if (entry.status === 'Pending' && entry.reads >= 2) {
      if (endsInTestDeclineCents(entry.amount)) {
        entry.status = 'Declined';
        entry.declineReason = 'Pagamento recusado (marcador de teste ,99)';
      } else {
        entry.status = 'Approved';
      }
      entry.processedAt = new Date().toISOString();
    }
    const { reads, ...donation } = entry;
    void reads;
    return Result.ok(donation);
  }

  async listMyDonations(): Promise<Result<Donation[]>> {
    const list = Array.from(STORE.values()).map(({ reads, ...d }) => {
      void reads;
      return d;
    });
    return Result.ok(list);
  }
}
