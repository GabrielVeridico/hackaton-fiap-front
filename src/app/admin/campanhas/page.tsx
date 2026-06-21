import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { CampaignsTable } from './campaigns-table';

export const metadata = { title: 'Gestão de campanhas — Conexão Solidária' };

export default function AdminCampanhasPage() {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Campanhas</h1>
        <Button render={<Link href="/admin/campanhas/nova" />} nativeButton={false}>
          Nova campanha
        </Button>
      </div>
      <CampaignsTable />
    </div>
  );
}
