import type { ReactNode } from 'react';
import { AdminGuard } from './admin-guard';
import { AdminNav } from './admin-nav';

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <AdminGuard>
      <div className="space-y-6">
        <AdminNav />
        {children}
      </div>
    </AdminGuard>
  );
}
