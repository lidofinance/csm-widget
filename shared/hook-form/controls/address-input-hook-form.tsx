import { useController, useFormContext } from 'react-hook-form';
import { InputAddress } from 'shared/components/input-address';
import { isValidationErrorTypeValidate } from '../validation/validation-error';
import { hasFieldValue } from './has-field-value';
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

  // show errors once the field is touched or already holds a value
  // (e.g. restored from storage on reload) — but keep empty untouched
  // fields clean on first mount
  const hasErrorHighlight =
    (isTouched || hasFieldValue(field.value)) &&
    (isValidationErrorTypeValidate(error?.type) ||
      error?.type === 'required' ||
      error?.type === 'manual');
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
            Connected address
          </Button>
        )
      }
      {...props}
      {...field}
      error={testableError(errorProp ?? errorMessage)}
      disabled={props.disabled ?? field.disabled}
      isLocked={isLocked}
      label={label ?? fieldName}
      fullwidth
    />
  );
};
