import { getStrikeDots } from './get-strike-dots';

describe('getStrikeDots', () => {
  it('handles missing strikes', () => {
    expect(getStrikeDots(undefined, 3)).toEqual({
      count: 0,
      filled: 0,
      threshold: 3,
      lastStrikeIndex: undefined,
    });
  });

  it('counts strikes and finds the first non-zero frame', () => {
    expect(getStrikeDots([0, 1, 0, 1, 0, 0], 3)).toEqual({
      count: 2,
      filled: 2,
      threshold: 3,
      lastStrikeIndex: 1,
    });
  });

  it('caps filled dots at the threshold', () => {
    expect(getStrikeDots([1, 1, 1, 1, 0, 0], 3)).toEqual({
      count: 4,
      filled: 3,
      threshold: 3,
      lastStrikeIndex: 0,
    });
  });
});
