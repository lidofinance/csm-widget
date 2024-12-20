import { Checkbox } from '@lidofinance/lido-ui';
import { FC } from 'react';
import { useController, useFormState } from 'react-hook-form';
import styled from 'styled-components';

type CheckboxProps = Partial<React.ComponentProps<typeof Checkbox>> & {
  fieldName: string;
};

export const CheckboxHookForm: FC<CheckboxProps> = ({ fieldName, ...rest }) => {
  const { errors } = useFormState<Record<string, unknown>>();
  const hasError = !!errors?.[fieldName];

  const { field } = useController({
    name: fieldName,
  });

  return (
    <CheckboxStyled
      {...rest}
      {...field}
      value=""
      checked={!!field.value}
      className={hasError ? 'error' : undefined}
    />
  );
};

const CheckboxStyled = styled(Checkbox)`
  align-items: start;

  > div {
    margin-left: 12px;
    flex-grow: 1;
  }
  p {
    line-height: 22px;
  }
  svg {
    flex-shrink: 0;
  }

  &.error {
    &:hover input:not(:disabled):not(:checked) + svg,
    svg {
      box-shadow: inset 0 0 0 1px var(--lido-color-error);
    }
  }
`;
