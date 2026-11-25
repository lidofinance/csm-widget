import { getNewValidatorProgress } from './new-validator-progress';

const KEY = 2000n;

describe('getNewValidatorProgress', () => {
  it('returns 0 when nothing covers the key', () => {
    expect(
      getNewValidatorProgress({
        available: 0n,
        delta: 0n,
        requiredForKey: KEY,
      }),
    ).toBe(0);
  });

  it('floors partial coverage', () => {
    expect(
      getNewValidatorProgress({
        available: 1000n,
        delta: 729n,
        requiredForKey: KEY,
      }),
    ).toBe(86);
  });

  it('returns exactly 100 when fully covered', () => {
    expect(
      getNewValidatorProgress({
        available: 1000n,
        delta: 1000n,
        requiredForKey: KEY,
      }),
    ).toBe(100);
  });

  it('clamps above 100', () => {
    expect(
      getNewValidatorProgress({
        available: 9000n,
        delta: 9000n,
        requiredForKey: KEY,
      }),
    ).toBe(100);
  });

  it('offsets rewards by an insufficient bond', () => {
    expect(
      getNewValidatorProgress({
        available: 1000n,
        delta: -400n,
        requiredForKey: KEY,
      }),
    ).toBe(30);
    expect(
      getNewValidatorProgress({
        available: 100n,
        delta: -400n,
        requiredForKey: KEY,
      }),
    ).toBe(0);
  });

  it('returns 0 for a zero denominator', () => {
    expect(
      getNewValidatorProgress({
        available: 1000n,
        delta: 0n,
        requiredForKey: 0n,
      }),
    ).toBe(0);
  });
});
