import { useController, UseControllerProps } from 'react-hook-form';

import { InputNumber } from 'shared/components/input-amount/input-number';
import { isValidationErrorTypeValidate } from 'shared/hook-form/validation/validation-error';

type NumberInputHookFormProps = Partial<
  React.ComponentProps<typeof InputNumber>
> & {
  isLocked?: boolean;
  maxValue?: number;
  fieldName: string;
  label?: string;
  showErrorMessage?: boolean;
  rules?: UseControllerProps['rules'];
};

export const NumberInputHookForm = ({
  isLocked,
  maxValue,
  fieldName,
  label,
  showErrorMessage = true,
  rules,
  error: errorProp,
  ...props
}: NumberInputHookFormProps) => {
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
    <InputNumber
      {...props}
      {...field}
      disabled={props.disabled ?? field.disabled}
      error={errorProp ?? (showErrorMessage ? errorMessage : hasErrorHighlight)}
      isLocked={isLocked}
      maxValue={maxValue}
      label={label ?? fieldName}
      fullwidth
    />
  );
};
