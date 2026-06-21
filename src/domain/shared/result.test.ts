import { describe, it, expect } from 'vitest';
import { Result } from './result';
import { errorFromHttpStatus } from './domain-error';

describe('Result', () => {
  it('ok carrega valor', () => {
    const r = Result.ok(42);
    expect(r.ok).toBe(true);
    if (r.ok) expect(r.value).toBe(42);
  });

  it('fail carrega erro', () => {
    const r = Result.fail<number>({ kind: 'notFound', message: 'x' });
    expect(r.ok).toBe(false);
    if (!r.ok) expect(r.error.kind).toBe('notFound');
  });
});

describe('errorFromHttpStatus', () => {
  it.each([
    [400, 'validation'],
    [401, 'unauthorized'],
    [403, 'forbidden'],
    [404, 'notFound'],
    [409, 'conflict'],
    [422, 'unprocessable'],
    [500, 'upstream'],
  ] as const)('mapeia %i → %s', (status, kind) => {
    expect(errorFromHttpStatus(status, 'm').kind).toBe(kind);
  });
});
