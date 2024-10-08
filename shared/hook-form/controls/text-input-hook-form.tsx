import { Input } from '@lidofinance/lido-ui';
import { useController } from 'react-hook-form';
import { InputAddress } from 'shared/components/input-address';
import { isValidationErrorTypeValidate } from '../validation/validation-error';

type BlockhashInputHookFormProps = Partial<
  React.ComponentProps<typeof InputAddress>
> & {
  fieldName: string;
  label?: string;
};

export const TextInputHookForm = ({
  fieldName,
  label,
  error: errorProp,
  ...props
}: BlockhashInputHookFormProps) => {
  const {
    field,
    fieldState: { error },
  } = useController({
    name: fieldName,
    defaultValue: '',
  });

  const hasErrorHighlight = isValidationErrorTypeValidate(error?.type);
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
