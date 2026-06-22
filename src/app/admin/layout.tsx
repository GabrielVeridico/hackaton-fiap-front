import Link from 'next/link';
import type { ReactNode } from 'react';
import { AdminGuard } from './admin-guard';

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <AdminGuard>
      <div className="space-y-6">
        <nav className="flex gap-4 border-b pb-3 text-sm">
          <Link href="/admin" className="font-medium hover:text-primary">Visão geral</Link>
          <Link href="/admin/campanhas" className="font-medium hover:text-primary">Campanhas</Link>
          <Link href="/admin/usuarios" className="font-medium hover:text-primary">Usuários</Link>
        </nav>
        {children}
      </div>
    </AdminGuard>
  );
}
