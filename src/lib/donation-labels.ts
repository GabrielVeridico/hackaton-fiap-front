import type { DonationStatus, PaymentMethod } from '@/domain/donations/donation';

export function statusLabel(status: DonationStatus): string {
  const map: Record<DonationStatus, string> = {
    Pending: 'Processando',
    Approved: 'Aprovada',
    Declined: 'Recusada',
  };
  return map[status];
}

export function methodLabel(method: PaymentMethod): string {
  const map: Record<PaymentMethod, string> = {
    Pix: 'Pix',
    CreditCard: 'Cartão de crédito',
    BankTransfer: 'Transferência',
  };
  return map[method];
}
