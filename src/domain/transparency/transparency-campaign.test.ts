import { describe, it, expect } from 'vitest';
import { computePercentage } from './transparency-campaign';

describe('computePercentage', () => {
  it('calcula proporção', () => {
    expect(computePercentage(1000, 250)).toBe(25);
  });
  it('faz clamp em 100', () => {
    expect(computePercentage(1000, 5000)).toBe(100);
  });
  it('retorna 0 quando meta <= 0', () => {
    expect(computePercentage(0, 100)).toBe(0);
  });
  it('arredonda', () => {
    expect(computePercentage(3, 1)).toBe(33);
  });
});
