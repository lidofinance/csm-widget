import { Checkbox, CheckboxProps } from '@lidofinance/lido-app-ui';
import { FIELD_ERROR_TEST_ID } from './field-error';
import { FC } from 'react';
import styled from 'styled-components';
import { useFieldController } from './use-field-controller';

const TopAlignedCheckbox = styled(Checkbox)`
  && {
    align-items: flex-start;
  }
`;

export type CheckboxFieldProps = Omit<
  CheckboxProps,
  | 'name'
  | 'checked'
  | 'defaultChecked'
  | 'value'
  | 'onChange'
  | 'onBlur'
  | 'error'
> & { name: string };

export const CheckboxField: FC<CheckboxFieldProps> = ({
  name,
  disabled,
  ...rest
}) => {
  const { field, invalid, message } = useFieldController({ name });

  return (
    <TopAlignedCheckbox
      {...rest}
      ref={field.ref}
      name={field.name}
      checked={!!field.value}
      onChange={field.onChange}
      onBlur={field.onBlur}
      disabled={disabled || field.disabled}
      error={message || invalid}
      dataTestId={{ ...rest.dataTestId, error: FIELD_ERROR_TEST_ID }}
    />
  );
};
