'use client';

import { useAuth } from '@/hooks/use-auth';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function PerfilPage() {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return <p className="text-muted-foreground">Carregando…</p>;
  }
  if (!user) {
    return <p className="text-muted-foreground">Você não está autenticado.</p>;
  }

  const personType = user.personType === 'Company' ? 'Pessoa Jurídica' : 'Pessoa Física';
  return (
    <div className="mx-auto max-w-lg">
      <Card>
        <CardHeader>
          <CardTitle>Meu perfil</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm">
          <p><span className="text-muted-foreground">Nome:</span> {user.name}</p>
          <p><span className="text-muted-foreground">E-mail:</span> {user.email}</p>
          <p><span className="text-muted-foreground">Documento:</span> {user.document}</p>
          <p><span className="text-muted-foreground">Tipo:</span> {personType}</p>
          <p><span className="text-muted-foreground">Papel:</span> {user.role}</p>
        </CardContent>
      </Card>
    </div>
  );
}
