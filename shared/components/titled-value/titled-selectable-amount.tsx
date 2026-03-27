import { TOKENS } from '@lidofinance/lido-csm-sdk';
import { ComponentProps, FC, ReactNode } from 'react';
import { AmountWithPrice, IconTooltip, Stack } from 'shared/components';
import { TitledValue } from 'shared/components/titled-value/titled-value';
import styled from 'styled-components';

type Props = {
  title?: ReactNode;
  help?: string;
  helpIcon?: ComponentProps<typeof IconTooltip>['type'];
  warning?: boolean;
  loading?: boolean;
  amount?: bigint;
  token?: TOKENS;
  sign?: 'minus' | 'plus';
};

const SelectableAmountStyle = styled(TitledValue)`
  label > svg + div {
    margin: 0;

    p {
      color: inherit;
    }
  }
`;

export const TitledSelectableAmount: FC<Props> = ({
  title,
  help,
  helpIcon,
  warning,
  loading,
  amount,
  token,
  sign,
  ...props
}) => (
  <SelectableAmountStyle
    warning={warning}
    title={
      <Stack gap="xs" center>
        {title}
        <IconTooltip tooltip={help} type={helpIcon} />
      </Stack>
    }
    value={<AmountWithPrice {...{ amount, token, loading, sign }} />}
    {...props}
  />
);
