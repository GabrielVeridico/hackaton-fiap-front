import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { CampaignCard } from '@/components/campaign-card';
import { getTransparencyGateway } from '@/infrastructure/composition';
import { listActiveCampaigns } from '@/application/transparency/list-active-campaigns';

export default async function HomePage() {
  const result = await listActiveCampaigns(getTransparencyGateway());
  const featured = result.ok ? result.value.slice(0, 3) : [];

  return (
    <div className="space-y-12">
      <section className="rounded-2xl bg-accent/60 p-10 text-center">
        <h1 className="text-3xl font-bold text-foreground sm:text-4xl">
          Transforme solidariedade em impacto
        </h1>
        <p className="mx-auto mt-3 max-w-2xl text-muted-foreground">
          Acompanhe nossas campanhas com total transparência e ajude a acolher crianças em situação
          de vulnerabilidade.
        </p>
        <div className="mt-6 flex justify-center gap-3">
          <Button render={<Link href="/transparencia" />} size="lg" nativeButton={false}>
            Ver campanhas
          </Button>
          <Button render={<Link href="/cadastro" />} size="lg" variant="outline" nativeButton={false}>
            Quero doar
          </Button>
        </div>
      </section>

      {featured.length > 0 ? (
        <section className="space-y-4">
          <h2 className="text-2xl font-semibold">Campanhas em destaque</h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {featured.map((c) => (
              <CampaignCard key={c.id} campaign={c} />
            ))}
          </div>
        </section>
      ) : null}
    </div>
  );
}
