import { appendQuery, joinUrl, operatorKey, parseOperatorKey } from '../url';

// Inline MODULE_NAME values to avoid pulling the full csm-sdk into the jest
// environment (which transitively resolves lido-ethereum-sdk ipfs deps).
// Keep these in sync with `@lidofinance/lido-csm-sdk`'s MODULE_NAME enum.
const CSM = 'CSM' as never;
const CM = 'CM' as never;

describe('operatorKey', () => {
  it('produces lowercase prefix with bigint', () => {
    expect(operatorKey(CSM, 42n)).toBe('csm-42');
  });

  it('produces lowercase prefix with bigint 0', () => {
    expect(operatorKey(CSM, 0n)).toBe('csm-0');
  });

  it('returns undefined when id is undefined', () => {
    expect(operatorKey(CSM, undefined)).toBeUndefined();
  });

  it('handles future cm prefix', () => {
    expect(operatorKey(CM, 5n)).toBe('cm-5');
  });
});

describe('parseOperatorKey', () => {
  it('accepts well-formed csm key', () => {
    expect(parseOperatorKey('csm-42')).toBe('csm-42');
  });

  it('accepts well-formed cm key', () => {
    expect(parseOperatorKey('cm-7')).toBe('cm-7');
  });

  it('rejects uppercase prefix', () => {
    expect(parseOperatorKey('CSM-42')).toBeNull();
  });

  it('rejects missing id', () => {
    expect(parseOperatorKey('csm-')).toBeNull();
  });

  it('rejects unknown module', () => {
    expect(parseOperatorKey('xyz-1')).toBeNull();
  });
});

describe('joinUrl', () => {
  it('joins base and path with single slash', () => {
    expect(joinUrl('https://api.example.com', 'foo')).toBe(
      'https://api.example.com/foo',
    );
  });

  it('strips trailing slash from base', () => {
    expect(joinUrl('https://api.example.com/', 'foo')).toBe(
      'https://api.example.com/foo',
    );
  });

  it('strips leading slash from path', () => {
    expect(joinUrl('https://api.example.com', '/foo')).toBe(
      'https://api.example.com/foo',
    );
  });

  it('strips both leading and trailing slashes', () => {
    expect(joinUrl('https://api.example.com/', '/foo/bar')).toBe(
      'https://api.example.com/foo/bar',
    );
  });
});

describe('appendQuery', () => {
  it('returns url unchanged when no query', () => {
    expect(appendQuery('https://x.test/a')).toBe('https://x.test/a');
  });

  it('appends single param', () => {
    expect(appendQuery('https://x.test/a', { k: 'v' })).toBe(
      'https://x.test/a?k=v',
    );
  });

  it('skips undefined values', () => {
    expect(appendQuery('https://x.test/a', { a: '1', b: undefined })).toBe(
      'https://x.test/a?a=1',
    );
  });
});
