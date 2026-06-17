import type { ReactNode } from 'react';
import { getSurveyApiCopy } from 'consts/survey-api-copy';
import { getContractErrorCopy } from './contract-errors';
import { extractErrorMessage } from './extract-error-message';
import { ErrorCode, getErrorCode } from './get-error-code';

// Structural guard for SurveysApiError — avoids importing modules/surveys-sdk
// which transitively loads Next.js runtime config (breaks Jest unit tests).
type ApiErrorLike = {
  code: string;
  message: string;
  details?: { field?: string; message: string }[];
};

type SurveysApiErrorLike = {
  name: 'SurveysApiError';
  apiError?: ApiErrorLike;
};

const isSurveysApiError = (err: unknown): err is SurveysApiErrorLike =>
  typeof err === 'object' &&
  err !== null &&
  (err as Record<string, unknown>).name === 'SurveysApiError';

// Validation envelope → message + a bullet list of per-field messages.
const getApiDescription = (error: unknown): ReactNode | undefined => {
  if (!isSurveysApiError(error) || !error.apiError) return undefined;
  const { code, message, details } = error.apiError;
  const copy = getSurveyApiCopy(code, message);
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
//   - SurveysApiError → domain-code copy + optional per-field details list
//   - CONTRACT_ERROR  → friendly per-error copy (from decodedRevert.name)
//   - SOMETHING_WRONG → the raw extracted message (last resort)
export const getErrorDescription = (
  error: unknown,
  code: ErrorCode,
): ReactNode | undefined => {
  const api = getApiDescription(error);
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
