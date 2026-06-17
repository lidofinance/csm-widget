import { findInErrorTree, extractReason } from './error-tree';

describe('findInErrorTree', () => {
  it('finds a node by predicate across cause/error nesting', () => {
    const err = {
      message: 'outer',
      cause: { error: { name: 'LockedDeviceError' } },
    };
    const hit = findInErrorTree(
      err,
      (e) => (e as { name?: string })?.name === 'LockedDeviceError',
    );
    expect((hit as { name?: string })?.name).toBe('LockedDeviceError');
  });

  it('returns undefined when nothing matches within depth', () => {
    const err = { cause: { cause: { cause: { cause: { name: 'x' } } } } };
    expect(
      findInErrorTree(err, (e) => (e as { name?: string })?.name === 'x'),
    ).toBeUndefined();
  });
});

describe('extractReason', () => {
  it('pulls a Lido require-string from a nested reason/message', () => {
    const err = { cause: { reason: 'execution reverted: STAKE_LIMIT' } };
    expect(extractReason(err)).toContain('STAKE_LIMIT');
  });

  it('returns empty string when no reason-like text exists', () => {
    expect(extractReason({ code: 4001 })).toBe('');
  });

  it('collects reason via .error link', () => {
    expect(extractReason({ error: { reason: 'STAKE_LIMIT' } })).toContain(
      'STAKE_LIMIT',
    );
  });
});
