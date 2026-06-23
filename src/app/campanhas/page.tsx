import { PageHeader } from '@/components/page-header';
import { CampaignsToSupport } from './campaigns-to-support';

export const metadata = { title: 'Campanhas — Conexão Solidária' };

export default function CampanhasPage() {
  return (
    <div className="space-y-8">
      <PageHeader title="Campanhas ativas" subtitle="Escolha uma causa e faça a sua doação." />
      <CampaignsToSupport />
    </div>
  );
}
