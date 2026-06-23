import type { ReactNode } from 'react';

/**
 * Cabeçalho de página padrão: título proeminente + subtítulo opcional + ação opcional,
 * com uma divisória que separa claramente o cabeçalho do conteúdo.
 */
export function PageHeader({
  title,
  subtitle,
  action,
}: {
  title: string;
  subtitle?: string;
  action?: ReactNode;
}) {
  return (
    <header className="flex flex-col gap-4 border-b pb-5 sm:flex-row sm:items-end sm:justify-between">
      <div className="space-y-1">
        <h1 className="text-3xl font-bold tracking-tight text-foreground">{title}</h1>
        {subtitle ? <p className="text-muted-foreground">{subtitle}</p> : null}
      </div>
      {action ? <div className="shrink-0">{action}</div> : null}
    </header>
  );
}
