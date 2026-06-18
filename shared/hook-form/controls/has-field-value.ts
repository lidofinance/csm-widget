// A field counts as "having a value" once it holds non-empty content.
// Used to surface validation errors on fields that already hold data
// (e.g. restored from storage on reload) without highlighting pristine
// empty fields on first mount.
// Note: 0 / 0n / false are real values — don't use Boolean() here.
export const hasFieldValue = (value: unknown): boolean =>
  value != null && value !== '';
