import { buildNavigateTarget } from './build-navigate-target';

const forwarded = { ref: '0xabc', theme: 'dark' };

describe('buildNavigateTarget', () => {
  it('attaches the query when the path is not corrected', () => {
    expect(
      buildNavigateTarget({
        path: '/keys/delete',
        corrected: '/keys/delete',
        forwarded,
        query: { mode: 'exit' },
      }),
    ).toEqual({
      pathname: '/keys/delete',
      query: { ref: '0xabc', theme: 'dark', mode: 'exit' },
    });
  });

  it('drops the query when the path is corrected elsewhere', () => {
    expect(
      buildNavigateTarget({
        path: '/keys/delete',
        corrected: '/create',
        forwarded,
        query: { mode: 'remove' },
      }),
    ).toEqual({ pathname: '/create', query: forwarded });
  });

  it('keeps forwarded params without a query', () => {
    expect(
      buildNavigateTarget({ path: '/keys', corrected: '/keys', forwarded }),
    ).toEqual({ pathname: '/keys', query: forwarded });
  });

  it('adds the hash only when given', () => {
    expect(
      buildNavigateTarget({
        path: '/keys',
        corrected: '/keys',
        forwarded: {},
        hash: 'faq',
      }).hash,
    ).toBe('faq');
    expect(
      buildNavigateTarget({ path: '/keys', corrected: '/keys', forwarded: {} }),
    ).not.toHaveProperty('hash');
  });

  it('passes a leading-hash value through unchanged', () => {
    expect(
      buildNavigateTarget({
        path: '/keys',
        corrected: '/keys',
        forwarded: {},
        hash: '#faq',
      }).hash,
    ).toBe('#faq');
  });
});
