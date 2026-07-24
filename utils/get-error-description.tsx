import type { ReactNode } from 'react';
import type { DecodedRevert } from '@lidofinance/lido-csm-sdk';
import { getSurveyApiCopy } from 'consts/survey-api-copy';
import { getContractErrorCopy, getDecodedRevert } from './contract-errors';
import { extractErrorMessage } from './extract-error-message';
import { ErrorCode, getErrorCode } from './get-error-code';
import { isSurveysApiError } from './surveys-api-guard';

// Validation envelope → message + a bullet list of per-field messages.
// Returns undefined for auth-family errors (covered by static ERROR_META map).
const getApiDescription = (
  error: unknown,
  code: ErrorCode,
): ReactNode | undefined => {
  if (!isSurveysApiError(error) || !error.apiError) return undefined;
  // Let the static ERROR_META handle auth errors (SESSION_EXPIRED bucket). Every
  // auth code classifies to SESSION_EXPIRED, so this single guard covers them.
  if (code === ErrorCode.SESSION_EXPIRED) return undefined;
  const { code: apiCode, message, details } = error.apiError;
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
  decoded?: DecodedRevert,
): ReactNode | undefined => {
  const api = getApiDescription(error, code);
  if (api) return api;
  if (code === ErrorCode.CONTRACT_ERROR)
    return getContractErrorCopy(error, decoded);
  if (code === ErrorCode.SOMETHING_WRONG) return extractErrorMessage(error);
  return undefined;
};

// Single entry point for the failure modal: classify once, describe in the same
// pass. The revert is decoded ONCE here and threaded into both halves so the
// abi decode never runs more than once per error. `description` is undefined
// when the static map already covers the code.
export const resolveError = (
  error: unknown,
): { code: ErrorCode; description: ReactNode | undefined } => {
  const decoded = getDecodedRevert(error);
  const code = getErrorCode(error, decoded);
  return { code, description: getErrorDescription(error, code, decoded) };
};
