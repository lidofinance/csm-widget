import { useController, UseControllerProps } from 'react-hook-form';

import { InputPercent } from 'shared/components/input-amount';
import { isValidationErrorTypeValidate } from 'shared/hook-form/validation/validation-error';
import { testableError } from './testable-error';

type PercentInputHookFormProps = Partial<
  React.ComponentProps<typeof InputPercent>
> & {
  fieldName: string;
  label?: string;
  showErrorMessage?: boolean;
  rules?: UseControllerProps['rules'];
};

export const PercentInputHookForm = ({
  fieldName,
  label,
  showErrorMessage = true,
  rules,
  error: errorProp,
  ...props
}: PercentInputHookFormProps) => {
  const {
    field,
    fieldState: { error, isTouched },
  } = useController({ name: fieldName, rules });

  const hasErrorHighlight =
    (isTouched || rules?.required) &&
    (isValidationErrorTypeValidate(error?.type) || error?.type === 'required');
  const errorMessage = hasErrorHighlight && (error?.message || true);

  return (
    <InputPercent
      {...props}
      {...field}
      disabled={props.disabled ?? field.disabled}
      error={testableError(
        errorProp ?? (showErrorMessage ? errorMessage : hasErrorHighlight),
      )}
      label={label ?? fieldName}
      fullwidth
    />
  );
};
