'use client';

import Link from 'next/link';
import { useMyDonations } from '@/hooks/use-donations';
import { formatBRL } from '@/lib/format';
import { statusLabel } from '@/lib/donation-labels';

export function DonationsList() {
  const { data, isLoading, isError, error } = useMyDonations();

  if (isLoading) {
    return <p className="text-muted-foreground">Carregando…</p>;
  }
  if (isError) {
    return <p className="text-destructive">{(error as Error).message}</p>;
  }
  const donations = data ?? [];
  if (donations.length === 0) {
    return <p className="text-muted-foreground">Você ainda não fez doações.</p>;
  }

  return (
    <ul className="divide-y rounded-lg border">
      {donations.map((d) => (
        <li key={d.id} className="flex items-center justify-between p-4">
          <div>
            <p className="font-medium">{formatBRL(d.amount)}</p>
            <p className="text-sm text-muted-foreground">{statusLabel(d.status)}</p>
          </div>
          <Link href={`/minhas-doacoes/${d.id}`} className="text-sm font-medium text-primary hover:underline">
            Ver status
          </Link>
        </li>
      ))}
    </ul>
  );
}
