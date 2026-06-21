'use client';

import { Button } from '@/components/ui/button';
import { CampaignCard } from '@/components/campaign-card';
import { useActiveCampaigns } from '@/hooks/use-active-campaigns';

export function TransparencyGrid() {
  const { data, isLoading, isError, error, refetch, isFetching } = useActiveCampaigns();

  if (isLoading) {
    return <p className="text-muted-foreground">Carregando campanhas…</p>;
  }
  if (isError) {
    return <p className="text-destructive">{(error as Error).message}</p>;
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          Os valores refletem doações já processadas e podem levar instantes para atualizar.
        </p>
        <Button variant="outline" size="sm" onClick={() => refetch()} disabled={isFetching}>
          {isFetching ? 'Atualizando…' : 'Atualizar'}
        </Button>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {(data ?? []).map((c) => (
          <CampaignCard key={c.id} campaign={c} />
        ))}
      </div>
    </div>
  );
}
