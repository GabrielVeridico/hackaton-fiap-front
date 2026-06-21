'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { useAdminCampaigns, useChangeCampaignStatus } from '@/hooks/use-admin-campaigns';
import { formatBRL } from '@/lib/format';
import { campaignStatusLabel, completionReasonLabel } from '@/lib/campaign-labels';
import type { Campaign } from '@/domain/campaigns/campaign';

function StatusActions({ campaign }: { campaign: Campaign }) {
  const { mutate, isPending } = useChangeCampaignStatus(campaign.id);
  if (campaign.status !== 'Active') {
    return null;
  }
  return (
    <div className="flex gap-2">
      <Button
        variant="outline"
        size="sm"
        disabled={isPending}
        onClick={() => mutate('Close')}
      >
        Encerrar
      </Button>
      <Button
        variant="outline"
        size="sm"
        disabled={isPending}
        onClick={() => mutate('Cancel')}
      >
        Cancelar
      </Button>
    </div>
  );
}

export function CampaignsTable() {
  const { data, isLoading, isError, error } = useAdminCampaigns();

  if (isLoading) {
    return <p className="text-muted-foreground">Carregando…</p>;
  }
  if (isError) {
    return <p className="text-destructive">{(error as Error).message}</p>;
  }
  const campaigns = data ?? [];
  if (campaigns.length === 0) {
    return <p className="text-muted-foreground">Nenhuma campanha cadastrada.</p>;
  }

  return (
    <div className="overflow-x-auto rounded-lg border">
      <table className="w-full text-sm">
        <thead className="bg-muted/50 text-left">
          <tr>
            <th className="p-3">Título</th>
            <th className="p-3">Meta</th>
            <th className="p-3">Arrecadado</th>
            <th className="p-3">Status</th>
            <th className="p-3">Ações</th>
          </tr>
        </thead>
        <tbody className="divide-y">
          {campaigns.map((c) => (
            <tr key={c.id}>
              <td className="p-3">
                <Link
                  href={`/admin/campanhas/${c.id}`}
                  className="font-medium text-primary hover:underline"
                >
                  {c.title}
                </Link>
              </td>
              <td className="p-3">{formatBRL(c.goal)}</td>
              <td className="p-3">{formatBRL(c.amountRaised)}</td>
              <td className="p-3">
                {campaignStatusLabel(c.status)}
                {c.completionReason != null ? (
                  <span className="block text-xs text-muted-foreground">
                    {completionReasonLabel(c.completionReason)}
                  </span>
                ) : null}
              </td>
              <td className="p-3">
                <StatusActions campaign={c} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
