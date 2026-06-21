import { DonationsList } from './donations-list';

export const metadata = { title: 'Minhas doações — Conexão Solidária' };

export default function MinhasDoacoesPage() {
  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-2xl font-bold">Minhas doações</h1>
        <p className="text-muted-foreground">Acompanhe o status das suas contribuições.</p>
      </header>
      <DonationsList />
    </div>
  );
}
