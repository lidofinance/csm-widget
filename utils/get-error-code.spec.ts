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

  it('does NOT match INVALID_SIGNATURE inside INVALID_SIGNATURE_LENGTH (word boundary)', () => {
    const e = sdk(ERROR_CODE.EXECUTION_REVERTED, {
      cause: { reason: 'execution reverted: INVALID_SIGNATURE_LENGTH' },
    });
    // Longer token must NOT be misclassified as INVALID_SIGNATURE; it stays in
    // the generic revert bucket.
    expect(classifyErrorCode(e)).toBe(ErrorCode.EXECUTION_REVERTED);
  });

  it('falls back to SOMETHING_WRONG for a plain unknown error', () => {
    expect(classifyErrorCode({ foo: 'bar' })).toBe(ErrorCode.SOMETHING_WRONG);
  });
});

describe('classifyErrorCode (wallet-rejection path the SDK cannot classify)', () => {
  it('maps Safe-app -32000 + "User rejected transaction" to DENIED_SIG', () => {
    expect(
      classifyErrorCode({ code: -32000, message: 'User rejected transaction' }),
    ).toBe(ErrorCode.DENIED_SIG);
  });

  it('does NOT treat a bare -32000 (no rejection message) as DENIED_SIG', () => {
    expect(classifyErrorCode({ code: -32000, message: 'Internal error' })).toBe(
      ErrorCode.SOMETHING_WRONG,
    );
  });

  it('maps numeric code 4001 to DENIED_SIG', () => {
    expect(classifyErrorCode({ code: 4001 })).toBe(ErrorCode.DENIED_SIG);
  });

  it('maps numeric code 200001 to DENIED_SIG', () => {
    expect(classifyErrorCode({ code: 200001 })).toBe(ErrorCode.DENIED_SIG);
  });

  it('maps string code ACTION_REJECTED to DENIED_SIG', () => {
    expect(classifyErrorCode({ code: 'ACTION_REJECTED' })).toBe(
      ErrorCode.DENIED_SIG,
    );
  });

  it('maps a rejection message substring to DENIED_SIG', () => {
    expect(
      classifyErrorCode({
        message: 'MetaMask Tx Signature: User denied message signature.',
      }),
    ).toBe(ErrorCode.DENIED_SIG);
  });

  it('maps a Ledger-live data[0].message rejection to DENIED_SIG', () => {
    expect(
      classifyErrorCode({
        data: [{ message: 'Transaction rejected by the user' }],
      }),
    ).toBe(ErrorCode.DENIED_SIG);
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

// Helper to build a plain object shaped like SurveysApiError (no import needed).
const surveyError = (
  status: number,
  apiError?: { code?: string; message?: string },
) => ({
  name: 'SurveysApiError' as const,
  status,
  apiError: apiError ? { message: 'server msg', ...apiError } : undefined,
  get code() {
    return this.apiError?.code;
  },
});

describe('classifyErrorCode (SurveysApiError path)', () => {
  it('maps AUTH_JWT_EXPIRED to SESSION_EXPIRED', () => {
    expect(
      classifyErrorCode(surveyError(401, { code: 'AUTH_JWT_EXPIRED' })),
    ).toBe(ErrorCode.SESSION_EXPIRED);
  });

  it('maps AUTH_JWT_INVALID to SESSION_EXPIRED', () => {
    expect(
      classifyErrorCode(surveyError(401, { code: 'AUTH_JWT_INVALID' })),
    ).toBe(ErrorCode.SESSION_EXPIRED);
  });

  it('maps AUTH_JWT_MISSING to SESSION_EXPIRED', () => {
    expect(
      classifyErrorCode(surveyError(401, { code: 'AUTH_JWT_MISSING' })),
    ).toBe(ErrorCode.SESSION_EXPIRED);
  });

  it('maps 401 without code to SESSION_EXPIRED (status fallback)', () => {
    expect(classifyErrorCode(surveyError(401))).toBe(ErrorCode.SESSION_EXPIRED);
  });

  it('maps 403 without code to SESSION_EXPIRED (status fallback)', () => {
    expect(classifyErrorCode(surveyError(403))).toBe(ErrorCode.SESSION_EXPIRED);
  });

  it('maps 429 to TOO_MANY_REQUESTS', () => {
    expect(classifyErrorCode(surveyError(429))).toBe(
      ErrorCode.TOO_MANY_REQUESTS,
    );
  });

  it('maps 500 to SERVER_ERROR', () => {
    expect(classifyErrorCode(surveyError(500))).toBe(ErrorCode.SERVER_ERROR);
  });

  it('maps 503 to SERVER_ERROR', () => {
    expect(classifyErrorCode(surveyError(503))).toBe(ErrorCode.SERVER_ERROR);
  });

  it('maps domain 4xx with code to SOMETHING_WRONG', () => {
    expect(
      classifyErrorCode(
        surveyError(422, { code: 'MEMBERS_DUPLICATE_ADDRESS' }),
      ),
    ).toBe(ErrorCode.SOMETHING_WRONG);
  });

  it('maps a CODED 403 (authorization, not session) to SOMETHING_WRONG', () => {
    // OPERATOR_ACCESS_DENIED is an authorization failure that carries a domain
    // code — it must NOT become SESSION_EXPIRED; its domain copy shows instead.
    expect(
      classifyErrorCode(surveyError(403, { code: 'OPERATOR_ACCESS_DENIED' })),
    ).toBe(ErrorCode.SOMETHING_WRONG);
  });

  it('maps a CODED 401 (non-auth domain code) to SOMETHING_WRONG', () => {
    expect(
      classifyErrorCode(surveyError(401, { code: 'OPERATOR_NOT_DELEGATE' })),
    ).toBe(ErrorCode.SOMETHING_WRONG);
  });
});

describe('getErrorCode (public export smoke test)', () => {
  it('returns an ErrorCode for an unknown error', () => {
    expect(Object.values(ErrorCode)).toContain(getErrorCode({ foo: 'bar' }));
  });
});
