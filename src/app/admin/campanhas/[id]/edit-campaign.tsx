'use client';

import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CampaignForm } from '../campaign-form';
import {
  useAdminCampaign,
  useUpdateCampaign,
  useChangeCampaignStatus,
} from '@/hooks/use-admin-campaigns';
import { campaignStatusLabel } from '@/lib/campaign-labels';

export function EditCampaign({ id }: { id: string }) {
  const router = useRouter();
  const { data, isLoading, isError, error } = useAdminCampaign(id);
  const update = useUpdateCampaign(id);
  const status = useChangeCampaignStatus(id);

  if (isLoading) {
    return <p className="text-muted-foreground">Carregando…</p>;
  }
  if (isError || !data) {
    return (
      <p className="text-destructive">
        {(error as Error)?.message ?? 'Campanha não encontrada.'}
      </p>
    );
  }

  return (
    <Card className="mx-auto max-w-2xl">
      <CardHeader>
        <CardTitle>Editar campanha</CardTitle>
        <p className="text-sm text-muted-foreground">
          Status atual: {campaignStatusLabel(data.status)}
        </p>
      </CardHeader>
      <CardContent className="space-y-6">
        <CampaignForm
          submitLabel="Salvar"
          isPending={update.isPending}
          error={update.error?.message ?? null}
          defaultValues={data}
          onSubmit={(input) =>
            update.mutate(input, { onSuccess: () => router.push('/admin/campanhas') })
          }
        />
        {data.status === 'Active' ? (
          <div className="flex gap-2 border-t pt-4">
            <Button
              variant="outline"
              disabled={status.isPending}
              onClick={() =>
                status.mutate('Close', { onSuccess: () => router.push('/admin/campanhas') })
              }
            >
              Encerrar
            </Button>
            <Button
              variant="outline"
              disabled={status.isPending}
              onClick={() =>
                status.mutate('Cancel', { onSuccess: () => router.push('/admin/campanhas') })
              }
            >
              Cancelar
            </Button>
          </div>
        ) : null}
      </CardContent>
    </Card>
  );
}
