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
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {campaigns.map((c) => {
        const href = canDonate
          ? `/doar/${c.id}?titulo=${encodeURIComponent(c.title)}`
          : `/login?next=${encodeURIComponent('/campanhas')}`;
        return (
          <div key={c.id} className="flex flex-col gap-2">
            <CampaignCard campaign={c} />
            {user && !canDonate ? (
              <p className="text-center text-xs text-muted-foreground">Apenas doadores podem doar.</p>
            ) : (
              <Button render={<Link href={href} />} nativeButton={false} className="w-full">
                Doar
              </Button>
            )}
          </div>
        );
      })}
    </div>
  );
}
