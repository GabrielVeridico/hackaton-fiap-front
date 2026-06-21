'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useCreateDonation } from '@/hooks/use-donations';
import { endsInTestDeclineCents, isPositiveAmount, type PaymentMethod } from '@/domain/donations/donation';

const METHODS: { value: PaymentMethod; label: string }[] = [
  { value: 'Pix', label: 'Pix' },
  { value: 'CreditCard', label: 'Cartão de crédito' },
  { value: 'BankTransfer', label: 'Transferência' },
];

function parseAmount(raw: string): number {
  return Number(raw.replace(/\./g, '').replace(',', '.'));
}

export function DonationForm({
  campaignId,
  campaignTitle,
}: {
  campaignId: string;
  campaignTitle: string;
}) {
  const router = useRouter();
  const { mutate, isPending, error } = useCreateDonation();
  const [amountRaw, setAmountRaw] = useState('');
  const [method, setMethod] = useState<PaymentMethod>('Pix');
  const [touched, setTouched] = useState(false);

  const amount = parseAmount(amountRaw);
  const invalid = touched && !isPositiveAmount(amount);
  const warnCents = Number.isFinite(amount) && endsInTestDeclineCents(amount);

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setTouched(true);
    if (!isPositiveAmount(amount)) {
      return;
    }
    mutate(
      { campaignId, amount, method },
      { onSuccess: (r) => router.push(`/minhas-doacoes/${r.donationId}`) },
    );
  };

  return (
    <form onSubmit={onSubmit} className="space-y-4" noValidate>
      <p className="text-sm text-muted-foreground">
        Você está doando para <strong>{campaignTitle}</strong>.
      </p>
      <div className="space-y-1.5">
        <Label htmlFor="amount">Valor (R$)</Label>
        <Input
          id="amount"
          inputMode="decimal"
          placeholder="50,00"
          value={amountRaw}
          onChange={(e) => setAmountRaw(e.target.value)}
        />
        {invalid ? (
          <p className="text-sm text-destructive">O valor deve ser maior que zero.</p>
        ) : null}
        {warnCents ? (
          <p className="text-sm text-amber-600">
            Valores terminados em <strong>,99</strong> são recusados de propósito (marcador de
            teste).
          </p>
        ) : null}
      </div>
      <div className="space-y-1.5">
        <Label htmlFor="method">Forma de pagamento</Label>
        <select
          id="method"
          className="h-9 w-full rounded-lg border border-input bg-background px-3 text-sm"
          value={method}
          onChange={(e) => setMethod(e.target.value as PaymentMethod)}
        >
          {METHODS.map((m) => (
            <option key={m.value} value={m.value}>
              {m.label}
            </option>
          ))}
        </select>
      </div>
      {error ? <p className="text-sm text-destructive">{error.message}</p> : null}
      <Button type="submit" className="w-full" disabled={isPending}>
        {isPending ? 'Enviando…' : 'Doar'}
      </Button>
    </form>
  );
}
