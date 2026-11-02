import type { FieldError } from 'react-hook-form';
import { isValidationErrorTypeValidate } from '../validation/validation-error';

// 0 / 0n / false are real values — don't use Boolean() here
export const hasFieldValue = (value: unknown): boolean =>
  value != null && value !== '';

export type FieldErrorStateInput = {
  error?: FieldError;
  isTouched: boolean;
  isSubmitted: boolean;
  value: unknown;
  showUntouched?: boolean;
};

export type FieldErrorState = { invalid: boolean; message?: string };

const isShownErrorType = (type?: string) =>
  isValidationErrorTypeValidate(type) ||
  type === 'required' ||
  type === 'manual';

export const getFieldErrorState = ({
  error,
  isTouched,
  isSubmitted,
  value,
  showUntouched,
}: FieldErrorStateInput): FieldErrorState => {
  const revealed =
    isTouched || isSubmitted || !!showUntouched || hasFieldValue(value);

  if (!error || !revealed || !isShownErrorType(error.type)) {
    return { invalid: false };
  }

  return { invalid: true, message: error.message || undefined };
};
