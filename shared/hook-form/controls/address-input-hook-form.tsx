import { useController, useFormContext } from 'react-hook-form';
import { InputAddress } from 'shared/components/input-address';
import { isValidationErrorTypeValidate } from '../validation/validation-error';
import { testableError } from './testable-error';
import { Button } from '@lidofinance/lido-ui';
import { ReactNode, useCallback } from 'react';

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
    fieldState: { error, isTouched },
  } = useController({
    name: fieldName,
    defaultValue: '',
  });

  const { setValue } = useFormContext();

  const hasErrorHighlight =
    isTouched &&
    (isValidationErrorTypeValidate(error?.type) ||
      error?.type === 'required' ||
      error?.type === 'manual');
  // allows to show error state without message
  const errorMessage = hasErrorHighlight && error?.message;

  const onClick = useCallback(() => {
    setValue(fieldName, currentAddress, { shouldValidate: true });
  }, [currentAddress, fieldName, setValue]);

  return (
    <InputAddress
      rightDecorator={
        currentAddress && (
          <Button size="xs" variant="translucent" onClick={onClick}>
            Connected address
          </Button>
        )
      }
      {...props}
      {...field}
      error={testableError(errorProp ?? errorMessage, fieldName)}
      disabled={props.disabled ?? field.disabled}
      isLocked={isLocked}
      label={label ?? fieldName}
      fullwidth
    />
  );
};
