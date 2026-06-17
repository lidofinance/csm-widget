import type { ReactNode } from 'react';
import { getContractErrorCopy } from './contract-errors';
import { extractErrorMessage } from './extract-error-message';
import { ErrorCode, getErrorCode } from './get-error-code';

// Resolves the description shown in the failure stage for a given error/code.
// Returns `undefined` for codes already covered by the static ERROR_META map,
// letting the modal fall back to it. Returns concrete content only when more
// specific:
//   - CONTRACT_ERROR  → friendly per-error copy (from decodedRevert.name)
//   - SOMETHING_WRONG → the raw extracted message (last resort)
export const getErrorDescription = (
  error: unknown,
  code: ErrorCode,
): ReactNode | undefined => {
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
