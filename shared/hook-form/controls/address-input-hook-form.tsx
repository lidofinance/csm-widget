import { useController, useFormContext } from 'react-hook-form';
import { InputAddress } from 'shared/components/input-address';
import { isValidationErrorTypeValidate } from '../validation/validation-error';
import { Button } from '@lidofinance/lido-ui';
import { ReactNode, useCallback } from 'react';

// TODO: type Address
type AddressInputHookFormProps = Partial<
  React.ComponentProps<typeof InputAddress>
> & {
  fieldName: string;
  label?: ReactNode;
  isLocked?: boolean;
  currentAddress?: string;
};

export const AddressInputHookForm = ({
  fieldName,
  label,
  isLocked,
  currentAddress,
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

  const { setValue } = useFormContext();

  const hasErrorHighlight = isValidationErrorTypeValidate(error?.type);
  // allows to show error state without message
  const errorMessage = hasErrorHighlight && (error?.message || true);

  const onClick = useCallback(() => {
    setValue(fieldName, currentAddress, { shouldValidate: true });
  }, [currentAddress, fieldName, setValue]);

  return (
    <InputAddress
      rightDecorator={
        currentAddress && (
          <Button size="xs" variant="translucent" onClick={onClick}>
            Current
          </Button>
        )
      }
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
