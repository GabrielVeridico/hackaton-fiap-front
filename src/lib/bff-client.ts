export async function bffGet<T>(path: string): Promise<T> {
  const response = await fetch(`/api/bff${path}`, { headers: { Accept: 'application/json' } });
  if (!response.ok) {
    const body = (await response.json().catch(() => null)) as { error?: string } | null;
    throw new Error(body?.error ?? `Erro ${response.status}`);
  }
  return (await response.json()) as T;
}

async function bffSend<T>(method: string, path: string, body: unknown): Promise<T> {
  const response = await fetch(`/api/bff${path}`, {
    method,
    headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
    body: JSON.stringify(body),
  });
  if (!response.ok) {
    const data = (await response.json().catch(() => null)) as { error?: string } | null;
    throw new Error(data?.error ?? `Erro ${response.status}`);
  }
  if (response.status === 204 || response.headers.get('content-length') === '0') {
    return undefined as T;
  }
  return (await response.json().catch(() => undefined)) as T;
}

export function bffPost<T>(path: string, body: unknown): Promise<T> {
  return bffSend<T>('POST', path, body);
}

export function bffPut<T>(path: string, body: unknown): Promise<T> {
  return bffSend<T>('PUT', path, body);
}

export function bffPatch<T>(path: string, body: unknown): Promise<T> {
  return bffSend<T>('PATCH', path, body);
}
