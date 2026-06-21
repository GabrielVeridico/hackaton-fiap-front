export async function bffGet<T>(path: string): Promise<T> {
  const response = await fetch(`/api/bff${path}`, { headers: { Accept: 'application/json' } });
  if (!response.ok) {
    const body = (await response.json().catch(() => null)) as { error?: string } | null;
    throw new Error(body?.error ?? `Erro ${response.status}`);
  }
  return (await response.json()) as T;
}
