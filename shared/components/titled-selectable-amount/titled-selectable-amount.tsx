import { ComponentProps, FC, ReactNode } from 'react';
import { AmountWithPrice, IconTooltip, Stack } from 'shared/components';
import { TitledAmountStyle } from './style';
import { TOKENS } from '@lidofinance/lido-csm-sdk';

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
}) => {
  return (
    <TitledAmountStyle $warning={warning} {...props}>
      <Stack gap="xs" center>
        {title}
        <IconTooltip tooltip={help} type={helpIcon} />
      </Stack>
      <AmountWithPrice {...{ amount, token, loading, sign }} />
    </TitledAmountStyle>
  );
};
