import { useController, UseControllerProps } from 'react-hook-form';

import { InputAmount } from 'shared/components/input-amount';

import { getTokenDisplayName } from 'utils/getTokenDisplayName';
import { isValidationErrorTypeValidate } from 'shared/hook-form/validation/validation-error';

type TokenAmountInputHookFormProps = Partial<
  React.ComponentProps<typeof InputAmount>
> & {
  isLocked?: boolean;
  maxValue?: bigint;
  token: Parameters<typeof getTokenDisplayName>[0];
  fieldName: string;
  showErrorMessage?: boolean;
  rules?: UseControllerProps['rules'];
};

export const TokenAmountInputHookForm = ({
  isLocked,
  maxValue,
  token,
  fieldName,
  rules,
  showErrorMessage = true,
  error: errorProp,
  ...props
}: TokenAmountInputHookFormProps) => {
  const {
    field,
    fieldState: { error, isTouched },
  } = useController({ name: fieldName, rules });
  const hasErrorHighlight =
    (isTouched || rules?.required) &&
    (isValidationErrorTypeValidate(error?.type) || error?.type === 'required');
  // allows to show error state without message
  const errorMessage = hasErrorHighlight && (error?.message || true);

  return (
    <InputAmount
      {...props}
      {...field}
      disabled={props.disabled ?? field.disabled}
      error={errorProp ?? (showErrorMessage ? errorMessage : hasErrorHighlight)}
      isLocked={isLocked}
      maxValue={maxValue}
      label={`${getTokenDisplayName(token)} amount`}
      fullwidth
    />
  );
};
