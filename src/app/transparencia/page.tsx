import { PageHeader } from '@/components/page-header';
import { TransparencyGrid } from './transparency-grid';

export const metadata = { title: 'Transparência — Conexão Solidária' };

export default function TransparenciaPage() {
  return (
    <div className="space-y-8">
      <PageHeader
        title="Painel de Transparência"
        subtitle="Campanhas ativas e o quanto já arrecadaram."
      />
      <TransparencyGrid />
    </div>
  );
}
