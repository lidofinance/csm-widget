import { Select, SelectProps } from '@lidofinance/lido-app-ui';
import { FC } from 'react';
import { FIELD_ERROR_TEST_ID } from './field-error';
import { useFieldController } from './use-field-controller';

export type SelectFieldProps = Omit<
  SelectProps,
  'name' | 'value' | 'defaultValue' | 'onChange' | 'onBlur' | 'error'
> & {
  name: string;
  showUntouched?: boolean;
  required?: boolean;
};

export const SelectField: FC<SelectFieldProps> = ({
  name,
  showUntouched,
  required,
  placeholder = 'Select',
  disabled,
  dataTestId,
  ...rest
}) => {
  const { field, invalid, message } = useFieldController({
    name,
    defaultValue: '',
    rules: { required },
    showUntouched,
  });

  return (
    <Select
      {...rest}
      ref={field.ref}
      name={field.name}
      value={field.value ?? ''}
      onChange={field.onChange}
      onBlur={field.onBlur}
      placeholder={placeholder}
      disabled={disabled || field.disabled}
      error={message ?? invalid}
      dataTestId={{ ...dataTestId, error: FIELD_ERROR_TEST_ID }}
    />
  );
};
