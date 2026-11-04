import {
  SectionTitle,
  TokenSelector,
  TokenSelectorDataTestId,
  TokenSelectorOption,
} from '@lidofinance/lido-app-ui';
import { FC, ReactNode } from 'react';
import { FieldError } from './field-error';
import { FieldStackStyle } from './styles';
import { useFieldController } from './use-field-controller';
import { useFocusableRef } from './use-focusable-ref';

export const TOKEN_SELECT_TEST_ID: TokenSelectorDataTestId = {
  root: 'tokenSelect',
  trigger: 'tokenSelectTrigger',
  panel: 'tokenSelectPanel',
};

export const TOKEN_SELECT_TRIGGER_SELECTOR = `[data-testid="${TOKEN_SELECT_TEST_ID.trigger}"]`;

export type TokenSelectFieldProps = {
  name: string;
  options: TokenSelectorOption[];
  label?: string;
  /** Second line of the title row; shown only with `label`. */
  subtitle?: ReactNode;
  action?: ReactNode;
};

export const TokenSelectField: FC<TokenSelectFieldProps> = ({
  name,
  options,
  label,
  subtitle,
  action,
}) => {
  const { field, message } = useFieldController({ name });
  const ref = useFocusableRef(field.ref, TOKEN_SELECT_TRIGGER_SELECTOR);

  return (
    <FieldStackStyle ref={ref}>
      {label && (
        <SectionTitle title={label} subtitle={subtitle} action={action} />
      )}
      <TokenSelector
        options={options}
        value={field.value}
        onChange={field.onChange}
        onBlur={field.onBlur}
        dataTestId={TOKEN_SELECT_TEST_ID}
      />
      <FieldError>{message}</FieldError>
    </FieldStackStyle>
  );
};
