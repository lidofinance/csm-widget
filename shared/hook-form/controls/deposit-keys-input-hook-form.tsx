import { useController } from 'react-hook-form';
import { Textarea } from '@lidofinance/lido-ui';

import { isValidationErrorTypeValidate } from 'shared/hook-form/validation/validation-error';
import styled from 'styled-components';

const TextareaStyle = styled(Textarea)`
  textarea {
    word-break: break-all;
    font-family: monospace;
    font-size: ${({ theme }) => theme.fontSizesMap.xxs}px;
    line-height: 1.6em;
  }
`;

type DepositKeysInputHookFormProps = Partial<
  React.ComponentProps<typeof Textarea>
> & {
  label?: string;
  fieldName?: string;
  showErrorMessage?: boolean;
};

export const DepositKeysInputHookForm = ({
  fieldName = 'rawKeys',
  label = 'Copy JSON with deposit data here',
  showErrorMessage = true,
  error: errorProp,
  ...props
}: DepositKeysInputHookFormProps) => {
  const {
    field,
    fieldState: { error },
  } = useController({ name: fieldName });
  const hasErrorHighlight = isValidationErrorTypeValidate(error?.type);
  // allows to show error state without message
  const errorMessage = hasErrorHighlight && (error?.message || true);
  return (
    <TextareaStyle
      {...props}
      {...field}
      disabled={props.disabled ?? field.disabled}
      error={errorProp ?? (showErrorMessage ? errorMessage : hasErrorHighlight)}
      label={label}
      rows={6}
      fullwidth
    />
  );
};
