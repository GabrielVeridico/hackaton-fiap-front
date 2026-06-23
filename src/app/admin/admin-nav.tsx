'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const TABS = [
  { href: '/admin', label: 'Visão geral' },
  { href: '/admin/campanhas', label: 'Campanhas' },
  { href: '/admin/usuarios', label: 'Usuários' },
] as const;

function isActive(pathname: string, href: string): boolean {
  // "/admin" só ativa na rota exata; as demais ativam também nas subrotas (ex.: /admin/campanhas/nova).
  return href === '/admin' ? pathname === '/admin' : pathname === href || pathname.startsWith(`${href}/`);
}

export function AdminNav() {
  const pathname = usePathname();
  return (
    <nav className="flex gap-6 border-b text-sm">
      {TABS.map((tab) => {
        const active = isActive(pathname, tab.href);
        return (
          <Link
            key={tab.href}
            href={tab.href}
            aria-current={active ? 'page' : undefined}
            className={`-mb-px border-b-2 pb-3 font-medium transition-colors ${
              active
                ? 'border-primary text-primary'
                : 'border-transparent text-muted-foreground hover:text-foreground'
            }`}
          >
            {tab.label}
          </Link>
        );
      })}
    </nav>
  );
}
