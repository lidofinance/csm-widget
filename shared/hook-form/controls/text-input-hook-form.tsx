import { Input } from '@lidofinance/lido-ui';
import { useController, UseControllerProps } from 'react-hook-form';
import { isValidationErrorTypeValidate } from '../validation/validation-error';
import { hasFieldValue } from './has-field-value';
import { testableError } from './testable-error';

type BlockhashInputHookFormProps = Partial<
  React.ComponentProps<typeof Input>
> & {
  fieldName: string;
  label?: string;
  rules?: UseControllerProps['rules'];
};

export const TextInputHookForm = ({
  fieldName,
  label,
  rules,
  error: errorProp,
  ...props
}: BlockhashInputHookFormProps) => {
  const {
    field,
    fieldState: { error, isTouched },
  } = useController({
    name: fieldName,
    defaultValue: '',
    rules,
  });

  // show errors once the field is touched or already holds a value
  // (e.g. restored from storage on reload) — but keep empty untouched
  // fields clean on first mount
  const hasErrorHighlight =
    (isTouched || hasFieldValue(field.value) || rules?.required) &&
    (isValidationErrorTypeValidate(error?.type) ||
      error?.type === 'required' ||
      error?.type === 'manual');
  // allows to show error state without message
  const errorMessage = hasErrorHighlight && (error?.message || true);

  return (
    <Input
      {...props}
      {...field}
      disabled={props.disabled || field.disabled}
      error={testableError(errorProp ?? errorMessage)}
      label={label ?? fieldName}
      spellCheck="false"
      fullwidth
    />
  );
};
