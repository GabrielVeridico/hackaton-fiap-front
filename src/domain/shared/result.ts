import type { DomainError } from './domain-error';

export type Result<T> =
  | { ok: true; value: T }
  | { ok: false; error: DomainError };

export const Result = {
  ok<T>(value: T): Result<T> {
    return { ok: true, value };
  },
  fail<T = never>(error: DomainError): Result<T> {
    return { ok: false, error };
  },
};
