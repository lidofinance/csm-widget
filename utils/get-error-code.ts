import { SDKError, ERROR_CODE, classifyError } from '@lidofinance/lido-csm-sdk';
import { resolveAuthErrorKind } from 'modules/surveys-sdk/api/auth-error-kind';
import {
  getDecodedRevert,
  trackUnmappedContractError,
} from './contract-errors';
import { extractErrorMessage } from './extract-error-message';
import {
  extractReason,
  extractDataMessage,
  findInErrorTree,
} from './error-tree';
import { FetcherError } from './fetcher-error';
import { isSurveysApiError } from './surveys-api-guard';
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
  WALLET_TIMEOUT = 'WALLET_TIMEOUT',
  WALLET_UNAUTHORIZED = 'WALLET_UNAUTHORIZED',
  // Wallet-capability faults (SDK METHOD_NOT_SUPPORTED + BATCH_NOT_ATOMIC): the
  // wallet cannot perform the requested op — one shared bucket, retry pointless.
  WALLET_UNSUPPORTED = 'WALLET_UNSUPPORTED',
  BUNDLE_NOT_FOUND = 'BUNDLE_NOT_FOUND',
  NETWORK_ERROR = 'NETWORK_ERROR',
  CHAIN_MISMATCH = 'CHAIN_MISMATCH',
  // Tx-parameter faults the user can fix in their wallet.
  NONCE_ERROR = 'NONCE_ERROR',
  FEE_ERROR = 'FEE_ERROR',
  GAS_ERROR = 'GAS_ERROR',
  CONTRACT_ERROR = 'CONTRACT_ERROR',
  EXECUTION_REVERTED = 'EXECUTION_REVERTED',
  TRANSACTION_REVERTED = 'TRANSACTION_REVERTED',
  DECODE_RESULT_ERROR = 'DECODE_RESULT_ERROR',
  // Smart-account (EIP-4337/5792) validation + paymaster faults (SDK
  // AA_VALIDATION_ERROR + AA_PAYMASTER_ERROR) — one shared bucket.
  SMART_ACCOUNT_ERROR = 'SMART_ACCOUNT_ERROR',
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
  [ERROR_CODE.WALLET_TIMEOUT]: ErrorCode.WALLET_TIMEOUT,
  // Genuine wallet rate-limiting now has its own SDK code — it, not WALLET_RPC,
  // is the real "Too many requests" case, so it reuses the API rate-limit copy.
  [ERROR_CODE.RATE_LIMITED]: ErrorCode.TOO_MANY_REQUESTS,
  [ERROR_CODE.WALLET_UNAUTHORIZED]: ErrorCode.WALLET_UNAUTHORIZED,
  [ERROR_CODE.METHOD_NOT_SUPPORTED]: ErrorCode.WALLET_UNSUPPORTED,
  [ERROR_CODE.BATCH_NOT_ATOMIC]: ErrorCode.WALLET_UNSUPPORTED,
  [ERROR_CODE.BUNDLE_NOT_FOUND]: ErrorCode.BUNDLE_NOT_FOUND,
  // A duplicate bundle id means the batch is already in flight — same
  // non-retryable "check your wallet" outcome as a missing bundle.
  [ERROR_CODE.DUPLICATE_BUNDLE_ID]: ErrorCode.BUNDLE_NOT_FOUND,
  [ERROR_CODE.NETWORK_ERROR]: ErrorCode.NETWORK_ERROR,
  [ERROR_CODE.CHAIN_MISMATCH]: ErrorCode.CHAIN_MISMATCH,
  [ERROR_CODE.NONCE_ERROR]: ErrorCode.NONCE_ERROR,
  [ERROR_CODE.FEE_ERROR]: ErrorCode.FEE_ERROR,
  [ERROR_CODE.GAS_ERROR]: ErrorCode.GAS_ERROR,
  [ERROR_CODE.CONTRACT_REVERT]: ErrorCode.CONTRACT_ERROR,
  [ERROR_CODE.EXECUTION_REVERTED]: ErrorCode.EXECUTION_REVERTED,
  [ERROR_CODE.TRANSACTION_REVERTED]: ErrorCode.TRANSACTION_REVERTED,
  [ERROR_CODE.DECODE_RESULT_ERROR]: ErrorCode.DECODE_RESULT_ERROR,
  [ERROR_CODE.AA_VALIDATION_ERROR]: ErrorCode.SMART_ACCOUNT_ERROR,
  [ERROR_CODE.AA_PAYMASTER_ERROR]: ErrorCode.SMART_ACCOUNT_ERROR,
};

// Codes whose revert may actually be a Lido `require`-string (no ABI selector),
// where a reason peek yields more specific copy than the generic bucket.
const REASON_REFINABLE = new Set<ErrorCode>([
  ErrorCode.CONTRACT_ERROR,
  ErrorCode.EXECUTION_REVERTED,
  ErrorCode.TRANSACTION_REVERTED,
]);

// These three Lido `require`-strings carry NO ABI selector, so they never reach
// `decodedRevert` and can only be recovered by reading the revert text — that
// is why string-matching is justified here (unlike custom errors, which are
// typed via decodedRevert.name). Matched on WORD BOUNDARIES so a longer token
// (e.g. INVALID_SIGNATURE_LENGTH) is NOT mistaken for INVALID_SIGNATURE — `_`
// is a word char, so `\bINVALID_SIGNATURE\b` will not match inside it.
const REASON_RULES: { match: string; code: ErrorCode }[] = [
  { match: 'STAKE_LIMIT', code: ErrorCode.LIMIT_REACHED },
  { match: 'INVALID_SIGNATURE', code: ErrorCode.INVALID_SIGNATURE },
  { match: 'BALANCE_EXCEEDED', code: ErrorCode.BALANCE_EXCEEDED },
];

