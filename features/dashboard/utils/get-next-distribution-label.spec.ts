import { getNextDistributionLabel } from './get-next-distribution-label';

const sec = (d: Date) => Math.floor(d.getTime() / 1000);
const now = new Date(2026, 2, 10, 12);
const hours = (h: number) => new Date(now.getTime() + h * 3600 * 1000);
const label = (date: Date) =>
  getNextDistributionLabel({ nextReport: sec(date), now });

describe('getNextDistributionLabel', () => {
  it('reads Today for later the same day', () => {
    expect(label(hours(3))).toBe('Today');
  });

  it('reads singular for the next day', () => {
    expect(label(new Date(2026, 2, 11, 12))).toBe('In ~1 day');
  });

  it('reads plural for several days', () => {
    expect(label(new Date(2026, 2, 16, 12))).toBe('In ~6 days');
  });

  it('treats nextReport as unix seconds', () => {
    expect(label(new Date(2026, 2, 13, 12))).toBe('In ~3 days');
  });

  it('reads delayed when a full day late', () => {
    expect(label(hours(-25))).toBe('Distribution is delayed');
  });

  it('reads Today when under a full day late across midnight', () => {
    expect(label(hours(-13))).toBe('Today');
  });
});
