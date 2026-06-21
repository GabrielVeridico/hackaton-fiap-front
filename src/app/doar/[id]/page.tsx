import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { DonationForm } from './donation-form';

export const metadata = { title: 'Doar — Conexão Solidária' };

export default async function DoarPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ titulo?: string }>;
}) {
  const { id } = await params;
  const { titulo } = await searchParams;
  return (
    <div className="mx-auto max-w-md">
      <Card>
        <CardHeader>
          <CardTitle>Fazer uma doação</CardTitle>
        </CardHeader>
        <CardContent>
          <DonationForm campaignId={id} campaignTitle={titulo ?? 'esta campanha'} />
        </CardContent>
      </Card>
    </div>
  );
}
