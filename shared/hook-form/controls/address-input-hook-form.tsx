import { useController } from 'react-hook-form';
import { InputAddress } from 'shared/components/input-address';
import { isValidationErrorTypeValidate } from '../validation/validation-error';

type AddressInputHookFormProps = Partial<
  React.ComponentProps<typeof InputAddress>
> & {
  fieldName: string;
  label?: string;
  isLocked?: boolean;
};

export const AddressInputHookForm = ({
  fieldName,
  label,
  isLocked,
  error: errorProp,
  ...props
}: AddressInputHookFormProps) => {
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
    <InputAddress
      {...props}
      {...field}
      error={errorProp ?? errorMessage}
      disabled={props.disabled ?? field.disabled}
      isLocked={isLocked}
      label={label ?? fieldName}
      fullwidth
    />
  );
};
