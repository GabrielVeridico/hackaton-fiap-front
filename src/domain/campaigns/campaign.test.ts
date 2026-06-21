import { describe, it, expect } from 'vitest';
import { campaignStatusActionToCode, isGoalValid, isEndAfterStart, isEndNotInPast } from './campaign';

describe('campaignStatusActionToCode', () => {
  it('Close=0, Cancel=1', () => {
    expect(campaignStatusActionToCode('Close')).toBe(0);
    expect(campaignStatusActionToCode('Cancel')).toBe(1);
  });
});

describe('isGoalValid', () => {
  it('exige meta > 0', () => {
    expect(isGoalValid(100)).toBe(true);
    expect(isGoalValid(0)).toBe(false);
    expect(isGoalValid(-5)).toBe(false);
  });
});

describe('isEndAfterStart', () => {
  it('fim deve ser >= início', () => {
    expect(isEndAfterStart('2026-01-01', '2026-02-01')).toBe(true);
    expect(isEndAfterStart('2026-02-01', '2026-01-01')).toBe(false);
    expect(isEndAfterStart('2026-01-01', '2026-01-01')).toBe(true);
  });
});

describe('isEndNotInPast', () => {
  it('fim não pode estar no passado', () => {
    expect(isEndNotInPast('2026-12-31', '2026-06-21')).toBe(true);
    expect(isEndNotInPast('2026-01-01', '2026-06-21')).toBe(false);
  });
});
