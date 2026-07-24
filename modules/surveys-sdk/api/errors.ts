import { type ApiError, parseApiError, getApiErrorCode } from './api-error';
import { type AuthErrorKind, resolveAuthErrorKind } from './auth-error-kind';

// Surface the shared auth vocabulary type through the barrel. The single source
// of truth is ./auth-error-kind (a dependency-free leaf shared with modules/siwe
// and utils/get-error-code.ts, both of which import its functions directly).
export type { AuthErrorKind } from './auth-error-kind';

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

// Classify a full error object to an auth recovery kind. Reads the envelope
// code first, falling back to the HTTP status only for codeless 401/403 — the
// exact code-first policy encoded in resolveAuthErrorKind.
export const authErrorKind = (err: unknown): AuthErrorKind | undefined => {
  const code = getApiErrorCode(
    err instanceof SurveysApiError ? err.apiError : err,
  );
  const status = err instanceof SurveysApiError ? err.status : undefined;
  return resolveAuthErrorKind(code, status);
};

export const isAuthError = (err: unknown): boolean =>
  authErrorKind(err) !== undefined;

// Classify a thrown survey error and fire the auth-recovery callback; the caller
// rethrows the original error afterward. Reproduces the retired transport's
// guard (surveys-api.ts `surveysRequest`): dispatch ONLY when a token was
// actually sent. A token-less request that 401s — or a domain 401/403 carrying a
// non-JWT code — must never wipe a valid session. The hooks (useSurveyQuery,
// useSurveyMutation, useOperatorSurvey) share this single implementation.
export const dispatchAuthError = (
  error: unknown,
  token: string | undefined,
  handleAuthError: (kind: AuthErrorKind) => void,
): void => {
  if (!token) return;
  const kind = authErrorKind(error);
  if (kind) handleAuthError(kind);
};
