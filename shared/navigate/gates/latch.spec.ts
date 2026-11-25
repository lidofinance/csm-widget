import { resolveLatch } from './latch';

const A = '0x00000000000000000000000000000000000000aa';
const B = '0x00000000000000000000000000000000000000bb';

describe('resolveLatch', () => {
  it('shows and latches for the address when the rule passes', () => {
    expect(resolveLatch(undefined, true, A)).toEqual({
      show: true,
      latchedFor: A,
    });
  });

  it('hides without latching when the rule has not passed yet', () => {
    expect(resolveLatch(undefined, false, A)).toEqual({
      show: false,
      latchedFor: undefined,
    });
  });

  it('stays open after the rule flips false for the same address', () => {
    expect(resolveLatch(A, false, A)).toEqual({ show: true, latchedFor: A });
  });

  it('resets on a new address the rule fails for', () => {
    expect(resolveLatch(A, false, B)).toEqual({
      show: false,
      latchedFor: undefined,
    });
  });

  it('re-latches for a new address the rule passes for', () => {
    expect(resolveLatch(A, true, B)).toEqual({ show: true, latchedFor: B });
  });

  it('never latches without an address', () => {
    expect(resolveLatch(undefined, true, undefined)).toEqual({
      show: true,
      latchedFor: undefined,
    });
    expect(resolveLatch(A, false, undefined)).toEqual({
      show: false,
      latchedFor: undefined,
    });
  });

  it('is idempotent for the same inputs', () => {
    const first = resolveLatch(A, false, A);
    expect(resolveLatch(first.latchedFor, false, A)).toEqual(first);
  });
});
