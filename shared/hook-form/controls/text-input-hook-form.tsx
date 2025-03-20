import { Input } from '@lidofinance/lido-ui';
import { useController, UseControllerProps } from 'react-hook-form';
import { InputAddress } from 'shared/components/input-address';
import { isValidationErrorTypeValidate } from '../validation/validation-error';

type BlockhashInputHookFormProps = Partial<
  React.ComponentProps<typeof InputAddress>
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
    fieldState: { error },
  } = useController({
    name: fieldName,
    defaultValue: '',
    rules,
  });

  const hasErrorHighlight =
    isValidationErrorTypeValidate(error?.type) || error?.type === 'required';
  // allows to show error state without message
  const errorMessage = hasErrorHighlight && (error?.message || true);

  return (
    <Input
      {...props}
      {...field}
      disabled={props.disabled || field.disabled}
      error={errorProp ?? errorMessage}
      label={label ?? fieldName}
      spellCheck="false"
      fullwidth
    />
  );
};
