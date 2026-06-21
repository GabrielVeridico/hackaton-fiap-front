import { TransparencyGrid } from './transparency-grid';

export const metadata = { title: 'Transparência — Conexão Solidária' };

export default function TransparenciaPage() {
  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-2xl font-bold">Painel de Transparência</h1>
        <p className="text-muted-foreground">Campanhas ativas e o quanto já arrecadaram.</p>
      </header>
      <TransparencyGrid />
    </div>
  );
}
