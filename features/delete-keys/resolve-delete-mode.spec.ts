import { resolveDeleteMode } from './resolve-delete-mode';

describe('resolveDeleteMode', () => {
  it('keeps a valid available mode', () => {
    expect(resolveDeleteMode('exit', ['remove', 'exit'])).toBe('exit');
  });
  it('falls back to the first available mode for an unavailable one', () => {
    expect(resolveDeleteMode('eject', ['remove', 'exit'])).toBe('remove');
  });
  it('falls back for missing, unknown or array values', () => {
    expect(resolveDeleteMode(undefined, ['exit', 'eject'])).toBe('exit');
    expect(resolveDeleteMode('view', ['remove', 'exit'])).toBe('remove');
    expect(resolveDeleteMode(['exit'], ['remove', 'exit'])).toBe('remove');
  });
  it('returns undefined when nothing is available', () => {
    expect(resolveDeleteMode('exit', [])).toBeUndefined();
  });
});
