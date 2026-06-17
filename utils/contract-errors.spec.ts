import { SDKError } from '@lidofinance/lido-csm-sdk';
import {
  getContractErrorCopy,
  getDecodedRevert,
  trackUnmappedContractError,
} from './contract-errors';
import { trackMatomoError } from './track-matomo-event';

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

  it('returns undefined for a non-SDKError value (fallback path)', () => {
    expect(getDecodedRevert(null)).toBeUndefined();
    expect(getDecodedRevert(undefined)).toBeUndefined();
    expect(getDecodedRevert(new Error('plain'))).toBeUndefined();
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

describe('trackUnmappedContractError', () => {
  beforeEach(() => {
    (trackMatomoError as jest.Mock).mockClear();
  });

  it('fires telemetry when the decoded name has no friendly copy', () => {
    const e = new SDKError({
      message: 'SomeOracleInternalError',
      decodedRevert: { name: 'SomeOracleInternalError', args: [] } as any,
    });
    trackUnmappedContractError(e);
    expect(trackMatomoError).toHaveBeenCalledWith(
      'SomeOracleInternalError',
      'UNMAPPED_CONTRACT_ERROR',
    );
  });

  it('does NOT fire telemetry for a mapped name', () => {
    const e = new SDKError({
      message: 'BondLockNotExpired',
      decodedRevert: { name: 'BondLockNotExpired', args: [] } as any,
    });
    trackUnmappedContractError(e);
    expect(trackMatomoError).not.toHaveBeenCalled();
  });
});
