'use client';

import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CampaignForm } from '../campaign-form';
import { useCreateCampaign } from '@/hooks/use-admin-campaigns';

export default function NovaCampanhaPage() {
  const router = useRouter();
  const { mutate, isPending, error } = useCreateCampaign();
  return (
    <Card className="mx-auto max-w-2xl">
      <CardHeader>
        <CardTitle>Nova campanha</CardTitle>
      </CardHeader>
      <CardContent>
        <CampaignForm
          submitLabel="Criar"
          isPending={isPending}
          error={error?.message ?? null}
          onSubmit={(input) =>
            mutate(input, { onSuccess: () => router.push('/admin/campanhas') })
          }
        />
      </CardContent>
    </Card>
  );
}
