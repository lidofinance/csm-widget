import { SDKError, ERROR_CODE, classifyError } from '@lidofinance/lido-csm-sdk';
import {
  getDecodedRevert,
  trackUnmappedContractError,
} from './contract-errors';
import { extractErrorMessage } from './extract-error-message';
import { extractReason, findInErrorTree } from './error-tree';
import { FetcherError } from './fetcher-error';
import { trackMatomoError } from './track-matomo-event';

// Widget UX taxonomy: what affordance/copy to show. Derived from the SDK's
// classification (ERROR_CODE) — NOT a duplicate of it. Includes widget-only
// buckets for API/session (Phase 2) and vendor (Ledger) conditions the SDK
// deliberately does not classify.
export enum ErrorCode {
  // Wallet / tx (mapped from SDK ERROR_CODE)
  DENIED_SIG = 'DENIED_SIG',
  NOT_ENOUGH_ETHER = 'NOT_ENOUGH_ETHER',
  WALLET_RPC = 'WALLET_RPC',
  BUNDLE_NOT_FOUND = 'BUNDLE_NOT_FOUND',
  NETWORK_ERROR = 'NETWORK_ERROR',
  CHAIN_MISMATCH = 'CHAIN_MISMATCH',
  CONTRACT_ERROR = 'CONTRACT_ERROR',
  EXECUTION_REVERTED = 'EXECUTION_REVERTED',
  TRANSACTION_REVERTED = 'TRANSACTION_REVERTED',
  DECODE_RESULT_ERROR = 'DECODE_RESULT_ERROR',
  // Lido require-string reverts (no ABI selector)
  LIMIT_REACHED = 'LIMIT_REACHED',
  INVALID_SIGNATURE = 'INVALID_SIGNATURE',
  BALANCE_EXCEEDED = 'BALANCE_EXCEEDED',
  // Vendor (Ledger) — widget-owned
  DEVICE_LOCKED = 'DEVICE_LOCKED',
  ENABLE_BLIND_SIGNING = 'ENABLE_BLIND_SIGNING',
  // API / session (Phase 2 expands callers; codes defined here for ERROR_META)
  SESSION_EXPIRED = 'SESSION_EXPIRED',
  TOO_MANY_REQUESTS = 'TOO_MANY_REQUESTS',
  SERVER_ERROR = 'SERVER_ERROR',
  // Fallback
  SOMETHING_WRONG = 'SOMETHING_WRONG',
}

// SDK classification → widget UX bucket. ERROR_CODE values not listed
// (INVALID_ARGUMENT, NOT_SUPPORTED, PROVIDER_ERROR, READ_ERROR,
// TRANSACTION_ERROR, UNKNOWN_ERROR) intentionally fall through to
// SOMETHING_WRONG.
const SDK_TO_WIDGET: Partial<Record<ERROR_CODE, ErrorCode>> = {
  [ERROR_CODE.USER_REJECTED]: ErrorCode.DENIED_SIG,
  [ERROR_CODE.INSUFFICIENT_FUNDS]: ErrorCode.NOT_ENOUGH_ETHER,
  [ERROR_CODE.WALLET_RPC_ERROR]: ErrorCode.WALLET_RPC,
  [ERROR_CODE.BUNDLE_NOT_FOUND]: ErrorCode.BUNDLE_NOT_FOUND,
  [ERROR_CODE.NETWORK_ERROR]: ErrorCode.NETWORK_ERROR,
  [ERROR_CODE.CHAIN_MISMATCH]: ErrorCode.CHAIN_MISMATCH,
  [ERROR_CODE.CONTRACT_REVERT]: ErrorCode.CONTRACT_ERROR,
  [ERROR_CODE.EXECUTION_REVERTED]: ErrorCode.EXECUTION_REVERTED,
  [ERROR_CODE.TRANSACTION_REVERTED]: ErrorCode.TRANSACTION_REVERTED,
  [ERROR_CODE.DECODE_RESULT_ERROR]: ErrorCode.DECODE_RESULT_ERROR,
};

