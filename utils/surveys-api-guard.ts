// Structural guard for SurveysApiError — avoids importing modules/surveys-sdk
// which transitively loads Next.js runtime config (breaks Jest unit tests).
// We check by name and read the typed fields structurally.
//
// Keep in sync with modules/surveys-sdk/api/errors.ts SurveysApiError.
// The shape matched here intentionally omits `url` / `body` (unstable) and only
// exposes the fields used by the error-classification and description utilities.

export type ApiErrorDetailLike = {
  field?: string;
  message: string;
};

export type ApiErrorLike = {
  code?: string;
  message: string;
  details?: ApiErrorDetailLike[];
};

export type SurveysApiErrorLike = {
  name: 'SurveysApiError';
  status: number;
  // top-level code accessor (mirrors SurveysApiError.code getter)
  code?: string;
  apiError?: ApiErrorLike;
};

export const isSurveysApiError = (err: unknown): err is SurveysApiErrorLike =>
  typeof err === 'object' &&
  err !== null &&
  (err as Record<string, unknown>).name === 'SurveysApiError';
