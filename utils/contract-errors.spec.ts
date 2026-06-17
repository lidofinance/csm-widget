import { SDKError } from '@lidofinance/lido-csm-sdk';
import { getContractErrorCopy, getDecodedRevert } from './contract-errors';

// track-matomo-event imports consts/matomo-click-events → config → next.js
// runtime which is unavailable in Jest. Stub the whole module.
jest.mock('./track-matomo-event', () => ({
  trackMatomoError: jest.fn(),
}));

describe('getDecodedRevert', () => {
  it('reads decodedRevert directly from an SDKError', () => {
    const e = new SDKError({
      code: undefined,
      message: 'BondLockNotExpired',
      decodedRevert: { name: 'BondLockNotExpired', args: [] } as any,
    });
    expect(getDecodedRevert(e)?.name).toBe('BondLockNotExpired');
  });
});

describe('getContractErrorCopy', () => {
  it('maps a known decoded name to friendly copy', () => {
    const e = new SDKError({
      message: 'BondLockNotExpired',
      decodedRevert: { name: 'BondLockNotExpired', args: [] } as any,
    });
    expect(getContractErrorCopy(e)).toMatch(/bond is still locked/i);
  });

  it('returns undefined for an unmapped (but valid) name', () => {
    const e = new SDKError({
      message: 'SomeOracleInternalError',
      decodedRevert: { name: 'SomeOracleInternalError', args: [] } as any,
    });
    expect(getContractErrorCopy(e)).toBeUndefined();
  });
});
