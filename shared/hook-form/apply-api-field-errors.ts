import type { FieldValues, Path, UseFormSetError } from 'react-hook-form';
import { isSurveysApiError } from 'utils/surveys-api-guard';

// Root segment of a dotted/bracketed DTO path, e.g. `additionalAddresses[0]`
// and `items[0].signature` both root to their leading identifier. Used to match
// a server `field` against the form's known top-level inputs.
const rootField = (path: string): string => path.split(/[.[]/, 1)[0];

// Map a VALIDATION_FAILED envelope onto react-hook-form inputs. `details[].field`
// uses dotted/bracketed DTO paths that are expected to match form field names.
//
// A detail is "handled inline" (gets setError + counts toward suppressing the
// modal) ONLY when it HAS a field AND that field's root segment is a known form
// input (or no `knownFields` list was provided, i.e. trust every field). A detail
// that is fieldless OR points at an input the form does not render is NOT applied
// inline — RHF would otherwise register a phantom error that silently freezes the
// form (a non-existent field still flips `everyHasField`, suppressing the modal,
// so the message vanishes with no visible feedback).
//
// Returns true to suppress the generic modal ONLY when EVERY detail was handled
// inline. If any detail is fieldless or unknown, returns false so the failure
// modal still shows: it renders ALL details as a bullet list, so no message is
// lost.
//
// Uses the structural guard (not `instanceof SurveysApiError`) to avoid
// importing modules/surveys-sdk, which transitively loads Next.js runtime
// config and breaks Jest unit tests.
export const applyApiFieldErrors = <T extends FieldValues>(
  error: unknown,
  setError: UseFormSetError<T>,
  knownFields?: ReadonlyArray<string>,
): boolean => {
  const api = isSurveysApiError(error) ? error.apiError : undefined;
  if (!api || api.code !== 'VALIDATION_FAILED' || !api.details?.length)
    return false;
  let everyHandledInline = true;
  for (const detail of api.details) {
    const isKnownField =
      !!detail.field &&
      (!knownFields || knownFields.includes(rootField(detail.field)));
    if (!isKnownField) {
      everyHandledInline = false;
      continue;
    }
    setError(detail.field as Path<T>, {
      type: 'server',
      message: detail.message,
    });
  }
  return everyHandledInline;
};
