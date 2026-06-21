'use client';

import Link from 'next/link';
import { useAdminCampaigns } from '@/hooks/use-admin-campaigns';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function AdminDashboardPage() {
  const { data } = useAdminCampaigns();
  const campaigns = data ?? [];
  const active = campaigns.filter((c) => c.status === 'Active').length;

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">Visão geral</h1>
      <div className="grid gap-4 sm:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Campanhas ativas</CardTitle>
          </CardHeader>
          <CardContent className="text-3xl font-bold text-primary">{active}</CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Total de campanhas</CardTitle>
          </CardHeader>
          <CardContent className="text-3xl font-bold">{campaigns.length}</CardContent>
        </Card>
      </div>
      <Link
        href="/admin/campanhas"
        className="inline-block text-sm font-medium text-primary hover:underline"
      >
        Gerenciar campanhas →
      </Link>
    </div>
  );
}
