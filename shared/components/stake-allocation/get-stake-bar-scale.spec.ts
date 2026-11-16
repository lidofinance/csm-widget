import { getStakeBarScale } from './get-stake-bar-scale';

describe('getStakeBarScale', () => {
  it.each([
    ['under-allocated', { active: 10, depositable: 5, target: 20 }, 22],
    ['exactly filled', { active: 10, depositable: 10, target: 20 }, 22],
    ['over-allocated', { active: 30, depositable: 0, target: 20 }, 33],
  ])('%s', (_name, input, max) => {
    const r = getStakeBarScale(input);
    expect(r.max).toBeCloseTo(max);
    expect(r.limit).toBe(20);
  });

  it('target 0 has no limit', () => {
    const r = getStakeBarScale({ active: 5, depositable: 0, target: 0 });
    expect(r.max).toBeCloseTo(5.5);
    expect(r).not.toHaveProperty('limit');
  });

  it('empty has no limit', () => {
    const r = getStakeBarScale({ active: 0, depositable: 0, target: 0 });
    expect(r.max).toBeCloseTo(1.1);
    expect(r).not.toHaveProperty('limit');
  });

  it('weightZero hides limit but keeps target in max', () => {
    const r = getStakeBarScale({
      active: 5,
      depositable: 0,
      target: 20,
      weightZero: true,
    });
    expect(r.max).toBeCloseTo(22);
    expect(r).not.toHaveProperty('limit');
  });
});
