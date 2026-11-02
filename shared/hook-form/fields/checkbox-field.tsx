import { CheckboxProps } from '@lidofinance/lido-app-ui';
import { FC, useId } from 'react';
import styled from 'styled-components';
import { FieldError } from './field-error';
import { CheckboxFieldStyle, CheckboxStyle } from './styles';
import { useFieldController } from './use-field-controller';

// Kept here, not in styles.tsx: field-error.tsx imports styles.tsx (cycle)
const CheckboxErrorStyle = styled(FieldError)`
  /* 24px box + 12px lib gap: aligns the message with the label text */
  padding-left: 36px;
`;

export type CheckboxFieldProps = Omit<
  CheckboxProps,
  'name' | 'checked' | 'defaultChecked' | 'value' | 'onChange' | 'onBlur'
> & { name: string };

export const CheckboxField: FC<CheckboxFieldProps> = ({
  name,
  disabled,
  ...rest
}) => {
  const { field, invalid, message } = useFieldController({ name });
  const errorId = useId();

  return (
    <CheckboxFieldStyle>
      <CheckboxStyle
        {...rest}
        ref={field.ref}
        name={field.name}
        checked={!!field.value}
        onChange={field.onChange}
        onBlur={field.onBlur}
        disabled={disabled || field.disabled}
        aria-invalid={invalid || undefined}
        aria-describedby={message ? errorId : undefined}
      />
      <CheckboxErrorStyle id={errorId}>{message}</CheckboxErrorStyle>
    </CheckboxFieldStyle>
  );
};
