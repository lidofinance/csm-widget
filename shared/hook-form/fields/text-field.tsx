import { Input, InputProps } from '@lidofinance/lido-app-ui';
import { FC, ReactNode } from 'react';
import { FIELD_ERROR_TEST_ID } from './field-error';
import { useFieldController } from './use-field-controller';

export type TextFieldProps = Omit<
  InputProps,
  'name' | 'value' | 'defaultValue' | 'onChange' | 'onBlur' | 'error' | 'label'
> & {
  name: string;
  label: ReactNode;
  showUntouched?: boolean;
};

export const TextField: FC<TextFieldProps> = ({
  name,
  label,
  showUntouched,
  disabled,
  dataTestId,
  ...rest
}) => {
  const { field, invalid, message } = useFieldController({
    name,
    defaultValue: '',
    showUntouched,
  });

  return (
    <Input
      spellCheck={false}
      {...rest}
      ref={field.ref}
      name={field.name}
      value={field.value ?? ''}
      onChange={field.onChange}
      onBlur={field.onBlur}
      label={label}
      disabled={disabled || field.disabled}
      error={message ?? invalid}
      dataTestId={{ ...dataTestId, error: FIELD_ERROR_TEST_ID }}
    />
  );
};
