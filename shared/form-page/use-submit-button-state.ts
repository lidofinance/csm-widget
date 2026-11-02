import { useDappStatus } from 'modules/web3';
import { useFormState, useWatch } from 'react-hook-form';
import { hasErrors } from 'shared/hook-form/validation/validation-error';
import {
  getSubmitButtonState,
  IntentFormInput,
  SubmitButtonState,
} from './submit-button-state';

export type SubmitButtonStateOptions = {
  disabled?: boolean;
  disableIfClean?: boolean;
  intent?: string;
};

export const useSubmitButtonState = ({
  disabled,
  disableIfClean,
  intent,
}: SubmitButtonStateOptions): SubmitButtonState => {
  const { isAccountActive } = useDappStatus();
  const { isValidating, isSubmitting, isDirty, errors } =
    useFormState<Record<string, unknown>>();
  const formIntent = useWatch<IntentFormInput>({ name: 'intent' });

  return getSubmitButtonState({
    isAccountActive,
    hasErrors: hasErrors(errors),
    isDirty,
    isValidating,
    isSubmitting,
    disabled,
    disableIfClean,
    formIntent,
    intent,
  });
};
