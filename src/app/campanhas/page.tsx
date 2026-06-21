import { CampaignsToSupport } from './campaigns-to-support';

export const metadata = { title: 'Campanhas — Conexão Solidária' };

export default function CampanhasPage() {
  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-2xl font-bold">Campanhas ativas</h1>
        <p className="text-muted-foreground">Escolha uma causa e faça a sua doação.</p>
      </header>
      <CampaignsToSupport />
    </div>
  );
}
