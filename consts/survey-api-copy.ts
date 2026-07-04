// Operator-facing copy for csm-survey-api domain error codes. Keyed by the
// stable envelope `code`. Unknown codes fall back to the server message (which
// is English and may change) and are logged once so missing copy is noticed.
// Source catalog: docs/api-errors-guide.md.
export const SURVEY_API_COPY: Record<string, string> = {
  // Auth (non-JWT codes — JWT codes land in SESSION_EXPIRED bucket, handled by
  // the static ERROR_META map in shared/transaction-modal; they must NOT appear
  // here or getApiDescription would override the polished static copy).
  AUTH_SIWE_VERIFICATION_FAILED:
    'We could not verify your signature. Please try signing in again.',
  AUTH_CHAIN_ID_MISMATCH:
    'Your wallet is connected to the wrong network for this app',
  AUTH_NOT_AUTHORIZED: 'This address is not authorized',

  // Operator access
  OPERATOR_ACCESS_DENIED:
    'Your wallet is not the manager or reward address for this operator',
  OPERATOR_NOT_DELEGATE:
    'Your wallet is not a registered delegate for this operator',
  OPERATOR_NOT_FOUND: 'No operator exists at this id',

  // Delegates
  DELEGATES_LIMIT_REACHED: 'You have reached the maximum number of delegates',
  DELEGATES_ALREADY_EXISTS: 'This address is already a delegate',
  DELEGATES_NOT_FOUND: 'This delegate was not found',

  // Files
  FILES_EMPTY_PAYLOAD: 'No file was uploaded',
  FILES_NOT_FOUND: 'The requested file does not exist',

  // Members
  MEMBERS_NO_BINDABLE_FORM:
    'There is no approved form to bind to the active set',
  MEMBERS_ALREADY_INITIALIZED: 'The member set was already initialized',
  MEMBERS_FORM_CONCURRENTLY_BOUND:
    'Someone else just bound this form. Please re-read the state and try again.',
  MEMBERS_NO_SLOTS_PROVIDED: 'Add at least one slot to continue',
  MEMBERS_FIRST_SUBMISSION_INCOMPLETE:
    'The initial submission must include all required members',
  MEMBERS_DUPLICATE_SLOT_ADDRESS:
    'The same address appears in more than one slot',
  MEMBERS_ADDRESS_ALREADY_ACTIVE: 'That address is already in the active set',
  MEMBERS_ADDRESS_UNCHANGED: 'This rotation does not change the slot',
  MEMBERS_SIGNATURE_INVALID:
    "The member's ownership signature could not be verified",
  MEMBERS_CONCURRENT_SUBMISSION:
    'The state changed during submission. Please re-read it and try again.',
  MEMBERS_DUPLICATE_ADDRESS: 'This address appears more than once',

  // ICS / IDVTC forms
  ICS_MAIN_ADDRESS_MISMATCH:
    "The main address does not match the operator's reward address",
  ICS_NOT_REJECTED:
    'You can resubmit only after the previous form was rejected',
  ICS_SIGNATURE_INVALID: 'One of the signatures could not be verified',
  IDVTC_MAIN_ADDRESS_MISMATCH:
    "The main address does not match the operator's reward address",
  IDVTC_NOT_REJECTED:
    'You can resubmit only after the previous form was rejected',
  IDVTC_SIGNATURE_INVALID: 'One of the signatures could not be verified',
  IDVTC_CLUSTER_MEMBER_NOT_IN_ICS:
    'A cluster member is not part of the ICS set',

  // Validation (details[] carry the per-field text)
  VALIDATION_FAILED: 'Please fix the highlighted fields and try again',
};

// `*_CONCURRENT_*` and `*_CONCURRENTLY_*` codes are explicit retry signals: the
// caller lost an optimistic race and should re-read state and retry.
export const isConcurrencyRetry = (code?: string): boolean =>
  !!code && /CONCURRENT/.test(code);

export const getSurveyApiCopy = (
  code: string | undefined,
  fallbackMessage: string,
): string => {
  if (!code) return fallbackMessage;
  const copy = SURVEY_API_COPY[code];
  if (!copy) console.warn('[csm-api] missing copy for', code);
  return copy ?? fallbackMessage;
};
