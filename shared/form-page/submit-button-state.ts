export type IntentFormInput = {
  intent?: string;
};

export type SubmitButtonState = {
  showConnect: boolean;
  disabled: boolean;
  loading: boolean;
};

export type SubmitButtonStateInput = {
  isAccountActive: boolean;
  hasErrors: boolean;
  isDirty: boolean;
  isValidating: boolean;
  isSubmitting: boolean;
  disabled?: boolean;
  disableIfClean?: boolean;
  formIntent?: string;
  intent?: string;
};

export const getSubmitButtonState = ({
  isAccountActive,
  hasErrors,
  isDirty,
  isValidating,
  isSubmitting,
  disabled,
  disableIfClean,
  formIntent,
  intent,
}: SubmitButtonStateInput): SubmitButtonState => {
  const isBusy = isValidating || isSubmitting;
  const isOwnIntent = formIntent === intent;

  return {
    showConnect: !isAccountActive,
    loading: isBusy && isOwnIntent,
    disabled:
      hasErrors ||
      (!!disableIfClean && !isDirty) ||
      !!disabled ||
      (isBusy && !isOwnIntent),
  };
};
