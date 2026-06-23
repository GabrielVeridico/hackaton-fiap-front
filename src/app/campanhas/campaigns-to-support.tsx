'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { CampaignCard } from '@/components/campaign-card';
import { useActiveCampaigns } from '@/hooks/use-active-campaigns';
import { useAuth } from '@/hooks/use-auth';

export function CampaignsToSupport() {
  const { data, isLoading, isError, error } = useActiveCampaigns();
  const { user } = useAuth();

  if (isLoading) {
    return <p className="text-muted-foreground">Carregando campanhas…</p>;
  }
  if (isError) {
    return <p className="text-destructive">{(error as Error).message}</p>;
  }

  const campaigns = data ?? [];
  if (campaigns.length === 0) {
    return <p className="text-muted-foreground">Nenhuma campanha ativa no momento.</p>;
  }

  const canDonate = user?.role === 'Doador';

  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {campaigns.map((c) => {
        const href = canDonate
          ? `/doar/${c.id}?titulo=${encodeURIComponent(c.title)}`
          : `/login?next=${encodeURIComponent('/campanhas')}`;
        const action =
          user && !canDonate ? (
            <p className="w-full text-center text-sm text-muted-foreground">
              Apenas doadores podem doar.
            </p>
          ) : (
            <Button render={<Link href={href} />} nativeButton={false} size="lg" className="w-full">
              Doar
            </Button>
          );
        return <CampaignCard key={c.id} campaign={c} action={action} />;
      })}
    </div>
  );
}
