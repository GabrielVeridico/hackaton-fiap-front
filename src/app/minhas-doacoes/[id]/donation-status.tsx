'use client';

import { useDonation } from '@/hooks/use-donations';
import { formatBRL } from '@/lib/format';
import { statusLabel, methodLabel } from '@/lib/donation-labels';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export function DonationStatus({ id }: { id: string }) {
  const { data, isLoading, isError, error } = useDonation(id);

  if (isLoading) {
    return <p className="text-muted-foreground">Carregando…</p>;
  }
  if (isError || !data) {
    return <p className="text-destructive">{(error as Error)?.message ?? 'Doação não encontrada.'}</p>;
  }

  const tone =
    data.status === 'Approved' ? 'text-secondary' : data.status === 'Declined' ? 'text-destructive' : 'text-amber-600';

  return (
    <Card className="mx-auto max-w-md">
      <CardHeader>
        <CardTitle>Status da doação</CardTitle>
      </CardHeader>
      <CardContent className="space-y-2 text-sm">
        <p className={`text-lg font-semibold ${tone}`}>{statusLabel(data.status)}</p>
        {data.status === 'Pending' ? (
          <p className="text-muted-foreground">Processando o pagamento… esta página atualiza sozinha.</p>
        ) : null}
        {data.declineReason ? <p className="text-destructive">{data.declineReason}</p> : null}
        <p><span className="text-muted-foreground">Valor:</span> {formatBRL(data.amount)}</p>
        <p><span className="text-muted-foreground">Forma:</span> {methodLabel(data.method)}</p>
      </CardContent>
    </Card>
  );
}
