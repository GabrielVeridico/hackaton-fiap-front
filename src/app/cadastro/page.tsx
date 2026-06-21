import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CadastroForm } from './cadastro-form';

export const metadata = { title: 'Criar conta — Conexão Solidária' };

export default function CadastroPage() {
  return (
    <div className="mx-auto max-w-md">
      <Card>
        <CardHeader>
          <CardTitle>Criar conta de doador</CardTitle>
          <p className="text-sm text-muted-foreground">
            Cadastre-se para apoiar campanhas e acompanhar suas doações.
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          <CadastroForm />
          <p className="text-center text-sm text-muted-foreground">
            Já tem conta?{' '}
            <Link href="/login" className="font-medium text-primary hover:underline">
              Entrar
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
