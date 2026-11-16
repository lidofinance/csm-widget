import { getDistributionLabel, getFrameRange } from './distribution-label';

const NOW = new Date(2025, 0, 10, 12, 0, 0);
const at = (days: number) =>
  Math.floor(new Date(2025, 0, 10 + days, 12).getTime() / 1000);

describe('getDistributionLabel', () => {
  beforeEach(() => {
    vi.useFakeTimers().setSystemTime(NOW);
  });
  afterEach(() => {
    vi.useRealTimers();
  });

  it('says soon for today and the past', () => {
    expect(getDistributionLabel(at(0))).toBe('Next distribution soon');
    expect(getDistributionLabel(at(-3))).toBe('Next distribution soon');
  });

  it('uses singular for tomorrow', () => {
    expect(getDistributionLabel(at(1))).toBe('Next distribution in 1 day');
  });

  it('counts calendar days', () => {
    expect(getDistributionLabel(at(12))).toBe('Next distribution in 12 days');
  });
});

describe('getFrameRange', () => {
  it('joins last and next report dates', () => {
    expect(getFrameRange({ lastReport: at(-20), nextReport: at(12) })).toBe(
      'Dec 21 — Jan 22',
    );
  });

  it('is undefined without a last report', () => {
    expect(getFrameRange({ lastReport: 0, nextReport: at(1) })).toBeUndefined();
  });
});
