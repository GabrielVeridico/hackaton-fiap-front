import { describe, it, expect } from 'vitest';
import { statusFromError } from './http-status';

describe('statusFromError', () => {
  it.each([
    ['validation', 400],
    ['unauthorized', 401],
    ['forbidden', 403],
    ['notFound', 404],
    ['conflict', 409],
    ['unprocessable', 422],
    ['upstream', 502],
    ['unknown', 500],
  ] as const)('%s → %i', (kind, status) => {
    expect(statusFromError({ kind, message: 'm' })).toBe(status);
  });
});
