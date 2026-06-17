import type { ReactNode } from 'react';
import { getSurveyApiCopy } from 'consts/survey-api-copy';
import { getContractErrorCopy } from './contract-errors';
import { extractErrorMessage } from './extract-error-message';
import { ErrorCode, getErrorCode } from './get-error-code';
import { isSurveysApiError } from './surveys-api-guard';

// Auth-family codes are handled by the static ERROR_META map (SESSION_EXPIRED
// bucket). getApiDescription must skip them so it doesn't override polished
// static copy with either a raw server message or a catalog string that is
// inconsistent with the 'Sign in again' action button.
const AUTH_FAMILY_CODES = new Set([
  'AUTH_JWT_EXPIRED',
  'AUTH_JWT_INVALID',
  'AUTH_JWT_MISSING',
]);

// Validation envelope → message + a bullet list of per-field messages.
// Returns undefined for auth-family errors (covered by static ERROR_META map).
const getApiDescription = (
  error: unknown,
  code: ErrorCode,
): ReactNode | undefined => {
  if (!isSurveysApiError(error) || !error.apiError) return undefined;
  // Let the static ERROR_META handle auth errors (SESSION_EXPIRED bucket).
  if (code === ErrorCode.SESSION_EXPIRED) return undefined;
  const { code: apiCode, message, details } = error.apiError;
  // Belt-and-suspenders: skip any auth code that happened to land outside
  // SESSION_EXPIRED (e.g. future reclassification).
  if (apiCode && AUTH_FAMILY_CODES.has(apiCode)) return undefined;
  const copy = getSurveyApiCopy(apiCode, message);
  if (!details?.length) return copy;
  return (
    <>
      <span>{copy}</span>
      <ul>
        {details.map((d, i) => (
          <li key={d.field ?? i}>{d.message}</li>
        ))}
      </ul>
    </>
  );
};

// Resolves the description shown in the failure stage for a given error/code.
// Returns `undefined` for codes already covered by the static ERROR_META map,
// letting the modal fall back to it. Returns concrete content only when more
// specific:
//   - SurveysApiError (non-auth) → domain-code copy + optional per-field details list
//   - CONTRACT_ERROR             → friendly per-error copy (from decodedRevert.name)
//   - SOMETHING_WRONG            → the raw extracted message (last resort)
// Auth-family codes (SESSION_EXPIRED) are always delegated to the static map.
export const getErrorDescription = (
  error: unknown,
  code: ErrorCode,
): ReactNode | undefined => {
  const api = getApiDescription(error, code);
  if (api) return api;
  if (code === ErrorCode.CONTRACT_ERROR) return getContractErrorCopy(error);
  if (code === ErrorCode.SOMETHING_WRONG) return extractErrorMessage(error);
  return undefined;
};

// Single entry point for the failure modal: classify once, describe in the same
// pass. `description` is undefined when the static map already covers the code.
export const resolveError = (
  error: unknown,
): { code: ErrorCode; description: ReactNode | undefined } => {
  const code = getErrorCode(error);
  return { code, description: getErrorDescription(error, code) };
};
