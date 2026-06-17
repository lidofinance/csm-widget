import type { FieldValues, Path, UseFormSetError } from 'react-hook-form';
import { isSurveysApiError } from 'utils/surveys-api-guard';

// Map a VALIDATION_FAILED envelope onto react-hook-form inputs. `details[].field`
// uses dotted/bracketed DTO paths that match the form field names 1:1.
//
// Applies setError for every detail that HAS a field, then returns true to
// suppress the generic modal ONLY when EVERY detail has a field — i.e. every
// message landed on an input. If any detail lacks a field (a general message),
// returns false so the failure modal still shows: it renders ALL details as a
// bullet list, so the fieldless messages are not lost.
//
// Uses the structural guard (not `instanceof SurveysApiError`) to avoid
// importing modules/surveys-sdk, which transitively loads Next.js runtime
// config and breaks Jest unit tests.
export const applyApiFieldErrors = <T extends FieldValues>(
  error: unknown,
  setError: UseFormSetError<T>,
): boolean => {
  const api = isSurveysApiError(error) ? error.apiError : undefined;
  if (!api || api.code !== 'VALIDATION_FAILED' || !api.details?.length)
    return false;
  let everyHasField = true;
  for (const detail of api.details) {
    if (!detail.field) {
      everyHasField = false;
      continue;
    }
    setError(detail.field as Path<T>, {
      type: 'server',
      message: detail.message,
    });
  }
  return everyHasField;
};
