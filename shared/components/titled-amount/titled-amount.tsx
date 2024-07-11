import { InlineLoader } from '@lidofinance/lido-ui';
import { TOKENS } from 'consts/tokens';
import { BigNumber } from 'ethers';
import { FC, ReactNode } from 'react';
import { IconTooltip, Stack } from 'shared/components';
import { FormatToken } from 'shared/formatters';
import { AmountStyle, TitledAmountStyle } from './style';

type TitledAddressProps = {
  title?: ReactNode;
  help?: string;
  loading?: boolean;
  amount?: BigNumber;
  token?: TOKENS;
  warning?: boolean;
};

// TODO: merge components
export const TitledAmount: FC<TitledAddressProps> = ({
  amount,
  token,
  title,
  help,
  loading,
  warning,
}) => {
  return (
    <TitledAmountStyle $warning={warning && amount?.gt(0)}>
      <Stack gap="xs" center>
        {title}
        <IconTooltip help={help} />
      </Stack>
      {loading ? (
        <InlineLoader color="text" />
      ) : (
        <AmountStyle>
          <FormatToken amount={amount} token={token} />
        </AmountStyle>
      )}
    </TitledAmountStyle>
  );
};
