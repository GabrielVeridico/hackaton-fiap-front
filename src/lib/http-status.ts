import type { DomainError } from '@/domain/shared/domain-error';

export function statusFromError(error: DomainError): number {
  const map: Record<DomainError['kind'], number> = {
    validation: 400,
    unauthorized: 401,
    forbidden: 403,
    notFound: 404,
    conflict: 409,
    unprocessable: 422,
    upstream: 502,
    unknown: 500,
  };
  return map[error.kind];
}
