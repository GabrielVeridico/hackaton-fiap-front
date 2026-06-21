import 'server-only';
import { Result } from '@/domain/shared/result';
import { errorFromHttpStatus } from '@/domain/shared/domain-error';
import { resolveBaseUrl, type AppConfig, type UpstreamGroup } from '../config/env';

export interface UpstreamRequest {
  group: UpstreamGroup;
  path: string;
  method?: string;
  body?: unknown;
  bearer?: string;
}

interface Deps {
  config: AppConfig;
  fetchImpl?: typeof fetch;
}

interface ProblemDetails {
  title?: string;
  detail?: string;
  status?: number;
}

export async function callUpstream<T>(req: UpstreamRequest, deps: Deps): Promise<Result<T>> {
  const doFetch = deps.fetchImpl ?? fetch;
  const url = resolveBaseUrl(deps.config, req.group) + req.path;
  const headers: Record<string, string> = { Accept: 'application/json' };
  if (req.body !== undefined) {
    headers['Content-Type'] = 'application/json';
  }
  if (req.bearer) {
    headers.Authorization = `Bearer ${req.bearer}`;
  }

  let response: Response;
  try {
    response = await doFetch(url, {
      method: req.method ?? 'GET',
      headers,
      body: req.body !== undefined ? JSON.stringify(req.body) : undefined,
      cache: 'no-store',
    });
  } catch (cause) {
    return Result.fail<T>({ kind: 'upstream', message: 'Falha de conexão com o serviço', details: cause });
  }

  if (!response.ok) {
    const problem = await safeJson<ProblemDetails>(response);
    const message = problem?.detail ?? problem?.title ?? `Erro ${response.status}`;
    return Result.fail<T>(errorFromHttpStatus(response.status, message, problem));
  }

  if (response.status === 204) {
    return Result.ok<T>(undefined as T);
  }
  const value = await safeJson<T>(response);
  return Result.ok<T>(value as T);
}

async function safeJson<T>(response: Response): Promise<T | undefined> {
  try {
    return (await response.json()) as T;
  } catch {
    return undefined;
  }
}
