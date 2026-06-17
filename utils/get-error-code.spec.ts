// utils/get-error-code.spec.ts
// track-matomo-event imports consts/matomo-click-events → config → next.js
// runtime which is unavailable in Jest. Stub the whole module.
jest.mock('./track-matomo-event', () => ({
  trackMatomoError: jest.fn(),
}));

import { SDKError, ERROR_CODE } from '@lidofinance/lido-csm-sdk';
import { ErrorCode, classifyErrorCode, getErrorCode } from './get-error-code';
import { FetcherError } from './fetcher-error';

const sdk = (code: ERROR_CODE, extra: Record<string, unknown> = {}) =>
  Object.assign(new SDKError({ code, message: 'x' }), extra);

describe('classifyErrorCode (SDK typed path)', () => {
  it.each([
    [ERROR_CODE.USER_REJECTED, ErrorCode.DENIED_SIG],
    [ERROR_CODE.INSUFFICIENT_FUNDS, ErrorCode.NOT_ENOUGH_ETHER],
    [ERROR_CODE.WALLET_RPC_ERROR, ErrorCode.WALLET_RPC],
    [ERROR_CODE.BUNDLE_NOT_FOUND, ErrorCode.BUNDLE_NOT_FOUND],
    [ERROR_CODE.NETWORK_ERROR, ErrorCode.NETWORK_ERROR],
    [ERROR_CODE.CHAIN_MISMATCH, ErrorCode.CHAIN_MISMATCH],
    [ERROR_CODE.CONTRACT_REVERT, ErrorCode.CONTRACT_ERROR],
    [ERROR_CODE.EXECUTION_REVERTED, ErrorCode.EXECUTION_REVERTED],
    [ERROR_CODE.TRANSACTION_REVERTED, ErrorCode.TRANSACTION_REVERTED],
    [ERROR_CODE.DECODE_RESULT_ERROR, ErrorCode.DECODE_RESULT_ERROR],
    [ERROR_CODE.UNKNOWN_ERROR, ErrorCode.SOMETHING_WRONG],
    [ERROR_CODE.READ_ERROR, ErrorCode.SOMETHING_WRONG],
  ])('maps SDK %s to widget %s', (sdkCode, widgetCode) => {
    expect(classifyErrorCode(sdk(sdkCode))).toBe(widgetCode);
  });

  it('prefers Ledger vendor detection over the SDK code', () => {
    const e = sdk(ERROR_CODE.WALLET_RPC_ERROR, {
      cause: { name: 'LockedDeviceError' },
    });
    expect(classifyErrorCode(e)).toBe(ErrorCode.DEVICE_LOCKED);
  });

  it('recovers a Lido require-string revert (STAKE_LIMIT) as LIMIT_REACHED', () => {
    const e = sdk(ERROR_CODE.EXECUTION_REVERTED, {
      cause: { reason: 'execution reverted: STAKE_LIMIT' },
    });
    expect(classifyErrorCode(e)).toBe(ErrorCode.LIMIT_REACHED);
  });

  it('falls back to SOMETHING_WRONG for a plain unknown error', () => {
    expect(classifyErrorCode({ foo: 'bar' })).toBe(ErrorCode.SOMETHING_WRONG);
  });
});

describe('classifyErrorCode (API path)', () => {
  it('maps 401 to SESSION_EXPIRED', () => {
    expect(classifyErrorCode(new FetcherError('nope', 401))).toBe(
      ErrorCode.SESSION_EXPIRED,
    );
  });

  it('maps 403 to SESSION_EXPIRED', () => {
    expect(classifyErrorCode(new FetcherError('nope', 403))).toBe(
      ErrorCode.SESSION_EXPIRED,
    );
  });

  it('maps 429 to TOO_MANY_REQUESTS', () => {
    expect(classifyErrorCode(new FetcherError('x', 429))).toBe(
      ErrorCode.TOO_MANY_REQUESTS,
    );
  });

  it('maps 5xx to SERVER_ERROR', () => {
    expect(classifyErrorCode(new FetcherError('x', 503))).toBe(
      ErrorCode.SERVER_ERROR,
    );
  });
});

describe('getErrorCode (public export smoke test)', () => {
  it('returns an ErrorCode for an unknown error', () => {
    expect(Object.values(ErrorCode)).toContain(getErrorCode({ foo: 'bar' }));
  });
});