// Codes whose revert may actually be a Lido `require`-string (no ABI selector),
// where a reason peek yields more specific copy than the generic bucket.
const REASON_REFINABLE = new Set<ErrorCode>([
  ErrorCode.CONTRACT_ERROR,
  ErrorCode.EXECUTION_REVERTED,
  ErrorCode.TRANSACTION_REVERTED,
]);

const REASON_RULES: { match: string; code: ErrorCode }[] = [
  { match: 'STAKE_LIMIT', code: ErrorCode.LIMIT_REACHED },
  { match: 'INVALID_SIGNATURE', code: ErrorCode.INVALID_SIGNATURE },
  { match: 'BALANCE_EXCEEDED', code: ErrorCode.BALANCE_EXCEEDED },
];

const matchReason = (error: unknown): ErrorCode | undefined => {
  const reason = extractReason(error);
  return REASON_RULES.find((rule) => reason.includes(rule.match))?.code;
};

// Ledger quirks the SDK does not classify. Version-coupled, so detection lives
// in the widget. Runs BEFORE SDK classification — vendor copy wins.
const detectVendor = (error: unknown): ErrorCode | undefined => {
  const hit = findInErrorTree(
    error,
    (e) =>
      (e as Record<string, unknown>)?.name === 'LockedDeviceError' ||
      (e as Record<string, unknown>)?.name === 'EthAppPleaseEnableContractData',
  ) as { name?: string } | undefined;
  if (!hit) return undefined;
  return hit.name === 'LockedDeviceError'
    ? ErrorCode.DEVICE_LOCKED
    : ErrorCode.ENABLE_BLIND_SIGNING;
};

// API/session classification. Phase 2 replaces this body with envelope-`code`
// branching; for now it keys off HTTP status carried by FetcherError.
const classifyApiError = (error: unknown): ErrorCode | undefined => {
  if (!(error instanceof FetcherError)) return undefined;
  if (error.status === 401 || error.status === 403)
    return ErrorCode.SESSION_EXPIRED;
  if (error.status === 429) return ErrorCode.TOO_MANY_REQUESTS;
  if (error.status >= 500) return ErrorCode.SERVER_ERROR;
  return undefined; // other 4xx: handled by domain copy / fallback
};

// Pure classification — no logging. Order: vendor (Ledger) → API → SDK typed →
// reason special-case → fallback.
export const classifyErrorCode = (error: unknown): ErrorCode => {
  const vendor = detectVendor(error);
  if (vendor) return vendor;

  const api = classifyApiError(error);
  if (api) return api;

  const decoded = getDecodedRevert(error);
  // When decodedRevert is present, classifyError returns CONTRACT_REVERT
  // unconditionally — prefer that over error.code which may be UNKNOWN_ERROR
  // (set by SDKError constructor when no explicit code is provided).
  const sdkCode = decoded
    ? classifyError(error, decoded)
    : error instanceof SDKError
      ? error.code
      : classifyError(error, undefined);

  if (sdkCode) {
    const widget = SDK_TO_WIDGET[sdkCode];
    if (widget && REASON_REFINABLE.has(widget)) {
      const refined = matchReason(error);
      if (refined) return refined;
    }
    if (widget) return widget;
  }

  return ErrorCode.SOMETHING_WRONG;
};

// Benign, user-driven or transient outcomes — logged at debug to keep error
// monitoring focused on genuine faults.
const BENIGN_LOG_CODES = new Set<ErrorCode>([
  ErrorCode.DENIED_SIG,
  ErrorCode.SESSION_EXPIRED,
  ErrorCode.TOO_MANY_REQUESTS,
  ErrorCode.NETWORK_ERROR,
]);

export const getErrorCode = (error: unknown): ErrorCode => {
  const code = classifyErrorCode(error);

  const log = BENIGN_LOG_CODES.has(code) ? console.debug : console.error;
  try {
    log('TX_ERROR:', { code, error, error_string: JSON.stringify(error) });
  } catch (e) {
    log('TX_ERROR:', code, e);
  }

  trackMatomoError(`${extractErrorMessage(error)}`, code);
  trackUnmappedContractError(error);
  return code;
};
