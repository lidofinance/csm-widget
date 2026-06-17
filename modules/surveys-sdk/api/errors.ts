import { FetcherError } from 'utils/fetcher-error';
import { type ApiError, parseApiError, getApiErrorCode } from './api-error';

export class SurveysApiError extends Error {
  readonly status: number;
  readonly url: string;
  readonly body?: unknown;
  readonly apiError?: ApiError;
  readonly cause?: unknown;

  constructor(opts: {
    message: string;
    status: number;
    url: string;
    body?: unknown;
    cause?: unknown;
  }) {
    super(opts.message);
    this.name = 'SurveysApiError';
    this.status = opts.status;
    this.url = opts.url;
    this.body = opts.body;
    this.apiError = parseApiError(opts.body);
    this.cause = opts.cause;
  }

  get code(): string | undefined {
    return this.apiError?.code;
  }

  get details() {
    return this.apiError?.details;
  }
}

// Three JWT auth outcomes the widget treats differently (see api guide):
//   'reauth'  → AUTH_JWT_EXPIRED: re-run signin and retry
//   'logout'  → AUTH_JWT_INVALID / AUTH_JWT_MISSING: clear token, no retry
//   undefined → not an auth error
export type AuthErrorKind = 'reauth' | 'logout';

export const authErrorKind = (err: unknown): AuthErrorKind | undefined => {
  const code = getApiErrorCode(
    err instanceof SurveysApiError ? err.apiError : err,
  );
  if (code === 'AUTH_JWT_EXPIRED') return 'reauth';
  if (code === 'AUTH_JWT_INVALID' || code === 'AUTH_JWT_MISSING')
    return 'logout';
  // Fallback for endpoints that 401/403 without a code (defensive: hard logout).
  if (
    err instanceof SurveysApiError &&
    (err.status === 401 || err.status === 403)
  )
    return 'logout';
  if (err instanceof FetcherError && (err.status === 401 || err.status === 403))
    return 'logout';
  return undefined;
};

export const isAuthError = (err: unknown): boolean =>
  authErrorKind(err) !== undefined;
