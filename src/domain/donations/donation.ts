export type PaymentMethod = 'Pix' | 'CreditCard' | 'BankTransfer';
export type DonationStatus = 'Pending' | 'Approved' | 'Declined';

export interface Donation {
  id: string;
  campaignId: string;
  amount: number;
  method: PaymentMethod;
  status: DonationStatus;
  declineReason?: string;
  createdAt: string;
  processedAt?: string;
}

export function paymentMethodToCode(method: PaymentMethod): 0 | 1 | 2 {
  switch (method) {
    case 'Pix':
      return 0;
    case 'CreditCard':
      return 1;
    case 'BankTransfer':
      return 2;
  }
}

export function endsInTestDeclineCents(amount: number): boolean {
  return Math.round(amount * 100) % 100 === 99;
}

export function isPositiveAmount(amount: number): boolean {
  return amount > 0;
}
