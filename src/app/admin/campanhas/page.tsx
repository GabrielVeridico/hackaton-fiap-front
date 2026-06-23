import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { PageHeader } from '@/components/page-header';
import { CampaignsTable } from './campaigns-table';

export const metadata = { title: 'Gestão de campanhas — Conexão Solidária' };

export default function AdminCampanhasPage() {
  return (
    <div className="space-y-8">
      <PageHeader
        title="Campanhas"
        subtitle="Crie e gerencie as campanhas de arrecadação."
        action={
          <Button render={<Link href="/admin/campanhas/nova" />} nativeButton={false}>
            Nova campanha
          </Button>
        }
      />
      <CampaignsTable />
    </div>
  );
}