const matchReason = (error: unknown): ErrorCode | undefined => {
  const reason = extractReason(error);
  return REASON_RULES.find((rule) =>
    new RegExp(`\\b${rule.match}\\b`).test(reason),
  )?.code;
};

// Plain-object wallet rejections the SDK can't classify. The SDK only inspects
// `viem.BaseError` instances (USER_REJECTED via `instanceof
// UserRejectedRequestError`); Safe-app, generic injected, and Ledger-live
// rejections reach us as plain objects and would otherwise fall to
// SOMETHING_WRONG and log as noise. Widget-owned, runs early. Deliberately
// CONSERVATIVE: only rejection-specific signals match, so a genuine revert is
// never misread as a user rejection.
const detectUserRejection = (error: unknown): boolean => {
  // numeric/string rejection codes anywhere in the tree:
  //   4001 / 200001 (EIP-1193 + injected variants), 'ACTION_REJECTED' (ethers)
  const byCode = findInErrorTree(error, (node) => {
    const code = (node as Record<string, unknown>)?.code;
    if (code === 4001 || code === 200001) return true;
    if (typeof code === 'string' && code.toUpperCase() === 'ACTION_REJECTED')
      return true;
    // Safe-app: code -32000 ONLY when the message confirms a user rejection
    // (-32000 alone is a generic RPC error, not a rejection).
    return (
      code === -32000 &&
      (node as Record<string, unknown>)?.message === 'User rejected transaction'
    );
  });
  if (byCode) return true;

  // message substrings (lowercased) — wallet-specific rejection phrasings.
  const REJECTION_PHRASES = [
    'denied message signature',
    'transaction was rejected',
    'rejected the transaction',
    'rejected the request',
    'reject this request',
    'rejected methods',
    'transaction declined',
  ];
  const byMessage = findInErrorTree(error, (node) => {
    const message = (node as Record<string, unknown>)?.message;
    if (typeof message !== 'string') return false;
    const lower = message.toLowerCase();
    return REJECTION_PHRASES.some((phrase) => lower.includes(phrase));
  });
  if (byMessage) return true;

  // Ledger-live: rejection hidden in error.data[0].message.
  const dataMessage = extractDataMessage(error);
  return !!dataMessage && dataMessage.toLowerCase().includes('rejected');
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

// API/session classification. Branches on the typed envelope code (SurveysApiError)
// before falling back to HTTP status (FetcherError).
const classifyApiError = (error: unknown): ErrorCode | undefined => {
  if (isSurveysApiError(error)) {
    // Code-first auth resolution (shared with siwe/surveys-sdk): a CODELESS
    // 401/403 is a session failure; a coded domain 401/403 (e.g.
    // OPERATOR_ACCESS_DENIED) is NOT — it falls through to its domain copy.
    const kind = resolveAuthErrorKind(
      error.apiError?.code ?? error.code,
      error.status,
    );
    if (kind) return ErrorCode.SESSION_EXPIRED;
    if (error.status === 429) return ErrorCode.TOO_MANY_REQUESTS;
    if (error.status >= 500) return ErrorCode.SERVER_ERROR;
    // Domain 4xx with a code → generic bucket; copy comes from the catalog in
    // get-error-description. Use SOMETHING_WRONG so the static ERROR_META
    // message is overridden by the resolved domain copy.
    if (error.code) return ErrorCode.SOMETHING_WRONG;
  }
  if (error instanceof FetcherError) {
    if (error.status === 401 || error.status === 403)
      return ErrorCode.SESSION_EXPIRED;
    if (error.status === 429) return ErrorCode.TOO_MANY_REQUESTS;
    if (error.status >= 500) return ErrorCode.SERVER_ERROR;
  }
  return undefined; // other 4xx: handled by domain copy / fallback
};

// Pure classification — no logging. Order: vendor (Ledger) → wallet rejection
// (widget-owned) → API → SDK typed → reason special-case → fallback. The vendor
// and wallet-rejection stages run BEFORE the SDK because the SDK cannot
// classify these plain-object shapes. `decoded` may be passed pre-computed so
// the abi decode runs only once per error (see resolveError).
export const classifyErrorCode = (
  error: unknown,
  decoded = getDecodedRevert(error),
): ErrorCode => {
  const vendor = detectVendor(error);
  if (vendor) return vendor;

  if (detectUserRejection(error)) return ErrorCode.DENIED_SIG;

  const api = classifyApiError(error);
  if (api) return api;

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
  ErrorCode.WALLET_TIMEOUT, // transient + retryable — debug, not error noise
]);

export const getErrorCode = (
  error: unknown,
  decoded = getDecodedRevert(error),
): ErrorCode => {
  const code = classifyErrorCode(error, decoded);

  // Serialize defensively: viem errors carry BigInt, which JSON.stringify
  // throws on. The original `error` object must ALWAYS reach the log regardless
  // of whether the string form could be produced — the throw must not drop it.
  let errorString: string | undefined;
  try {
    errorString = JSON.stringify(error);
  } catch {
    errorString = undefined;
  }
  const log = BENIGN_LOG_CODES.has(code) ? console.debug : console.error;
  log('TX_ERROR:', { code, error, error_string: errorString });

  trackMatomoError(`${extractErrorMessage(error)}`, code);
  trackUnmappedContractError(error, decoded);
  return code;
};
