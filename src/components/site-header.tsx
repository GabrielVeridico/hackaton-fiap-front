import Link from 'next/link';
import { HeartHandshake } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { AuthNav } from '@/components/auth-nav';

export function SiteHeader() {
  return (
    <header className="border-b bg-background/80 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        <Link href="/" className="flex items-center gap-2 font-semibold text-primary">
          <HeartHandshake className="size-6" />
          Conexão Solidária
        </Link>
        <nav className="flex items-center gap-2">
          <Button render={<Link href="/transparencia" />} variant="ghost" nativeButton={false}>
            Transparência
          </Button>
          <AuthNav />
        </nav>
      </div>
    </header>
  );
}
