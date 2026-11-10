import { formatSentOn } from './format-sent-on';

describe('formatSentOn', () => {
  it('formats as Sent on MMM d, yyyy', () => {
    expect(formatSentOn(new Date(2026, 6, 19))).toBe('Sent on Jul 19, 2026');
  });

  it('does not pad the day', () => {
    expect(formatSentOn(new Date(2026, 0, 5))).toBe('Sent on Jan 5, 2026');
  });
});
