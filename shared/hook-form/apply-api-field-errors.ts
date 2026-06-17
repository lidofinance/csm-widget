import type { FieldValues, Path, UseFormSetError } from 'react-hook-form';
import { isValidationError } from 'modules/surveys-sdk/api/api-error';
import { SurveysApiError } from 'modules/surveys-sdk/api/errors';

// Map a VALIDATION_FAILED envelope onto react-hook-form inputs. `details[].field`
// uses dotted/bracketed DTO paths that match the form field names 1:1. Returns
// true when at least one field error was applied, so callers can suppress the
// generic modal in that case.
export const applyApiFieldErrors = <T extends FieldValues>(
  error: unknown,
  setError: UseFormSetError<T>,
): boolean => {
  const api = error instanceof SurveysApiError ? error.apiError : undefined;
  if (!api || !isValidationError(api) || !api.details?.length) return false;
  let applied = false;
  for (const detail of api.details) {
    if (!detail.field) continue;
    setError(detail.field as Path<T>, {
      type: 'server',
      message: detail.message,
    });
    applied = true;
  }
  return applied;
};
