import { QueryClient } from '@tanstack/react-query';
import { getImpliedVersionSupport, getSmVersionKey } from './sm-version-query';

const ALL = ['csm', 'csm_02', 'cm'];

describe('getSmVersionKey', () => {
  it('keeps the sm-version key shape', () => {
    expect(getSmVersionKey(['csm'])).toEqual([
      'sm-version',
      { modules: ['csm'] },
    ]);
  });
});

describe('getImpliedVersionSupport', () => {
  it('implies support when every module is supported', () => {
    const queryClient = new QueryClient();
    queryClient.setQueryData(getSmVersionKey(ALL), true);
    expect(getImpliedVersionSupport(queryClient, ALL)).toBe(true);
  });

  it('implies nothing when some module is unsupported', () => {
    const queryClient = new QueryClient();
    queryClient.setQueryData(getSmVersionKey(ALL), false);
    expect(getImpliedVersionSupport(queryClient, ALL)).toBeUndefined();
  });

  it('implies nothing before the all-modules check has loaded', () => {
    expect(getImpliedVersionSupport(new QueryClient(), ALL)).toBeUndefined();
  });
});
