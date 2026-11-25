import { isInpageAnchor } from './is-inpage-anchor';

describe('isInpageAnchor', () => {
  it('is true for a same-route anchor', () => {
    expect(isInpageAnchor(true, '#a')).toBe(true);
  });

  it('is false for another route', () => {
    expect(isInpageAnchor(false, '#a')).toBe(false);
  });

  it('is false without an anchor', () => {
    expect(isInpageAnchor(true, undefined)).toBe(false);
  });

  it('is false with an explicit query', () => {
    expect(isInpageAnchor(true, '#a', { x: '1' })).toBe(false);
  });
});
