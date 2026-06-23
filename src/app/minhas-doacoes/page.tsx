import { PageHeader } from '@/components/page-header';
import { DonationsList } from './donations-list';

export const metadata = { title: 'Minhas doações — Conexão Solidária' };

export default function MinhasDoacoesPage() {
  return (
    <div className="space-y-8">
      <PageHeader title="Minhas doações" subtitle="Acompanhe o status das suas contribuições." />
      <DonationsList />
    </div>
  );
}
