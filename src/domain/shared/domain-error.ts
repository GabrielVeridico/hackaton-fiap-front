export type ErrorKind =
  | 'validation'
  | 'unauthorized'
  | 'forbidden'
  | 'notFound'
  | 'conflict'
  | 'unprocessable'
  | 'upstream'
  | 'unknown';

export interface DomainError {
  kind: ErrorKind;
  message: string;
  status?: number;
  details?: unknown;
}

export function errorFromHttpStatus(status: number, message: string, details?: unknown): DomainError {
  const map: Record<number, ErrorKind> = {
    400: 'validation',
    401: 'unauthorized',
    403: 'forbidden',
    404: 'notFound',
    409: 'conflict',
    422: 'unprocessable',
  };
  const kind: ErrorKind = map[status] ?? (status >= 500 ? 'upstream' : 'unknown');
  return { kind, message, status, details };
}
